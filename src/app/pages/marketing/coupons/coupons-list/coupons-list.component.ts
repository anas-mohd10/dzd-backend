import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
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
  // @ViewChild(DataTableDirective, { static: true })
  // public dtElement: DataTableDirective;
  // public dtOptions: DataTables.Settings = {};
  // public dtTrigger: Subject<any> = new Subject();
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
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getCoupons()
    // this.dtOptions = {
    //   pagingType: 'simple_numbers',
    //   lengthMenu: [5, 10, 15],
    //   pageLength: 10,
    //   processing: true,
    // };
    this.couponService.getCouponCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.cdr.markForCheck();
    })

    window.scrollTo(2356, 7308)


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

  getCoupons(){
  this.couponService.getCouponPage(this.page, this.limit).subscribe((res: any) => {
    this.coupons = res?.result
    this.count = this.coupons.length
    this.cdr.markForCheck();
  });
}

  // getCoupons() {
  //   this.couponService.getCoupons().subscribe((res: any) => {
  //     this.couponsData = res?.result
  //     this.cdr.markForCheck()
  //     for (let i = 0; i < this.couponsData.length; i++) {
  //       this.couponsData[i].fromDate = new Date(
  //         this.couponsData[i].fromDate
  //       ).toDateString();
  //     }
  //     for (let i = 0; i < this.couponsData.length; i++) {
  //       this.couponsData[i].lastDate = new Date(
  //         this.couponsData[i].lastDate
  //       ).toDateString();
  //     }
  //     this.dtTrigger.next();
  //     this.displayTable = true;
  //   })
  // }

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

  storeItem(event: any) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let el = event.srcElement;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.parentElement;
    }
    const coords = {
      top: offsetTop,
      left: offsetLeft
    }
    localStorage.setItem('coords', JSON.stringify(coords))
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
