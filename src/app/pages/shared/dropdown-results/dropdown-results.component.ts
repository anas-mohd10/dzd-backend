import { Component, EventEmitter, ChangeDetectorRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { debounceTime } from 'rxjs/operators';
import { PlatformService } from 'src/app/includes/services/platform.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dropdown-results',
  templateUrl: './dropdown-results.component.html',
  styleUrls: ['./dropdown-results.component.scss']
})
export class DropdownResultsComponent implements OnInit, OnChanges {
  @Input("type") type: string = "products";
  @Output("onSelect") onSelect: EventEmitter<any> = new EventEmitter();
  @Input("dropdownInputs") dropdownInputs: any[] = [];
  keyword: FormControl = new FormControl("", Validators.required);
  dropdownResults: Array<any> = [];
  isSubmitted: boolean = false;
  imageBase: string = environment.base

  constructor(
    private PlatformService: PlatformService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) {
    this.keyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe((keywordValue) => {
        this.onKeywordChange(keywordValue)
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  isItemExists(item: any) {
    return this.dropdownInputs.some((input: any) => input._id === item._id)
  }

  onSelectItem(item: any, isExists: boolean) {
    switch (this.type) {
      case "products":
      case "brands":
      case "collections":
      case "categories":
        if (isExists) {
          this.HotToastService.info("Item removed successfully")
          this.dropdownInputs = this.dropdownInputs.filter((input: any) => input._id !== item._id);
        } else {
          this.HotToastService.success("Item added successfully")
          this.dropdownInputs.push(item);
        }
        this.ChangeDetectorRef.markForCheck()
        this.onSelect.emit({ dropdownInputs: this.dropdownInputs });
        this.keyword.setValue("")
        this.dropdownResults = []
        break;
      default:
        this.HotToastService.error("Invalid type selected. Please try again.")
        break;
    }
  }

  onKeywordChange(params: string) {
    if (!params) {
      this.dropdownResults = [];
      return;
    }

    this.PlatformService.getRedirectionResults({ keyword: params }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          const resultMap: { [key: string]: any[] } = {
            products: res?.result?.products || [],
            categories: res?.result?.categories || [],
            brands: res?.result?.brands || [],
            collections: res?.result?.collections || [],
            staticPages: res?.result?.staticPages || []
          };
          this.dropdownResults = resultMap[this.type] || [];
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: { message: string }) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

}
