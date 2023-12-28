import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
interface OrderDetails {
  status: string
  orders: number
}
@Component({
  selector: 'app-sales-analytics',
  templateUrl: './sales-analytics.component.html',
  styleUrls: ['./sales-analytics.component.scss']
})

export class SalesAnalyticsComponent implements OnInit {
  appRoute = appRoutes
  modalRef?: BsModalRef
  orderStatusDetails: any
  revenueDetails: any
  orderDetails: any
  settings: any;
  isRangeSubmitted: boolean = false
  duration: FormControl = new FormControl('lastweek')
  date: FormControl = new FormControl('', [Validators.required])
  revenueLabels: Array<any> = []
  revenues: Array<any> = []
  revenueChartOptions: any;
  orders: Array<any> = []
  orderLabels: Array<any> = []
  orderChartOptions: any;

  constructor(
    private BsModalService: BsModalService,
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0)
        this.settings = res?.result
    })

    this.getDetails()
  }

  getDetails() {
    this.DashboardService.salesAnalytics({ duration: this.duration.value, dates: this.date.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.revenueLabels, this.revenues = [], []
          this.orderLabels, this.orders = [], []
          this.orderStatusDetails = res?.result?.orderStatusDetails
          this.orderDetails = res?.result?.orderDetails
          this.revenueDetails = res?.result?.revenueDetails
          this.DashboardService.sendRevenues(this.revenueDetails?.revenues)

          for (let revenue of this.revenueDetails.revenues) {
            this.revenueLabels.push(revenue?.key)
            this.revenues.push(revenue?.value)
          }
          for (let order of this.orderDetails?.orders) {
            this.orderLabels.push(order?.key)
            this.orders.push(order?.value)
          }

          this.getRevenueChartOptions()
          this.getOrderChartOptions()
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getRevenueChartOptions() {
    this.revenueChartOptions = {
      series: [{ name: "Revenues", data: this.revenues, color: '#00bdab' }],
      chart: {
        type: "area",
        height: 400,
        zoom: { enabled: false },
        fontFamily: 'Sen, sans-serif'
      },
      dataLabels: { enabled: false, style: { colors: ['#1a1d27'] } },
      stroke: { curve: "smooth" },
      labels: this.revenueLabels,
      xaxis: { type: "category" },
      yaxis: { opposite: true },
      legend: { horizontalAlign: "left" }
    };
  }

  getOrderChartOptions() {
    this.orderChartOptions = {
      series: [{ name: "Orders", data: this.orders, color: '#00bdab' }],
      chart: {
        type: "area",
        height: 400,
        zoom: { enabled: false },
        fontFamily: 'Sen, sans-serif'
      },
      dataLabels: { enabled: false, style: { colors: ['#1a1d27'] } },
      stroke: { curve: "smooth" },
      labels: this.orderLabels,
      xaxis: { type: "category" },
      yaxis: { opposite: true },
      legend: { horizontalAlign: "left" }
    };
  }


  getDuration(template: TemplateRef<any>) {
    if (this.duration.value == 'date-range') {
      this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
    }
    this.getDetails()
  }

  getDateRange() {
    if (!this.date.valid) {
      this.isRangeSubmitted = true
      return
    }

    this.getDetails()
    this.modalRef?.hide()
    this.date.setValue('')
    this.isRangeSubmitted = false
  }
}
