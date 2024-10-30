import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadsListComponent } from './uploads-list/uploads-list.component';
import { UploadDetailsComponent } from './upload-details/upload-details.component';

const routes: Routes = [
  { path: '', component: UploadsListComponent },
  { path: ':uploadId', component: UploadDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkUploadRoutingModule { }
