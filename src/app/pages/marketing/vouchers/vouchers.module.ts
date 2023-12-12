import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherListingComponent } from './voucher-listing/voucher-listing.component';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VoucherListingComponent,
    CreateVoucherComponent,
    UpdateVoucherComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VouchersModule { }
