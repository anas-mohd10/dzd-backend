import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { OrdersService } from 'src/app/includes/services/orders.service';

@Component({
  selector: 'app-packing-slip',
  templateUrl: './packing-slip.component.html',
  styleUrls: ['./packing-slip.component.scss']
})
export class PackingSlipComponent implements OnInit {
  order: string = ''
  orderDetails: any = {}
  date: any = new Date()
  settings: any = {}

  constructor(
    private OrdersService: OrdersService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.date = this.date.toDateString()
    this.order = this.ActivatedRoute.snapshot.queryParams.order || ''
    this.OrdersService.getOrderDetails({ order: '#' + this.order }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orderDetails = res?.result
        this.orderDetails.orderDate = new Date(this.orderDetails?.orderDate).toDateString()
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  print(content: any) {
    let contents: any = document.querySelector('.' + content)?.innerHTML
    let body = document.body.innerHTML
    document.body.innerHTML = contents
    window.print()
    document.body.innerHTML = body;
  }
}
