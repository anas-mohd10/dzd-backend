import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AddAboutComponent } from './add-about/add-about.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    AddAboutComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
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
export class AboutModule { }
