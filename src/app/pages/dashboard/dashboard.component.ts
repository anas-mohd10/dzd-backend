import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { AuthService } from 'src/app/includes/services/auth.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { OrdersService } from 'src/app/includes/services/orders.service';

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

  quickLinks: Array<any> = [
    { title: 'Orders', description: 'Manage your latest orders', redirection: appRoutes.orders.ORDERS_LIST },
    { title: 'Products', description: 'View all your products here', redirection: appRoutes.product.ALL_PRODUCTS },
    { title: 'Create coupons', description: 'Create new coupon code and give discounts to customers', redirection: appRoutes.coupons.ADD_COUPONS_LIST },
    { title: 'Customers', description: 'View all your customers here', redirection: appRoutes.customers.CUSTOMERS_LIST },
    { title: 'Collections', description: 'View all your collections here', redirection: appRoutes.collection.COLLECTION_LIST },
    { title: 'Brands', description: 'View all your brands here', redirection: appRoutes.brand.BRAND_LIST },
  ]

  items: Array<any> = [
    { title: 'Create catalog', description: 'Create a new dynamic catalog page as per your needs', redirection: appRoutes.catalogs.create },
    { title: 'View products', description: 'View all your products here', redirection: appRoutes.product.ALL_PRODUCTS },
    { title: 'Create order', description: 'Place order on behalf of your custsomer', redirection: appRoutes.orders.ADD_ORDER_LIST },
    { title: 'View orders', description: 'Manage your latest orders', redirection: appRoutes.orders.ORDERS_LIST },
    { title: 'Create coupons', description: 'Create new coupon code and give discounts to customers', redirection: appRoutes.coupons.ADD_COUPONS_LIST },
    { title: 'Create blogs', description: 'Create new blogs for your customers', redirection: appRoutes.blogs.create },
    { title: 'View blogs', description: 'View all blogs in your stores', redirection: appRoutes.blogs.list },
  ]
  newOrders: Array<any> = []
  searchResults: Array<any> = []
  monthlyRevenues: Array<any> = []
  constructor(
    private OrdersService: OrdersService,
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AuthService: AuthService,
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private Router: Router
  ) { }

  fetchOrders() {
    this.DashboardService.getNewOrders().subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.newOrders = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  fetchStoreTips() {
    this.DashboardService.storeTips().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.storeTips = res?.result
        }
      }
    })
  }

  fetchTopSellingProducts() {
    this.DashboardService.getTopSellingProducts().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  fetchSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        localStorage.setItem('primaryLanguage', res?.result?.primaryLang)
        this.settings = res?.result
      }
    })
  }

  fetchMonthlyRevenue() {
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
  }

  fetchQuaterlyRevenue(event: number) {
    this.DashboardService.getMonthlyRevenue({ type: event }).subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.monthlyRevenues = res.result?.monthlyResults
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  fetchSourceDetails() {
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
            plotOptions: { bar: { vertical: true, borderRadius: 0 } },
            dataLabels: { enabled: false },
            xaxis: {
              categories: labels,
              labels: { style: { fontSize: 13 } },
            },
            yaxis: {
              labels: { style: { fontSize: 13 } },
            },
          }

          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  fetchDashboard() {
    this.DashboardService.getDashboard({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  ngOnInit(): void {
    let adminDetails = localStorage.getItem('UserData') || '{}'
    this.email = JSON.parse(adminDetails)?.email
    const today = new Date();
    const sevenDaysFromToday = new Date();
    sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() - 6);
    this.startDate.setValue(sevenDaysFromToday.toISOString().split('T')[0])
    this.endDate.setValue(today.toISOString().split('T')[0])
    this.userData = this.AuthService.getCurrentUser();

    // Do an Promise.all to fetch all data
    Promise.all([
      this.fetchOrders(),
      this.fetchStoreTips(),
      this.fetchQuaterlyRevenue(6),
      this.fetchTopSellingProducts(),
      this.fetchSettings(),
      this.fetchMonthlyRevenue(),
      this.fetchSourceDetails(),
      this.fetchDashboard(),
      this.getDailyRevenues(),
    ])
  }

  queryStringToObject(query: string): { [key: string]: string } {
    if (!query) return {};
    const params: { [key: string]: string } = {};
    const parts = query.split('=');
    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }
    return params;
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
              series: [{ name: "Revenue", data: this.dayValues, color: '#00BDAB' }],
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
            this.HotToastService.error(res?.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.message)
        }
      })
    } else {
      this.HotToastService.error('The entered date is not valid. Please check and try again.')
    }
  }

  navigate(route: any) {
    this.Router.navigate([route])
    this.modalRef?.hide()
  }
}
