import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { environment } from 'src/environments/environment.prod';
import { StoresService } from 'src/app/includes/services/stores.service';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';

@Component({
  selector: 'app-bulk-invoices',
  templateUrl: './bulk-invoices.component.html',
  styleUrls: ['./bulk-invoices.component.scss']
})
export class BulkInvoicesComponent implements OnInit {
  ordersQuery: string
  orders: Array<any> = [];
  settings: any;
  helpCenter: any;
  store: any;
  base: string = environment.base;
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  weekDays: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  constructor(
    private OrdersService: OrdersService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private StoresService: StoresService,
    private HelpCenterService: HelpCenterService
  ) { }

  ngOnInit() {
    this.ordersQuery = this.ActivatedRoute.snapshot.queryParams.order || ''
    let orders = this.ordersQuery.split('&')
    let orderIds = orders.map((order: string) => `#${order}`)
    this.OrdersService.bulkOrders({ orders: orderIds }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.orders = res.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err) => {

      }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.StoresService.getStores().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        for (let store of res?.result) { if (store.isFeatured == true) this.store = store }
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.HelpCenterService.getDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.helpCenter = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  convertTimeFormat(timeString: any) {
    const [start, end] = timeString.split(' - ');
    const startTime = this.convertTo12HourFormat(start);
    const endTime = this.convertTo12HourFormat(end);
    return `${startTime} - ${endTime}`;
  }

  convertTo12HourFormat(time: any) {
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hour = parseInt(hours, 10);

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) { hour -= 12 }
    }

    return `${hour}:${minutes} ${period}`;
  }

  getDeliveryDate(date: any) {
    return `${this.weekDays[new Date(date).getDay()]} ${this.months[new Date(date).getMonth()]} ${new Date(date).getDate()} ${new Date(date).getFullYear()}`
  }


  print(content: any) {
    let contents: any = document.querySelector('.' + content)?.innerHTML
    let body = document.body.innerHTML
    document.body.innerHTML = contents
    window.print()
    document.body.innerHTML = body;
  }

}
