import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {
  brandform: FormGroup;
  appRoute = appRoutes;
  brands: any;
  base: any

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

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })

    this.brandService.searchBrand(this.brandform.value, this.page).subscribe((res: any) => {
      this.brands = res?.result?.data
      for (let brand of this.brands) {
        brand.createdAt = new Date(brand.createdAt).toDateString()
        brand.updatedAt = new Date(brand.updatedAt).toDateString()
      }
      this.count = this.brands.length
      this.totalcount = res?.result?.total_item
      this.limit = res?.result?.items_per_page
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.setPages()
      this.cdr.markForCheck();
    });
  }

  initForm() {
    this.brandform = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    this.brandform.get('name')?.setValue('')
    this.brandform.get('isActive')?.setValue('')
    this.brandform.get('isFeatured')?.setValue('')
    this.searchBrand()
  }

  searchBrand() {
    this.currpage = 1
    this.brandService.searchBrand(this.brandform.value, this.page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.count = this.brands.length
        this.totalcount = res?.result?.total_item
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
    this.getData(this.brandform.value, page)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.brandform.value, this.currpage)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.brandform.value, this.currpage)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.brandform.value, this.currpage)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.brandform.value, this.currpage)
      } else {
        this.getData(this.brandform.value, this.currpage)
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

  getData(data: any, page: any) {
    this.brandService.searchBrand(data, page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.count = this.brands.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
