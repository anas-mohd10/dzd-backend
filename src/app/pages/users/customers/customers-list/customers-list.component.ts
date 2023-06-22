import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from "../../../../config/routes/app.routes"
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})

export class CustomersListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  customersData: any;
  isTable: boolean = false;
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
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.customersService.getCustomersCoumt().subscribe((res: any) => {
      this.customersCount = res?.result
      this.cdr.markForCheck()
    })

    this.customersService.getCustomers().subscribe((res: any) => {
      this.customersData = res?.result
      this.isTable = true
      this.dtTrigger.next();
      this.cdr.markForCheck()
    })

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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
