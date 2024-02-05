import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkUploadRoutingModule } from './bulk-upload-routing.module';
import { BulkOptionsComponent } from './bulk-options/bulk-options.component';
import { RouterModule } from '@angular/router';
import { BulkFileUploadComponent } from './bulk-file-upload/bulk-file-upload.component';
import { BulkMediaUploadComponent } from './bulk-media-upload/bulk-media-upload.component';
import { UploadsListComponent } from './uploads-list/uploads-list.component';

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
    RouterModule
  ]
})
export class BulkUploadModule { }
