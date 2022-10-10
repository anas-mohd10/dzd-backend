import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {
  appRoute = appRoutes
  base: string;
  couponForm: FormGroup;
  coupons: any;

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
    private couponService: CouponsService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getCoupons()
    this.couponService.getCouponCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.cdr.markForCheck();
    })
  }

  initForm() {
    this.couponForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  getCoupons() {
    this.couponService.getCouponPage(this.page, this.limit).subscribe((res: any) => {
      this.coupons = res?.result
      this.count = this.coupons.length
      this.cdr.markForCheck();
    });
  }

  searchCoupon(key: any, e: any) {
    this.currpage = 1
    this.couponService.searchCoupon(this.couponForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.coupons = res?.result?.data
        this.count = this.coupons.length
        this.cdr.markForCheck();
        this.isData = true
        this.totalcount = res?.result?.total
        this.setBoolValues(this.totalcount, this.coupons.length)
      }
    })
  }

  fetchMore() {
    this.currpage += 1
    this.couponService.searchCoupon(this.couponForm.value, this.currpage, this.limit).subscribe((res: any) => {
      this.coupons = [...this.coupons, ...res?.result.data]
      this.count = this.coupons.length
      this.setBoolValues(this.totalcount, this.coupons.length)
      this.cdr.markForCheck();
    })
    if (this.currpage > 1) {
      this.showLessBtn = true
    }
  }

  fetchLess() {
    this.currpage = 1
    this.couponService.searchCoupon(this.couponForm.value, this.currpage, this.limit).subscribe((res: any) => {
      this.coupons = res?.result?.data
      this.count = this.coupons.length
      this.setBoolValues(this.totalcount, this.coupons.length)
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
