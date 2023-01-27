import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: any
  constructor(private DashboardService: DashboardService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.DashboardService.getDashboard({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
