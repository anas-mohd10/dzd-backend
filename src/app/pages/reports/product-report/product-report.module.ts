import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductReportRoutingModule } from './product-report-routing.module';
import { ProductReportListComponent } from './product-report-list/product-report-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { WidgetsModule } from 'src/app/shared/partials';


@NgModule({
  declarations: [
    ProductReportListComponent
  ],
  imports: [
    CommonModule,
    ProductReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    WidgetsModule,
  ]
})
export class ProductReportModule { }
