import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from 'src/app/includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-archived-brand',
  templateUrl: './archived-brand.component.html',
  styleUrls: ['./archived-brand.component.scss']
})
export class ArchivedBrandComponent implements OnInit {
  appRoute = appRoutes
  brandform: FormGroup;
  page: any = 1
  limit: any
  count: any
  totalcount: any
  brands: any;
  totaldata: number;
  currpage: number;
  selectedpage: any;
  isData: boolean;
  shifted: any;
  pages: any = [];
  isNext: boolean;
  max: number;
  base: any

  constructor(
    private BrandService: BrandService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.BrandService.getArchivedBrands(this.brandform.value, this.page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.count = this.brands.length
        this.totalcount = res?.result?.total_item
        this.limit = res?.result?.items_per_page
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
      }
    })
  }

  initForm() {
    this.brandform = this.formBuilder.group({
      name: [''],
    });
  }

  onReload() {
    this.brandform.get('name')?.setValue('')
    this.searchBrand()
  }

  searchBrand() {
    this.currpage = 1
    this.BrandService.searchBrand(this.brandform.value, this.page).subscribe((res: any) => {
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
    this.BrandService.searchBrand(data, page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.count = this.brands.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }

}
