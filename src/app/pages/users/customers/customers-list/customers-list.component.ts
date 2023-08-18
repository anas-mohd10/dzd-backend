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
  customersData: any;
  customersCount: any;

  customers: Array<any> = []
  lastPage: Boolean = false
  limit: FormControl = new FormControl(10);
  page: number = 1
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')

  constructor(
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef,
    private CsvService: CsvService
  ) { }

  ngOnInit(): void {
    this.getCustomers()
  }

  getPreviousPage() {
    this.page -= 1
    this.getCustomers()
  }

  getNextPage() {
    this.page += 1
    this.getCustomers()
  }

  clearFilter() {
    this.keyword.setValue('')
    this.isActive.setValue('')
    this.limit.setValue('10')
    this.page = 1
    this.getCustomers()
  }

  getCustomers() {
    let payload = {
      keyword: this.keyword.value,
      limit: this.limit.value,
      page: this.page,
      isActive: this.isActive.value
    }

    this.customersService.searchCustomers(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.customers = res?.result?.data
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.cdr.markForCheck()
      }
    })
  }

  downloadCustomers() {
    this.CsvService.downloadUsers().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}
