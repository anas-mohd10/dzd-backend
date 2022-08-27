import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingOrdersListComponent } from './pending-orders-list/pending-orders-list.component';
import { UpdatePendingOrdersComponent } from './update-pending-orders/update-pending-orders.component';

const routes: Routes = [
  { path: '', component: PendingOrdersListComponent },
  { path: 'update', component: UpdatePendingOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingOrdersRoutingModule { }
