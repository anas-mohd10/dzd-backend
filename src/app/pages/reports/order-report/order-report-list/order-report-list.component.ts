import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CsvService } from 'src/app/includes/services/csv.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { OrdersService } from 'src/app/includes/services/orders.service';


@Component({
  selector: 'app-order-report-list',
  templateUrl: './order-report-list.component.html',
  styleUrls: ['./order-report-list.component.scss']
})
export class OrderReportListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  orderReportForm: FormGroup
  appRoute = appRoutes
  customersData: any
  ordersReportsData: any
  headers: any[] = ['OrderNumber', 'OrderStatus', 'OrderDate', 'PaymentMethod', 'Customer', 'Total', 'Tax', 'ShippingCost', 'TotalItems']
  name: String = "order_report" + Date.now()


  constructor(
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private csvService: CsvService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getCustomers()
    this.getOrderReportsData()
    this.initForm()
  }

  initForm() {
    this.orderReportForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
      customerId: [''],
      orderStatus: [''],
    });
  }

  checkToDate() {
  }

  reloadPage() {
    window.location.reload()
  }

  getCustomers() {
    this.customersService.getCustomers().subscribe((res: any) => {
      this.customersData = res?.result
    })
  }

  getOrderReportsData() {
    this.ordersService.getOrderReport().subscribe((res: any) => {
      this.ordersReportsData = res?.result
    })
  }

  downloadCsvFile() {
    this.csvService.csvDownload(this.headers, this.ordersReportsData, this.name)
  }

  onSubmit() {
    console.log(this.orderReportForm.value)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
