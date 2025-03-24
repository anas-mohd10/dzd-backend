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
  selectAllChecked: boolean = false;

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

  toggleSelectAll() {
    if (this.selectAllChecked) {
      // Deselect all - remove all current dropdown results from inputs
      const idsToRemove = new Set(this.dropdownResults.map(item => item._id));
      this.dropdownInputs = this.dropdownInputs.filter(item => !idsToRemove.has(item._id));
      this.HotToastService.info("All items deselected");
    } else {
      // Select all - add all current dropdown results that aren't already selected
      const existingIds = new Set(this.dropdownInputs.map(item => item._id));
      const newItems = this.dropdownResults.filter(item => !existingIds.has(item._id));
      
      if (newItems.length > 0) {
        this.dropdownInputs = [...this.dropdownInputs, ...newItems];
        this.HotToastService.success("All items selected");
      }
    }
    
    this.selectAllChecked = !this.selectAllChecked;
    this.ChangeDetectorRef.markForCheck();
    this.onSelect.emit({ dropdownInputs: this.dropdownInputs });
  }

  updateSelectAllStatus() {
    // Check if all items in dropdown results are already in dropdownInputs
    this.selectAllChecked = this.dropdownResults.length > 0 && 
      this.dropdownResults.every(item => this.isItemExists(item));
    this.ChangeDetectorRef.markForCheck();
  }

  onSelectItem(item: any, isExists: boolean) {
    switch (this.type) {
      case "products":
      case "brands":
      case "collections":
      case "categories":
      case "parents":
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

  onInputFocus() {
    if (this.keyword.value.trim()) {
      this.onKeywordChange(this.keyword.value.trim());
    }
  }

  onKeywordChange(params: string) {
    this.PlatformService.getRedirectionResults({ keyword: params }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          const resultMap: { [key: string]: any[] } = {
            products: res?.result?.products || [],
            categories: res?.result?.categories || [],
            brands: res?.result?.brands || [],
            parents: res?.result?.parents || [],
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

  clearResults() {
    this.keyword.setValue("");
    this.dropdownResults = [];
  }

}
