import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderReportListComponent } from './order-report-list/order-report-list.component';

const routes: Routes = [
  {path: '', component: OrderReportListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReportRoutingModule { }
