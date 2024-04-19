import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { environment } from 'src/environments/environment.prod';
import { StoresService } from 'src/app/includes/services/stores.service';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';

@Component({
  selector: 'app-bulk-packing-slips',
  templateUrl: './bulk-packing-slips.component.html',
  styleUrls: ['./bulk-packing-slips.component.scss']
})
export class BulkPackingSlipsComponent implements OnInit {
  ordersQuery: string
  orders: Array<any> = [];
  settings: any;
  helpCenter: any;
  store: any;
  base: string = environment.base
  order: string = ''
  orderDetails: any = {}
  date: any = new Date()

  constructor(
    private OrdersService: OrdersService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private StoresService: StoresService,
    private HelpCenterService: HelpCenterService
  ) { }

  ngOnInit(): void {
    this.ordersQuery = this.ActivatedRoute.snapshot.queryParams.order || ''
    let orders = this.ordersQuery.split('&')
    let orderIds = orders.map((order: string) => `#${order}`)
    this.OrdersService.bulkOrders({ orders: orderIds }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result
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
