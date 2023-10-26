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
})
export class StatsWidget4Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: any;
  months: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  revenues: Array<any> = ['0', '0', '0', '0', '0', '0']
  duration: FormControl = new FormControl('6')

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.DashboardService.getMonthlyRevenue({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.months = []
        this.revenues = []
        for (let _item of res?.result?.monthly) {
          this.months.push(_item?.name.slice(0, 3))
          this.revenues.push(_item?.revenue)
        }

        this.chartOptions = {
          series: [
            {
              name: "Revenue",
              data: this.revenues
            }
          ],
          chart: {
            type: "area",
            height: 350,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: true
          },
          stroke: {
            curve: "smooth"
          },
          labels: this.months,
          xaxis: {
            type: "text"
          },
          yaxis: {
            opposite: true
          },
          legend: {
            horizontalAlign: "left"
          }
        };

        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
