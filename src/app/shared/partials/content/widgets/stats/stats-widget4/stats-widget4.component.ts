import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { getCSSVariableValue } from '../../../../../kt/_utils';

@Component({
  selector: 'app-stats-widget4',
  templateUrl: './stats-widget4.component.html',
})
export class StatsWidget4Component implements OnInit {
  @Input() svgIcon = '';
  @Input() color = '';
  @Input() description = '';
  @Input() change = '';
  @ViewChild('chartRef', { static: true }) chartRef: ElementRef;
  height: number;

  chartOptions: any = {};
  labelColor: string;
  baseColor: string;
  lightColor: string;
  monthlyRevenue: any = [];
  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  revenues: any = []

  constructor(private DashboardService: DashboardService, private ChangeDetectorRef: ChangeDetectorRef) {
    this.DashboardService.getMonthlyRevenue({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.monthlyRevenue = res?.result
        for (let month of this.monthlyRevenue) {
          this.months.push(month?.name.slice(0, 3))
          this.revenues.push(month?.revenue)
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  ngOnInit(): void {
    this.height = 350;
    this.labelColor = getCSSVariableValue('--bs-gray-800');
    this.baseColor = getCSSVariableValue('--bs-' + this.color);
    this.lightColor = getCSSVariableValue('--bs-light-' + this.color);
    this.chartOptions = getChartOptions(
      this.revenues,
      this.months,
      this.height,
      this.labelColor,
      this.baseColor,
      this.lightColor
    );

  }
}

function getChartOptions(
  revenues: any,
  months: any,
  height: number,
  labelColor: string,
  baseColor: string,
  lightColor: string
): ApexOptions {
  return {
    series: [
      {
        name: 'Net Profit',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'straight',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: !false,
      },
      axisTicks: {
        show: !false,
      },
      labels: {
        show: !false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: '#E4E6EF',
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: !false,
      },
    },
    yaxis: {
      min: 0,
      max: 150,
      labels: {
        show: !false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '₹ ' + val;
        },
      },
    },
    colors: [lightColor],
    markers: {
      colors: [lightColor],
      strokeColors: [baseColor],
      strokeWidth: 3,
    },
  };
}
