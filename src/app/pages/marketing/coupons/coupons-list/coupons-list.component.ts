import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  limit: FormControl = new FormControl('20')
  lastPage: Boolean = false;

  constructor(
    private CouponsService: CouponsService,
    private FormBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef
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

  getNextPage() {
    this.page += 1
    this.getCoupons()
  }

  getPreviousPage() {
    this.page -= 1
    this.getCoupons()
  }

  getCoupons() {
    let payload = {
      title: this.form.get('title')?.value,
      limit: this.limit.value,
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
        for (let coupon of this.coupons) {
          coupon.fromDate = new Date(coupon.fromDate).toLocaleDateString()
          coupon.toDate = new Date(coupon.toDate).toLocaleDateString()
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
