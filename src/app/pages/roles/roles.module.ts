import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesListComponent } from './roles-list/roles-list.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { UpdateRolesComponent } from './update-roles/update-roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    RolesListComponent,
    AddRolesComponent,
    UpdateRolesComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})

export class RolesModule { }
