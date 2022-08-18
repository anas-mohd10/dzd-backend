import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/includes/services/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  displayTable: boolean = false;
  ordersData: any;
  orderCount: any
  totalRevenue: Number = 0

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getOrders()
  }

  getOrders() {
    this.ordersService.getOrders().subscribe((res: any) => {
      this.ordersData = res?.result
      this.orderCount = this.ordersData.length
      for (let order of this.ordersData) {
        order.orderDate = new Date(order.orderDate).toDateString()
        this.totalRevenue += order.total
      }
    })
  }

  onSubmit() { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
