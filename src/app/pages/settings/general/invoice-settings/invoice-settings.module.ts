import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceSettingsRoutingModule } from './invoice-settings-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    InvoiceListComponent
  ],
  imports: [
    CommonModule,
    InvoiceSettingsRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class InvoiceSettingsModule { }
