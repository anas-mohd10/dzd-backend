import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-archived-category',
  templateUrl: './archived-category.component.html',
  styleUrls: ['./archived-category.component.scss']
})
export class ArchivedCategoryComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({})
  base: string = `${environment.base}/`;
  page: number = 1
  limit: number = 40;
  totalResults: number = 0;
  totalPages: number = 1;
  categories: Array<any> = []

  constructor(
    private CategoryService: CategoryService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getCategories()
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(''),
      isActive: new FormControl('')
    });
  }

  clearFilters() {
    this.initForm()
    this.getCategories()
  }

  onPageTriggered(event: { pageSize: number, pageIndex: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCategories()
  }

  getCategories() {
    setTimeout(() => {
      this.CategoryService.searchCategory({
        ...this.form.value,
        page: this.page, limit: this.limit,
        isArchive: true
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.categories = res?.result?.data
          this.ChangeDetectorRef.markForCheck();
        }
      })
    }, 800)
  }
}
