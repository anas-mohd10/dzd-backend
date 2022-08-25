import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerReportRoutingModule } from './customer-report-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { CustomerReportListComponent } from './customer-report-list/customer-report-list.component';


@NgModule({
  declarations: [
    CustomerReportListComponent
  ],
  imports: [
    CommonModule,
    CustomerReportRoutingModule,
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
export class CustomerReportModule { }
