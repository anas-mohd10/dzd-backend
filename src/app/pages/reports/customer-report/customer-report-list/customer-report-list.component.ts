import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CsvService } from 'src/app/includes/services/csv.service';
import { CustomerReportService } from 'src/app/includes/services/customer.report.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-customer-report-list',
  templateUrl: './customer-report-list.component.html',
  styleUrls: ['./customer-report-list.component.scss']
})

export class CustomerReportListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes

  customers: any
  customerreports: any
  customer: any;

  headers: any[] = ['Customer', 'Email', 'Mobile', 'Address', 'City', 'Pincode', 'State', 'Orders']
  name: String = "customer_report" + Date.now()

  constructor(
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private csvService: CsvService,
    private customerReportService: CustomerReportService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.customersService.getCustomers().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.customers = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.customerReportService.getCustomerReports().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.customerreports = res?.result
        this.ChangeDetectorRef.markForCheck()
        this.dtTrigger.next();
      }
    })
  }

  filterReport() {
    this.customerReportService.getCustomerReport({ _id: this.customer, isActive: true, isDelete: false }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.dtTrigger.unsubscribe();
        this.customerreports = res?.result
        this.ChangeDetectorRef.markForCheck()
        this.dtTrigger.next();
      }
    })
  }

  reloadPage() {
    this.customer = null
    this.customerReportService.getCustomerReports().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.dtTrigger.unsubscribe();
        this.customerreports = res?.result
        this.ChangeDetectorRef.markForCheck()
        this.dtTrigger.next();
      }
    })
  }

  downloadCsvFile() {
    this.csvService.csvDownload(this.headers, this.customerreports, this.name)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
