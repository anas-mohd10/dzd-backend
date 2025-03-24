import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-wishlist-details',
  templateUrl: './wishlist-details.component.html',
  styleUrls: ['./wishlist-details.component.scss']
})
export class WishlistDetailsComponent implements OnInit {
  appRoute = appRoutes
  customerDetails: any = {}
  customer: string = ''

  constructor(
    private CustomersService: CustomersService,
    private Location: Location,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private toast: HotToastService
  ) { }


  ngOnInit(): void {
    this.customer = this.ActivatedRoute.snapshot.queryParams['user'] || ''
    this.CustomersService.getWishlistDetails(this.customer).subscribe((res: any) => {
      if (res?.errorCode == 0) this.customerDetails = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  navigateBack() {
    this.Location.back()
  }
}
