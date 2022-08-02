import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  appRoute = appRoutes
  constructor() { }

  ngOnInit(): void {
    this.getOrders()
  }

  getOrders() { }

  onSubmit() { }

}
