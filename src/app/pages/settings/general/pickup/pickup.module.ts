import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PickupRoutingModule } from './pickup-routing.module';
import { CreatePickupComponent } from './create-pickup/create-pickup.component';
import { UpdatePickupComponent } from './update-pickup/update-pickup.component';
import { PickupListComponent } from './pickup-list/pickup-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreatePickupComponent,
    UpdatePickupComponent,
    PickupListComponent
  ],
  imports: [
    CommonModule,
    PickupRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PickupModule { }
