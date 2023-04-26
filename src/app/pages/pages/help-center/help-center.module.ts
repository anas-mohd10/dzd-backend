import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpCenterRoutingModule } from './help-center-routing.module';
import { AddHelpCenterComponent } from './add-help-center/add-help-center.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
    AngularEditorModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),

  ]
})
export class HelpCenterModule { }
