import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingOrdersRoutingModule } from './pending-orders-routing.module';
import { PendingOrdersListComponent } from './pending-orders-list/pending-orders-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdatePendingOrdersComponent } from './update-pending-orders/update-pending-orders.component';


@NgModule({
  declarations: [
    PendingOrdersListComponent,
    UpdatePendingOrdersComponent
  ],
  imports: [
    CommonModule,
    PendingOrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class PendingOrdersModule { }
