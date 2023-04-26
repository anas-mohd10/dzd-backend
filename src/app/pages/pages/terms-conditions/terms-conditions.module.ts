import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsConditionsRoutingModule } from './terms-conditions-routing.module';
import { AddTermsConditionsComponent } from './add-terms-conditions/add-terms-conditions.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    AddTermsConditionsComponent
  ],
  imports: [
    CommonModule,
    TermsConditionsRoutingModule,
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
export class TermsConditionsModule { }
