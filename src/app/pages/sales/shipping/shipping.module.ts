import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRoutingModule } from './shipping-routing.module';
import { ShippingListComponent } from './shipping-list/shipping-list.component';
import { AddShippingComponent } from './add-shipping/add-shipping.component';
import { UpdateShippingComponent } from './update-shipping/update-shipping.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    ShippingListComponent,
    AddShippingComponent,
    UpdateShippingComponent
  ],
  imports: [
    CommonModule,
    ShippingRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ]
})
export class ShippingModule { }
