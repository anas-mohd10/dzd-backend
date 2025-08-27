import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { debounceTime } from 'rxjs/operators';
import { CategoryService } from 'src/app/includes/services/category.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Category {
  _id: string;
  name: string
  slug: string
  thumbnail: string
}

interface SearchResult {
  data: Array<Category>;
  totalPages: number;
  totalResults: number;
  page: number;
  limit: number;
  isLastPage: boolean;
}

interface WidgetItem {
  title: string
  redirection: string
  categoryId: string
  thumbnail: string
}

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  searchKeyword: FormControl = new FormControl('');
  searchResults: SearchResult | null = null;
  widgetCategories: Array<Category> = [];
  pageIndex: number = 1;
  pageSize: number = 10
  @Input() widgetImages: Array<WidgetItem> = [];
  @Output() widgetItemsChange = new EventEmitter<Array<WidgetItem>>();
  baseUrl: string = environment.base;
  form: FormGroup = new FormGroup({})
  editIndex: number | null = null;
  isEditMode: boolean = false;
  storeDomain: string = localStorage.getItem('storeDomain') || '';

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private CategoryService: CategoryService
  ) {
    this.searchKeyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.fetchCategories();
      })
  }

  isCategoryChecked(categoryId: string) {
    return this.widgetImages.some(widgetImage => widgetImage.categoryId === categoryId)
  }

  ngOnInit(): void {
    this.fetchCategories();

    this.form = new FormGroup({
      categoryId: new FormControl(''),
      title: new FormControl(''),
      redirection: new FormControl(''),
      thumbnail: new FormControl(''),
    })
  }

  onCategoryChange(event: Event, categoryDoc: Category) {
    if ((event.target as HTMLInputElement).checked === true) {
      this.widgetImages.push({
        title: categoryDoc.name,
        redirection: `/products/${categoryDoc.slug}`,
        categoryId: categoryDoc._id,
        thumbnail: categoryDoc.thumbnail
      });
    } else {
      this.widgetImages = this.widgetImages.filter((widgetItem) => widgetItem.categoryId !== categoryDoc._id);
    }

    this.widgetItemsChange.emit(this.widgetImages);
  }

  removeItem(index: number) {
    this.widgetImages.splice(index, 1);
    this.widgetItemsChange.emit(this.widgetImages);
  }

  editItem(index: number) {
    this.editIndex = index;
    this.isEditMode = true;
    this.form.patchValue({ ...this.widgetImages[index] });
  }

  onHandleMedia(event: { path: string }) {
    this.form.patchValue({ thumbnail: event.path });
  }

  cancelEdit() {
    this.editIndex = null;
    this.isEditMode = false;
    this.form.reset();
  }

  saveChanges() {
    if (this.editIndex === null) {
      this.HotToastService.error('Please select an item to edit');
      return;
    }

    this.widgetImages[this.editIndex] = { ...this.form.value };
    this.HotToastService.success('Stock viewer updated successfully');
    this.ChangeDetectorRef.markForCheck()
    this.cancelEdit();
    this.widgetItemsChange.emit(this.widgetImages);
  }

  onSwitchTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchCategories();
  }

  getItemDetails(item: WidgetItem) {
    return JSON.stringify(item, null, 2);
  }

  fetchCategories() {
    this.CategoryService.searchCategory({
      page: this.pageIndex,
      limit: this.pageSize,
      keyword: this.searchKeyword.value,
      isActive: true,
      isArchive: false
    }).subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.searchResults = res.result;
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message);
      }
    });
  }

  dropItems(event: CdkDragDrop<WidgetItem[]>) {
    let items = [...this.widgetImages];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.widgetImages = [...items];
    this.widgetItemsChange.emit(this.widgetImages);
  }
}
