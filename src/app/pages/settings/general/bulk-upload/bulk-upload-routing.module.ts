import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkOptionsComponent } from './bulk-options/bulk-options.component';
import { BulkMediaUploadComponent } from './bulk-media-upload/bulk-media-upload.component';
import { BulkFileUploadComponent } from './bulk-file-upload/bulk-file-upload.component';

const routes: Routes = [
  { path: '', component: BulkOptionsComponent },
  { path: 'media', component: BulkMediaUploadComponent },
  { path: 'file', component: BulkFileUploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkUploadRoutingModule { }
