import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { VouchersService } from 'src/app/includes/services/vouchers.service';
import { ClipboardService } from 'ngx-clipboard';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-voucher-listing',
  templateUrl: './voucher-listing.component.html',
  styleUrls: ['./voucher-listing.component.scss']
})
export class VoucherListingComponent implements OnInit {
  appRoute = appRoutes
  vouchers: Array<any> = []
  isLastPage: boolean = false
  totalResults: number = 0
  totalPages: number = 1
  keyword: FormControl = new FormControl('')
  pageIndex: number = 1
  pageSize: number = 20

  constructor(
    private VouchersService: VouchersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ClipboardService: ClipboardService,
    private Toast: HotToastService,
  ) { }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.fetchResults()
  }

  fetchResults(type?: string) {
    if (type == 'search') this.pageIndex = 1
    this.VouchersService.searchVoucher({
      page: this.pageIndex,
      limit: this.pageSize,
      keyword: this.keyword.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.vouchers = res?.result?.data
          this.isLastPage = res?.result?.isLastPage
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalResults
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  ngOnInit(): void {
    this.fetchResults()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.pageSize = 1
    this.pageIndex = 1
    this.fetchResults()
  }

  copyToClipboard(voucher: string) {
    this.ClipboardService.copyFromContent(voucher)
    this.Toast.success('Copied to clipboard')
  }

  getVoucherStatus(voucher: any): string {
    if (voucher?.isAvailed) {
      return 'Redeemed';
    }
    if (voucher?.paymentStatus === 'success') {
      return 'Available';
    }
    return 'Pending';
  }
}
