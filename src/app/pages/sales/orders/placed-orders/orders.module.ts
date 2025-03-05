import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from '../placed-orders/orders-list/orders-list.component';
import { AddOrdersComponent } from '../placed-orders/add-orders/add-orders.component';
import { UpdateOrdersComponent } from '../placed-orders/update-orders/update-orders.component';
import { ToastrModule } from 'ngx-toastr';
import { WidgetsModule } from '../../../../shared/partials';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    OrdersListComponent,
    AddOrdersComponent,
    UpdateOrdersComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    TooltipModule,
    SharedModule,
    NgSelectModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    WidgetsModule,
    SwiperModule
  ]
})
export class OrdersModule { }
