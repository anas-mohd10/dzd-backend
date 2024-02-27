import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { ManageRequestsComponent } from './manage-requests/manage-requests.component';

const routes: Routes = [
  { path: '', component: RequestsListComponent },
  { path: ':id', component: ManageRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReplaceRequestsRoutingModule { }
