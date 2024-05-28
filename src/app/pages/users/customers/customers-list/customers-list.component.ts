import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from "../../../../config/routes/app.routes"
import { CustomersService } from 'src/app/includes/services/customers.service';
import { FormControl } from '@angular/forms';
import { CsvService } from 'src/app/includes/services/csv.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})

export class CustomersListComponent implements OnInit {
  appRoute = appRoutes;
  totalPages: number = 1
  totalResults: number = 0
  customers: Array<any> = []
  limit: number = 40
  page: number = 1
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')

  constructor(
    private customersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private CsvService: CsvService
  ) { }

  ngOnInit(): void {
    this.getCustomers()
  }

  clearFilters(){
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.getCustomers()
    this.page = 1
    this.limit = 40
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCustomers()
  }

  getCustomers() {
    setTimeout(() => {
      this.customersService.searchCustomers({
        keyword: this.keyword.value,
        limit: this.limit,
        page: this.page,
        isActive: this.isActive.value
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          console.log(res?.result);
          
          this.customers = res?.result?.data
          this.totalPages = res?.result?.totalPages
          this.totalResults = res?.result?.totalCustomers
          this.ChangeDetectorRef.markForCheck()
        }
      })
    }, 800)
  }

  downloadCustomers() {
    let payload = {
      keyword: this.keyword.value,
      limit: this.limit,
      page: this.page,
      isActive: this.isActive.value
    }

    this.CsvService.downloadUsers(payload).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}
