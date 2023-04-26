import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AddPrivacyPolicyComponent } from './add-privacy-policy/add-privacy-policy.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
@NgModule({
  declarations: [
    AddPrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    DataTablesModule,
    FormsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class PrivacyPolicyModule { }
