import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { environment } from 'src/environments/environment';
import { StoresService } from 'src/app/includes/services/stores.service';
import { HelpCenterService } from 'src/app/includes/services/help-center.service';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss']
})
export class GenerateInvoiceComponent implements OnInit {
  order: string = ''
  orderDetails: any = {}
  settings: any = {}
  base: string = environment.base
  store: any = {}
  helpCenter: any
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

  ngOnInit(): void {
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
        environment.base = this.settings?.baseS3Url
        this.base = this.settings?.baseS3Url
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.StoresService.getStores().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        for (let store of res?.result) {
          if (store.isFeatured == true) this.store = store
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.HelpCenterService.getDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.helpCenter = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.OrdersService.invoiceDetails(this.order).subscribe({
      next: (res: any) => {

      }, error: (err: any) => {

      }, complete: () => {

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
