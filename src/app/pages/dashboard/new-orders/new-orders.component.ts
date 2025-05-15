import { Component, Input, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss']
})
export class NewOrdersComponent implements OnInit {
  appRoutes = appRoutes
  @Input('newOrders') newOrders: Array<any> = []

  constructor() { }

  formatDate(date: string){
    return `${
      new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } ${
      new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }`
  }

  ngOnInit(): void {
    console.log(this.newOrders)
  }

}
