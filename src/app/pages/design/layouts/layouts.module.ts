import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsRoutingModule } from './layouts-routing.module';
import { UpdateLayoutListComponent } from './update-layout-list/update-layout-list.component';
import { LayoutListComponent } from './layout-list/layout-list.component';
import { AddLayoutListComponent } from './add-layout-list/add-layout-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { WidgetsModule } from 'src/app/shared/partials';


@NgModule({
  declarations: [
    UpdateLayoutListComponent,
    LayoutListComponent,
    AddLayoutListComponent
  ],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    WidgetsModule,
  ]
})
export class LayoutsModule { }
