import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { UpdateCustomersComponent } from './update-customers/update-customers.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ReferralHistoryComponent } from './referral-history/referral-history.component';
import { SharedModule } from '../../shared/shared.module';
import { NewsletterSubscribersComponent } from './newsletter-subscribers/newsletter-subscribers.component'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    CustomersListComponent,
    AddCustomersComponent,
    UpdateCustomersComponent,
    ReferralHistoryComponent,
    NewsletterSubscribersComponent
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    CustomersRoutingModule,
    DataTablesModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AlertModule,
  ]
})
export class CustomersModule { }
