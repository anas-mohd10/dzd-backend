import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { VouchersService } from 'src/app/includes/services/vouchers.service';

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
  limit: FormControl = new FormControl(40)
  keyword: FormControl = new FormControl('')

  constructor(
    private VouchersService: VouchersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  navNext() {
    this.page++
    this.getVouchers()
  }

  navBack() {
    this.page--
    this.getVouchers()
  }

  getVouchers() {

  }

}
