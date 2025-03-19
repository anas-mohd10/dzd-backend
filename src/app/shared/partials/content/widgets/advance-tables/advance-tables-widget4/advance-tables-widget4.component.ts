import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DashboardService } from 'src/app/includes/services/dashboard.service';

@Component({
  selector: 'app-advance-tables-widget4',
  templateUrl: './advance-tables-widget4.component.html',
  styleUrls: ['./advance-tables-widget4.component.scss'],
})
export class AdvanceTablesWidget4Component implements OnInit {
  products: any = []
  appRoutes = appRoutes
  constructor(private DashboardService: DashboardService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.DashboardService.getTopSellingProducts().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
