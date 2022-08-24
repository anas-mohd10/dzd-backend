import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { OrderReportListComponent } from './order-report-list/order-report-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    OrderReportListComponent
  ],
  imports: [
    CommonModule,
    OrderReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class OrderReportModule { }
