import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsRoutingModule } from './layouts-routing.module';
import { UpdateLayoutListComponent } from './update-layout-list/update-layout-list.component';
import { LayoutListComponent } from './layout-list/layout-list.component';
import { AddLayoutListComponent } from './add-layout-list/add-layout-list.component';


@NgModule({
  declarations: [
    UpdateLayoutListComponent,
    LayoutListComponent,
    AddLayoutListComponent
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule
  ]
})
export class LayoutsModule { }
