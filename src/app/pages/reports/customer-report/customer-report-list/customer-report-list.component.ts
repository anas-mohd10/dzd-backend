import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CsvService } from 'src/app/includes/services/csv.service';
import { CustomerReportService } from 'src/app/includes/services/customer.report.service';
import { CustomersService } from 'src/app/includes/services/customers.service';

@Component({
  selector: 'app-customer-report-list',
  templateUrl: './customer-report-list.component.html',
  styleUrls: ['./customer-report-list.component.scss']
})

export class CustomerReportListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  customerReportForm: FormGroup
  appRoute = appRoutes
  customersData: any
  customerReportsData: any
  headers: any[] = ['Customer', 'Email', 'Mobile', 'Address', 'City', 'Pincode', 'State', 'Orders']
  name: String = "customer_report" + Date.now()


  constructor(
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private csvService: CsvService,
    private customerReportService: CustomerReportService
  ) { }


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getCustomers()
    this.getCustomerReportsData()
    this.initForm()
  }

  initForm() {
    this.customerReportForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
      customerId: [''],
    });
  }

  getCustomers() {
    this.customersService.getCustomers().subscribe((res: any) => {
      this.customersData = res?.result
    })
  }

  getCustomerReportsData() {
    this.customerReportService.getCustomerReports().subscribe((res: any) => {
      this.customerReportsData = res?.result
      console.log(this.customerReportsData);

    })
  }

  checkToDate() { }

  onSubmit() { }

  reloadPage() {
    window.location.reload()
  }

  downloadCsvFile() {
    this.csvService.csvDownload(this.headers, this.customerReportsData, this.name)
  }
}
