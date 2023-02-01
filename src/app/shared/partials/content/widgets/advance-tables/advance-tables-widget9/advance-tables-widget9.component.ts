import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DashboardService } from 'src/app/includes/services/dashboard.service';

@Component({
  selector: 'app-advance-tables-widget9',
  templateUrl: './advance-tables-widget9.component.html',
  styleUrls: ['./advance-tables-widget9.component.scss'],
})
export class AdvanceTablesWidget9Component implements OnInit {
  @Input() cssClass: '';
  appRoutes = appRoutes
  orders: any;

  constructor(private DashboardService: DashboardService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.DashboardService.getNewOrders({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result
        this.ChangeDetectorRef.markForCheck()
        for (let order of this.orders) {
          order.orderDate = new Date(order?.orderDate).toDateString()
        }
      }
    })
  }
}
