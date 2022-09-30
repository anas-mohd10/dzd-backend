import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { AddCouponsComponent } from './add-coupons/add-coupons.component';
import { UpdateCouponsComponent } from './update-coupons/update-coupons.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    CouponsListComponent,
    AddCouponsComponent,
    UpdateCouponsComponent
  ],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    DataTablesModule,
    ImageCropperModule,
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
export class CouponsModule { }
