import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { UpdateCustomersComponent } from './update-customers/update-customers.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { WidgetsModule } from 'src/app/shared/partials';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ReferralHistoryComponent } from './referral-history/referral-history.component';
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    CustomersListComponent,
    AddCustomersComponent,
    UpdateCustomersComponent,
    ReferralHistoryComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AlertModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    WidgetsModule,
  ]
})
export class CustomersModule { }
