import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VouchersListComponent } from './vouchers-list/vouchers-list.component';
import { AddVouchersComponent } from './add-vouchers/add-vouchers.component';
import { UpdateVouchersComponent } from './update-vouchers/update-vouchers.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    VouchersListComponent,
    AddVouchersComponent,
    UpdateVouchersComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule,
    DataTablesModule,
    FormsModule,
    ImageCropperModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class VouchersModule { }
