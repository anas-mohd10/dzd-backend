import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';

@Component({
  selector: 'app-wishlist-list',
  templateUrl: './wishlist-list.component.html',
  styleUrls: ['./wishlist-list.component.scss']
})
export class WishlistListComponent implements OnInit {
  appRoute = appRoutes
  limit: number = 40
  page: number = 1
  isLastPage: boolean = false
  customers: Array<any> = []
  keyword: FormControl = new FormControl('')
  sort: FormControl = new FormControl('')
  totalResults: number = 0
  totalPages: number = 1
  topWishlisted: Array<any> = [] 

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.searchCustomers()

    this.CustomersService.getTopWishlisted().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.topWishlisted = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  clearFilters() {
    this.keyword.setValue('')
    this.sort.setValue('')
    this.page = 1
    this.limit = 40
    this.searchCustomers()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.searchCustomers()
  }

  searchCustomers() {
    setTimeout(() => {
      this.CustomersService.getWishlist({
        keyword: this.keyword.value,
        page: this.page,
        limit: this.limit,
        sort: this.sort.value
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.customers = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        }
      })
    }, 800)
  }
}
