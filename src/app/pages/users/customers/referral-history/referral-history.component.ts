import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';

@Component({
  selector: 'app-referral-history',
  templateUrl: './referral-history.component.html',
  styleUrls: ['./referral-history.component.scss']
})
export class ReferralHistoryComponent implements OnInit {
  customerQuery: string;
  appRoute = appRoutes;
  customers: Array<any> = [];
  totalPages: number = 0;
  totalResults: number = 0;
  page: number = 1;
  limit: number = 10;
  customerDetails: any;
  keyword: FormControl = new FormControl('')

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private CustomersService: CustomersService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.customerQuery = this.ActivatedRoute.snapshot.params.id || ''
    if (this.customerQuery) {
      this.CustomersService.getCustomerDetails(this.customerQuery).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.customerDetails = res?.result
            this.getReferralHistory()
            this.ChangeDetectorRef.markForCheck()
          } else {

          }
        }, error: (err: any) => {

        }
      })
    }
  }

  clear() {
    this.keyword.reset()
    this.page = 1
    this.limit = 10
    this.getReferralHistory()
  }

  getReferralHistory() {
    this.CustomersService.getReferralHistory(this.customerQuery, this.page, this.limit, this.keyword?.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.customers = res?.result?.data
          this.totalPages = res?.result?.totalPages ? res?.result?.totalPages : 1
          this.totalResults = res?.result?.totalCustomers
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {

      }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getReferralHistory()
  }

}
