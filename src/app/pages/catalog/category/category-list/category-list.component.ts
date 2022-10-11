import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryComponent implements OnInit {
  appRoute = appRoutes;
  displayTable: boolean = false;
  base: any
  categoryForm: FormGroup
  pages: any = [];
  page: any = 1;
  limit: any = 4;
  categories: any;
  isData: boolean = true;
  count: any;
  totalcount: any;
  currpage: number;
  showLessBtn: boolean;
  showBtn: boolean;


  constructor(private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.categoryService.getCategory().subscribe((res: any) => {
      this.categories = res?.result;
      this.count = this.categories.length
      this.cdr.markForCheck();
    });
    this.categoryService.getCategoryCount().subscribe((res: any) => {
      console.log(res?.result);
      this.totalcount = res?.result
      this.cdr.markForCheck();
    })
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  searchCategory() {
    this.currpage = 1
    this.categoryService.searchCategory(this.categoryForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.count = this.categories.length
        this.cdr.markForCheck();
        this.isData = true
        this.totalcount = res?.result?.total
        this.setBoolValues(this.totalcount, this.categories.length)
      }
    })
  }

  fetchMore() {
    this.currpage += 1
    this.categoryService.searchCategory(this.categoryForm.value, this.currpage, this.limit).subscribe((res: any) => {
      this.categories = [...this.categories, ...res?.result.data]
      this.count = this.categories.length
      this.setBoolValues(this.totalcount, this.categories.length)
      this.cdr.markForCheck();
    })
    if (this.currpage > 1) {
      this.showLessBtn = true
    }
  }

  fetchLess() {
    this.currpage = 1
    this.categoryService.searchCategory(this.categoryForm.value, this.currpage, this.limit).subscribe((res: any) => {
      this.categories = res?.result?.data
      this.count = this.categories.length
      this.setBoolValues(this.totalcount, this.categories.length)
      this.cdr.markForCheck();
    })
  }

  setBoolValues(datalen: any, catlen: any) {
    if (datalen == catlen) {
      this.showBtn = false
      this.showLessBtn = true
    } else {
      this.showBtn = true
      this.showLessBtn = false
    }
    if (catlen == 0) {
      this.isData = false
    } else {
      this.isData = true
    }
  }
}
