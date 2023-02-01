import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: any
  monthlyRevenue: any = [];
  daysRevenue: any = []
  constructor(private DashboardService: DashboardService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.DashboardService.getDashboard({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.DashboardService.getMonthlyRevenue({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.monthlyRevenue = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.DashboardService.getDaysRevenue({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.daysRevenue = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
