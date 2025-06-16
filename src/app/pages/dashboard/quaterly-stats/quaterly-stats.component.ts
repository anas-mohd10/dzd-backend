import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexYAxis, ApexTitleSubtitle, ApexLegend } from "ng-apexcharts";
import { appRoutes } from 'src/app/config/routes';

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
  selector: 'app-quaterly-stats',
  templateUrl: './quaterly-stats.component.html',
  styleUrls: ['./quaterly-stats.component.scss']
})

export class QuaterlyStatsComponent implements OnInit, OnChanges {
  appRoutes = appRoutes
  revenueType: FormControl = new FormControl('6')
  @Input('monthlyRevenues') monthlyRevenues: Array<any> = []
  @Output('filterChanged') filterChanged = new EventEmitter<number>()
  chartOptions: ChartOptions;
  labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  values: number[] = [0, 0, 0, 0, 0, 0]
  revenueMaxItem: { month: string, revenue: number } | null = null
  totalRevenue: number = 0
  revenueMaxPercentage: number = 0

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.labels = this.monthlyRevenues.map(item => item.name.slice(0, 3))
    this.values = this.monthlyRevenues.map(item => item.revenue)

    if (this.monthlyRevenues && this.monthlyRevenues.length > 0) {
      let revenuesMap: { [key: string]: number } = {}
      this.monthlyRevenues.forEach(item => revenuesMap[item.name] = Number(item.revenue))
      this.totalRevenue = this.monthlyRevenues.reduce((acc, item) => acc + Number(item.revenue), 0)
      this.revenueMaxItem = {
        month: Object.keys(revenuesMap).reduce((a, b) => revenuesMap[a] > revenuesMap[b] ? a : b),
        revenue: revenuesMap[Object.keys(revenuesMap).reduce((a, b) => revenuesMap[a] > revenuesMap[b] ? a : b)]
      }
      this.revenueMaxPercentage = Number(((this.revenueMaxItem.revenue / this.totalRevenue) * 100).toFixed(2))
    } else {
      this.revenueMaxItem = null;
    }
    
    this.chartOptions = {
      series: [{ name: "Revenue", data: this.values, color: '#50CD89' }],
      chart: {
        type: "area",
        height: 350,
        zoom: { enabled: false },
        fontFamily: 'Sen, sans-serif'
      },
      dataLabels: { enabled: false, style: { colors: ['#50CD89'] } },
      stroke: { curve: "smooth" },
      labels: this.labels,
      xaxis: { type: "category", labels: { style: { fontSize: '14px' } } },
      yaxis: { opposite: true, labels: { style: { fontSize: '14px' } } },
      legend: { horizontalAlign: "left" },
      title: { text: "" },
      subtitle: { text: "" }
    };
  }

  ngOnInit(): void { }

}
