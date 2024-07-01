import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {
  appRoute = appRoutes;
  coupons: Array<any> = [];
  form: FormGroup;
  base: any
  settings: any = {}
  page: number = 1
  limit: number = 20
  totalResults: number = 0
  totalPages: number = 1
  lastPage: Boolean = false;

  constructor(
    private CouponsService: CouponsService,
    private FormBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getCoupons()
  }

  initForm() {
    this.form = this.FormBuilder.group({
      title: [''],
      fromDate: [''],
      lastDate: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  clearFilters() {
    this.initForm()
    this.getCoupons()
  }

  toggleTab(type: string) {
    
  }

  switchToggled(event: { switchId: string, toggleState: boolean }) {
    this.CouponsService.updateCoupon({ refid: event.switchId, isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getCoupons()
          this.HotToastService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  deleteOffer(offerId: string) {
    this.CouponsService.updateCoupon({ refid: offerId, isDelete: true }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getCoupons()
          this.HotToastService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCoupons()
  }

  getCoupons() {
    let payload = {
      title: this.form.get('title')?.value,
      limit: this.limit,
      page: this.page,
      isActive: this.form.get('isActive')?.value,
      fromDate: this.form.get('fromDate')?.value,
      toDate: this.form.get('lastDate')?.value,
    }

    this.CouponsService.searchCoupons(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.coupons = res?.result?.data
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.totalResults = res?.result?.totalResults
        for (let coupon of this.coupons) {
          coupon.fromDate = new Date(coupon.fromDate).toLocaleDateString()
          coupon.lastDate = new Date(coupon.lastDate).toLocaleDateString()
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
