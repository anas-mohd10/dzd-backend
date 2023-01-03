import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  orderform: FormGroup;
  appRoute = appRoutes;
  orders: any;
  base: any
  isTable: Boolean = false
  isDateValid: boolean = false;
  totalcount: Number = 0
  totalRevenue: Number = 0
  count: Number = 0
  totalrevenues: any;
  averagesales: any;

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.ordersService.getOrders().subscribe((res: any) => {
      this.orders = res?.result?.orders
      for (let order of this.orders) {
        order.orderDate = new Date(order.orderDate).toDateString()
      }
      this.count = res?.result?.total_orders
      this.averagesales = res?.result?.average_sales
      this.totalrevenues = res?.result?.total_revenue
      this.dtTrigger.next()
      this.cdr.markForCheck()
    })
  }

  initForm() {
    this.orderform = this.formBuilder.group({
      fdate: [''],
      tdate: [''],
      paymentMethod: [''],
      orderStatus: [''],
    });
  }

  checkToDate() {
    let fromDate = this.orderform.get("fdate")?.value
    let toDate = this.orderform.get("tdate")?.value
    if (toDate) {
      if (toDate < fromDate) {
        this.isDateValid = false
        this.toastr.error("Kindly enter a valid To date")
      } else {
        this.isDateValid = true
      }
    }
  }

  onReload() {
    window.location.reload()
  }

  searchOrder() {
    this.ordersService.searchOrder(this.orderform.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.orders
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toLocaleString()
        }
        this.dtTrigger.next();
        this.count = this.orders.length
        this.cdr.markForCheck();
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
