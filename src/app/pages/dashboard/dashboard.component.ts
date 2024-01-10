import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { AuthService } from 'src/app/includes/services/auth.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: any
  monthlyRevenue: any = [];
  daysDetails: any = {}
  lastMonthRevenue: void;
  userData: any
  products: Array<any> = []
  orders: any
  sales: any

  orderDifference: Number = 0
  orderUp: Boolean = false
  settings: any = {}
  saleDifference: Number = 0
  saleUp: Boolean = false
  email: string = ''
  keyword: string = ''

  //Revenue by days
  @ViewChild("chart") chart: ChartComponent;
  chartOptions: any;
  dayLabels: Array<any> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  dayValues: Array<any> = ['0', '0', '0', '0', '0', '0', '0']
  //Revenue by days

  //Pie chart
  @ViewChild("chart") pieChart: ChartComponent;
  pieChartOptions: any = {
    series: [],
    chart: { type: '', fontFamily: '' },
    labels: [],
    responsive: []
  };
  barChartOptions: any
  //Pie chart

  appRoutes = appRoutes
  startDate: FormControl = new FormControl('')
  endDate: FormControl = new FormControl('')

  modalRef?: BsModalRef
  storeTips: any;

  items: Array<any> = [
    { title: 'Create catalog', description: 'Create a new dynamic catalog page as per your needs', redirection: appRoutes.catalogs.create },
    { title: 'View products', description: 'View all your products here', redirection: appRoutes.product.ALL_PRODUCTS },
    { title: 'Create order', description: 'Place order on behalf of your custsomer', redirection: appRoutes.orders.ADD_ORDER_LIST },
    { title: 'View orders', description: 'Manage your latest orders', redirection: appRoutes.orders.ORDERS_LIST },
    { title: 'Create coupons', description: 'Create new coupon code and give discounts to customers', redirection: appRoutes.coupons.ADD_COUPONS_LIST },
    { title: 'Create blogs', description: 'Create new blogs for your customers', redirection: appRoutes.blogs.create },
    { title: 'View blogs', description: 'View all blogs in your stores', redirection: appRoutes.blogs.list },
  ]
  searchResults: Array<any> = []

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AuthService: AuthService,
    private AppSettingsService: AppSettingsService,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService,
    private Router: Router
  ) { }

  ngOnInit(): void {
    let adminDetails = localStorage.getItem('UserData') || '{}'
    this.email = JSON.parse(adminDetails)?.email

    this.DashboardService.storeTips().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.storeTips = res?.result
        }
      }
    })


    const today = new Date();
    const sevenDaysFromToday = new Date();
    sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() - 6);

    this.startDate.setValue(sevenDaysFromToday.toISOString().split('T')[0])
    this.endDate.setValue(today.toISOString().split('T')[0])

    this.userData = this.AuthService.getCurrentUser();

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.DashboardService.getTopSellingProducts({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.DashboardService.getDashboard({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.DashboardService.getMonthlyRevenue({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.monthlyRevenue = res?.result?.monthlyResults
        this.orders = res?.result?.orders
        this.sales = res?.result?.sales
        this.saleDifference = res?.result?.sales?.saleDifference
        this.saleUp = res?.result?.sales?.saleUp

        if (this.orders?.today >= this.orders?.yesterday) {
          this.orderDifference = this.orders?.today - this.orders?.yesterday
          this.orderUp = true
        } else {
          this.orderDifference = this.orders?.yesterday - this.orders?.today
          this.orderUp = false
        }

        this.lastMonthRevenue = this.monthlyRevenue[0]['revenue']
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.getDailyRevenues()

    this.DashboardService.sourceDetails({}).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          let values = []
          let labels = []
          let revenues = []
          for (let _item of res?.result) {
            labels.push(_item?.key)
            values.push(_item?.value)
            revenues.push(_item?.revenue)
          }

          this.pieChartOptions = {
            series: values,
            chart: { type: "donut", fontFamily: 'Sen, sans-serif' },
            labels: labels,
            responsive: [{
              breakpoint: 480,
              options: { chart: { width: 200 }, legend: { position: "bottom" } }
            }]
          }

          this.barChartOptions = {
            series: [{ name: "Revenue", data: revenues }],
            chart: { type: "bar", height: 200, fontFamily: 'Sen, sans-serif', fontSize: 14 },
            plotOptions: { bar: { horizontal: true, borderRadius: 5 } },
            dataLabels: { enabled: false },
            xaxis: {
              categories: labels,
              labels: { style: { fontSize: 14 } },
            },
            yaxis: {
              labels: {
                style: { fontSize: '14px' },
              },
            },
          }

          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' });
  }

  searchLinks(keyword: string) {
    this.searchResults = this.items.filter((item: any) => item.title.toLowerCase().includes(keyword.toLowerCase()))
    if (!keyword) this.searchResults = []
  }

  getDailyRevenues() {
    if (this.startDate?.value < this.endDate?.value) {
      this.DashboardService.getDaysRevenue({
        startDate: this.startDate?.value,
        endDate: this.endDate?.value
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.dayLabels = []
            this.dayValues = []
            for (let dayItem of res?.result?.data) {
              this.dayLabels.push(dayItem?.date)
              this.dayValues.push(dayItem?.revenue)
            }
            this.chartOptions = {
              series: [{ name: "Revenue", data: this.dayValues, color: '#00bdab' }],
              chart: {
                type: "area",
                height: 350,
                zoom: { enabled: false },
                fontFamily: 'Sen, sans-serif'
              },
              dataLabels: {
                enabled: false, style: { colors: ['#1a1d27'] }
              },
              stroke: { curve: "smooth" },
              labels: this.dayLabels,
              xaxis: { type: "datetime" },
              yaxis: { opposite: true },
              legend: { horizontalAlign: "left" }
            };
            this.daysDetails = res?.result
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.ToastrService.error(res?.message)
          }
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    } else {
      this.ToastrService.error('The entered date is not valid. Please check and try again.')
    }
  }

  navigate(route: any) {
    this.Router.navigate([route])
    this.modalRef?.hide()
  }
}
