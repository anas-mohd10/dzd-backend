import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { OrdersService } from 'src/app/includes/services/orders.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  customersCount: any;
  ordersData: any;
  constructor(private customersService: CustomersService, private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getCustomersCount()
    this.getOrders()
  }

  getCustomersCount() {
    this.customersService.getCustomersCoumt().subscribe((res: any) => {
      this.customersCount = res?.result
      console.log(this.customersCount);
    })
  }

  getOrders() {
    this.ordersService.getOrders().subscribe((res: any) => {
      this.ordersData = res?.result
      console.log(this.ordersData.length);
    })
  }
}
