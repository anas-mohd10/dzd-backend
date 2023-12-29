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
  page: number = 1
  limit: FormControl = new FormControl(20)
  totalResults: number = 0
  totalPages: number = 1
  keyword: FormControl = new FormControl('')

  constructor(
    private VouchersService: VouchersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ClipboardService: ClipboardService,
    private Toast: HotToastService,
  ) { }

  ngOnInit(): void {
    this.getVouchers()
  }

  next() {
    this.page++
    this.getVouchers()
  }

  previous() {
    this.page--
    this.getVouchers()
  }

  clear() {
    this.limit.setValue(20)
    this.keyword.setValue('')
    this.page = 1
    this.getVouchers()
  }

  copyToClipboard(voucher: string) {
    this.ClipboardService.copyFromContent(voucher)
    this.Toast.success('Copied to clipboard')
  }

  getVouchers(type?: string) {
    if (type == 'search') this.page = 1
    this.VouchersService.searchVoucher({
      page: this.page,
      limit: this.limit.value,
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

}
