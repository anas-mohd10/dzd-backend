import { ChangeDetectorRef, Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common'

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
  currpage: any = 1;
  limit: any = 8;

  //Total no. of data from backend
  totalcount: any;
  count: any = 0

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;

  //Filters array
  filters: any = [];

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base

    this.brandService.getBrands(this.page, this.limit).subscribe((res: any) => {
      this.brands = res?.result
      this.count = this.brands.length
      this.cdr.markForCheck();
    });

    this.brandService.getBrandCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.cdr.markForCheck();
    })
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log('Back button pressed');
  }

  initForm() {
    this.brandform = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  searchBrand(key: any, e: any) {
    this.currpage = 1
    this.brandService.searchBrand(this.brandform.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brands = res?.result?.data
        this.count = this.brands.length
        this.cdr.markForCheck();
        this.isData = true
        this.totalcount = res?.result?.total
        this.setBoolValues(this.totalcount, this.brands.length)
      }
    })
  }

  fetchMore() {
    this.currpage += 1
    this.brandService.searchBrand(this.brandform.value, this.currpage, this.limit).subscribe((res: any) => {
      this.brands = [...this.brands, ...res?.result.data]
      this.count = this.brands.length
      this.setBoolValues(this.totalcount, this.brands.length)
      this.cdr.markForCheck();
    })
    if (this.currpage > 1) {
      this.showLessBtn = true
    }
  }

  fetchLess() {
    this.currpage = 1
    this.brandService.searchBrand(this.brandform.value, this.currpage, this.limit).subscribe((res: any) => {
      this.brands = res?.result?.data
      this.count = this.brands.length
      this.setBoolValues(this.totalcount, this.brands.length)
      this.cdr.markForCheck();
    })
  }

  setBoolValues(datalen: any, brandlen: any) {
    if (datalen == brandlen) {
      this.showBtn = false
      this.showLessBtn = true
    } else {
      this.showBtn = true
      this.showLessBtn = false
    }
    if (brandlen == 0) {
      this.isData = false
    } else {
      this.isData = true
    }
  }
}
