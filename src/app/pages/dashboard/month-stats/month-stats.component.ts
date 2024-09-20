import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";
import { FormControl } from '@angular/forms';

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
  selector: 'app-month-stats',
  templateUrl: './month-stats.component.html',
  styleUrls: ['./month-stats.component.scss']
})

export class MonthStatsComponent implements OnInit {
  labels: Array<any> = []
  values: Array<any> = []
  month: string = ''
  totalRevenue: string = ''
  @ViewChild("chart") chart: ChartComponent;
  chartOptions: any;
  dayLabels: Array<any> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  dayValues: Array<any> = ['0', '0', '0', '0', '0', '0', '0']
  filterMonth: FormControl = new FormControl('')
  months = [
    { key: 0, value: 'January' },
    { key: 1, value: 'February' },
    { key: 2, value: 'March' },
    { key: 3, value: 'April' },
    { key: 4, value: 'May' },
    { key: 5, value: 'June' },
    { key: 6, value: 'July' },
    { key: 7, value: 'August' },
    { key: 8, value: 'September' },
    { key: 9, value: 'October' },
    { key: 10, value: 'November' },
    { key: 11, value: 'December' }
  ];
  constructor(
    private DashboardService: DashboardService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let dateItem = new Date()
    this.filterMonth.setValue(dateItem.getMonth())
    this.getDetails()
  }

  getDetails() {
    this.DashboardService.currentRevenues({ month: this.filterMonth?.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.labels = []
          this.values = []
          for (let revenue of res?.result?.revenues) {
            this.labels.push(revenue?.key)
            this.values.push(revenue?.value)
          }
          this.month = res?.result?.details?.month
          this.totalRevenue = res?.result?.details?.total
          this.chartOptions = {
            series: [{ name: "Revenue", data: this.values, color: '#00BDAB' }],
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
            labels: this.labels,
            xaxis: { type: "category" },
            yaxis: { opposite: true },
            legend: { horizontalAlign: "left" }
          };

          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

}
