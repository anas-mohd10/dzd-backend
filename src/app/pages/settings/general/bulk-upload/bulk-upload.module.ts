import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkUploadRoutingModule } from './bulk-upload-routing.module';
import { RouterModule } from '@angular/router';
import { UploadsListComponent } from './uploads-list/uploads-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    UploadsListComponent
  ],
  imports: [
    CommonModule,
    BulkUploadRoutingModule,
    RouterModule,
    SharedModule,
    FormsModule,
    BsDatepickerModule,
    ReactiveFormsModule
  ]
})
export class BulkUploadModule { }
