import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadsListComponent } from './uploads-list/uploads-list.component';

const routes: Routes = [
  { path: '', component: UploadsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkUploadRoutingModule { }
