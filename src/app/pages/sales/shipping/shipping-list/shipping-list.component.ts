import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss']
})
export class ShippingListComponent implements OnInit {
  appRoutes = appRoutes
  data: any = []
  
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

}
