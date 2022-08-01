import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { AddOrdersComponent } from './add-orders/add-orders.component';
import { UpdateOrdersComponent } from './update-orders/update-orders.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    OrdersListComponent,
    AddOrdersComponent,
    UpdateOrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class OrdersModule { }
