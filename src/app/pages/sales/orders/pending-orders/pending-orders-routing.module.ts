import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingOrdersListComponent } from './pending-orders-list/pending-orders-list.component';

const routes: Routes = [
  { path: '', component: PendingOrdersListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingOrdersRoutingModule { }
