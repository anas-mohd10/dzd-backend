import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-orders-list',
  templateUrl: './pending-orders-list.component.html',
  styleUrls: ['./pending-orders-list.component.scss']
})
export class PendingOrdersListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  displayTable: boolean = false;
  orders: any;
  orderCount: Number = 0
  totalRevenue: Number = 0
  orderform: FormGroup;
  isDateValid: Boolean = true;
  isTable: boolean = false;
  count: any;

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.initForm()

    this.ordersService.getPendingOrders().subscribe((res: any) => {
      this.orders = res?.result
      for (let order of this.orders) {
        order.orderDate = new Date(order.orderDate).toDateString()
      }
      this.count = this.orders.length
      this.isTable = true
      this.cdr.markForCheck()
    })
  }

  initForm() {
    this.orderform = this.formBuilder.group({
      fdate: [''],
      tdate: [''],
      paymentMethod: [''],
    });
  }

  checkToDate() {
    let fromDate = this.orderform.get("fromDate")?.value
    let toDate = this.orderform.get("toDate")?.value
    if (toDate < fromDate) {
      this.isDateValid = false
      this.toastr.error("Kindly enter a valid To date")
    } else {
      this.isDateValid = true
    }
  }

  reloadPage() {
    window.location.reload()
  }

  searchPendingOrder() {
    this.ordersService.searchPendingOrder(this.orderform.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.data
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toDateString()
        }
        this.count = this.orders.length
        this.cdr.markForCheck();
      }
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
