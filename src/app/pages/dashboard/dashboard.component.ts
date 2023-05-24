import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { AuthService } from 'src/app/includes/services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: any
  monthlyRevenue: any = [];
  daysRevenue: any = []
  lastMonthRevenue: void;
  userData: any
  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AuthService: AuthService
  ) { }

  ngOnInit(): void {
    this.userData = this.AuthService.getCurrentUser();

    this.DashboardService.getDashboard({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.DashboardService.getMonthlyRevenue({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.monthlyRevenue = res?.result
        this.lastMonthRevenue = this.monthlyRevenue[0]['revenue']
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
