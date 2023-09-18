import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { DetailedOrderComponent } from './detailed-order/detailed-order.component';

const routes: Routes = [
  { path: '', component: ReportsListComponent },
  { path: 'detailed-orders', component: DetailedOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
