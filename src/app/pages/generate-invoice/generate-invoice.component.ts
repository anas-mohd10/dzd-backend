import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { environment } from 'src/environments/environment.prod';
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

  print(content: any) {
    let contents: any = document.querySelector('.' + content)?.innerHTML
    let body = document.body.innerHTML
    document.body.innerHTML = contents
    window.print()
    document.body.innerHTML = body;
  }

}
