import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrdersComponent } from './add-orders/add-orders.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { UpdateOrdersComponent } from './update-orders/update-orders.component';

const routes: Routes = [
  { path: '', component: OrdersListComponent },
  { path: 'add', component: AddOrdersComponent },
  { path: 'update', component: UpdateOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
