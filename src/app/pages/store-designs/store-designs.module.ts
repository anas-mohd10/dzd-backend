import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreDesignsRoutingModule } from './store-designs-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StoreDesignsRoutingModule
  ]
})
export class StoreDesignsModule { }
