import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { AuthService } from 'src/app/includes/services/auth.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


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

  //Revenue by days
  @ViewChild("chart") chart: ChartComponent;
  chartOptions: any;
  dayLabels: Array<any> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  dayValues: Array<any> = ['0', '0', '0', '0', '0', '0', '0']
  //Revenue by days

  startDate: FormControl = new FormControl('')
  endDate: FormControl = new FormControl('')

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AuthService: AuthService,
    private AppSettingsService: AppSettingsService,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
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
                enabled: true, style: { colors: ['#1a1d27'] }
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
}
