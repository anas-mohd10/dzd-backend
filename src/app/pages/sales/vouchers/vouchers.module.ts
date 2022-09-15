import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VouchersListComponent } from './vouchers-list/vouchers-list.component';
import { AddVouchersComponent } from './add-vouchers/add-vouchers.component';
import { UpdateVouchersComponent } from './update-vouchers/update-vouchers.component';


@NgModule({
  declarations: [
    VouchersListComponent,
    AddVouchersComponent,
    UpdateVouchersComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule
  ]
})
export class VouchersModule { }
