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
  limit: FormControl = new FormControl('20')
  page: number = 1
  isLastPage: boolean = false
  customers: Array<any> = []
  keyword: FormControl = new FormControl('')
  sort: FormControl = new FormControl('')
  totalResults: string = ''

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.searchCustomers()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.sort.setValue('')
    this.page = 1
    this.searchCustomers()
  }

  getNextPage() {
    this.page += 1
    this.searchCustomers()
  }

  getPreviousPage() {
    this.page -= 1
    this.searchCustomers()
  }

  searchCustomers() {
    let payload = {
      keyword: this.keyword.value,
      page: this.page,
      limit: this.limit.value,
      sort: this.sort.value
    }

    this.CustomersService.getWishlist(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.customers = res?.result?.data
        this.totalResults = res?.result?.totalResults
        this.isLastPage = res?.result?.isLastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
