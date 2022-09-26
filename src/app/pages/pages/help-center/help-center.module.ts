import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpCenterRoutingModule } from './help-center-routing.module';
import { AddHelpCenterComponent } from './add-help-center/add-help-center.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AddHelpCenterComponent
  ],
  imports: [
    CommonModule,
    HelpCenterRoutingModule,
    DataTablesModule,
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
export class HelpCenterModule { }
