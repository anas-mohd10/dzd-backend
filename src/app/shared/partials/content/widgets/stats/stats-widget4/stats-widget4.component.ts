import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";
import { DashboardService } from 'src/app/includes/services/dashboard.service';

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
  selector: 'app-stats-widget4',
  templateUrl: './stats-widget4.component.html',
  styleUrls: ['./stats-widget4.component.scss'],
})

export class StatsWidget4Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  chartOptions: any;
  monthlyLables: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  monthlyValues: Array<any> = ['0', '0', '0', '0', '0', '0']
  revenueType: FormControl = new FormControl('6')

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMonthlyRevenue()
  }

  getMonthlyRevenue() {
    this.DashboardService.getMonthlyRevenue({ type: this.revenueType.value }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.monthlyLables = []
        this.monthlyValues = []

        for (let _item of res?.result?.monthlyResults) {
          this.monthlyLables.push(_item?.name.slice(0, 3))
          this.monthlyValues.push(_item?.revenue)
        }

        this.chartOptions = {
          series: [{ name: "Revenue", data: this.monthlyValues, color: '#00bdab' }],
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
          labels: this.monthlyLables,
          xaxis: { type: "category", },
          yaxis: { opposite: true },
          legend: { horizontalAlign: "left" }
        };

        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
