import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkUploadRoutingModule } from './bulk-upload-routing.module';
import { BulkOptionsComponent } from './bulk-options/bulk-options.component';
import { RouterModule } from '@angular/router';
import { BulkFileUploadComponent } from './bulk-file-upload/bulk-file-upload.component';
import { BulkMediaUploadComponent } from './bulk-media-upload/bulk-media-upload.component';
import { UploadsListComponent } from './uploads-list/uploads-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    BulkOptionsComponent,
    BulkFileUploadComponent,
    BulkMediaUploadComponent,
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
