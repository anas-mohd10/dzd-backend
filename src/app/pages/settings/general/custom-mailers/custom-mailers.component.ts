import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-custom-mailers',
  templateUrl: './custom-mailers.component.html',
  styleUrls: ['./custom-mailers.component.scss']
})
export class CustomMailersComponent implements OnInit {
  appRoute = appRoutes
  mailers: Array<any> = [{
    title: 'Newsletter',
    type: 'newsletters',
    description: 'Mailers related to newsletter such as subscribed, unsubscribed, verification, notification',
    mailers: [
      { title: 'Newsletter subscribed', type: 'newsletter-subscribed' },
      { title: 'Newsletter unsubscribed', type: 'newsletter-unsubscribed' },
      { title: 'Newsletter verification', type: 'newsletter-verification' },
      { title: 'Newsletter notification', type: 'newsletter-notification' },
    ]
  }, {
    title: 'Orders',
    type: 'orders',
    description: 'Mailers related to orders such as new order, returns, cancellation',
    mailers: [
      { title: 'Place order', type: 'place-order' },
      { title: 'Delivered', type: 'delivered' },
      { title: 'Cancel order', type: 'cancel-order' },
    ]
  }]

  constructor() { }

  ngOnInit(): void {
  }
}
