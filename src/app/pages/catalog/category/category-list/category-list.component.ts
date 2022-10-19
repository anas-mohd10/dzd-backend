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
  base: any
  categoryform: FormGroup
  categories: any = []

  //Page and limit for query
  page: any = 1;
  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  limit: any = 8;
  selectedpage: any = 1
  max: any = 3

  //Total no. of data from backend
  totalcount: any;
  totaldata: any;
  count: any = 0

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any

  constructor(private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })

    this.categoryService.searchCategory(this.categoryform.value, this.page, this.limit).subscribe((res: any) => {
      this.categories = res?.result?.data;
      this.count = this.categories.length
      this.cdr.markForCheck();
    });

    this.categoryService.getCategoryCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.cdr.markForCheck();
      this.setPages()
    })
  }

  initForm() {
    this.categoryform = this.formBuilder.group({
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
    this.categoryService.searchCategory(this.categoryform.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.count = this.categories.length
        this.totalcount = res?.result?.total
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
      }
    })
  }

  fetchBrand(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.categoryform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.categoryform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.categoryform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.categoryform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.categoryform.value, this.currpage, this.limit)
      } else {
        this.getData(this.categoryform.value, this.currpage, this.limit)
      }
    }
  }


  setPages() {
    this.currpage = 1
    this.selectedpage = 1
    this.pages.length = 0
    if (this.totaldata > 3) {
      for (let i = 1; i <= this.max; i++) {
        this.pages.push(i)
      }
    } else {
      for (let i = 1; i <= this.totaldata; i++) {
        this.pages.push(i)
      }
    }
  }

  getData(data: any, page: any, limit: any) {
    this.categoryService.searchCategory(data, page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.count = this.categories.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
