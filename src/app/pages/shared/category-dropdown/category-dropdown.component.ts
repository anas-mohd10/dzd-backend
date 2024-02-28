import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { CategoryService } from 'src/app/includes/services/category.service';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.scss']
})
export class CategoryDropdownComponent implements OnInit, OnChanges {
  categories: Array<any> = [];
  categoryDetails: any;
  @Input('categoryDetails') category?: any;
  @Input('isMultiple') isMultiple: boolean = false;
  @Output() categoryTriggered = new EventEmitter<any>();
  searchKeyword: FormControl = new FormControl('', Validators.required)

  constructor(
    private CategoryService: CategoryService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.category) {
      this.categoryDetails = this.category;
      this.searchKeyword.setValue(this.category.name);
    }
  }

  getCategories() {
    if (!this.searchKeyword.valid) {
      return;
    }

    this.CategoryService.dropdownCategories(this.searchKeyword.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.categories = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    })
  }

  categoryClicked(category: any) {
    this.categoryTriggered.emit(category);
    this.categoryDetails = category;
    if (this.isMultiple) {
      this.searchKeyword.setValue('');
    } else {
      this.searchKeyword.setValue(category.name);
    }
    this.categories = [];
  }

  ngOnInit(): void {
  }

  createCategory() {

  }
}
