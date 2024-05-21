import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreListComponent } from './store-list/store-list.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from 'src/app/pages/shared/shared.module';


@NgModule({
  declarations: [
    StoreListComponent,
    AddStoreComponent,
    UpdateStoreComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ]
})
export class StoreModule { }
