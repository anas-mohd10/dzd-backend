import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnListComponent } from './return-list/return-list.component';
import { ReturnDetailsComponent } from './return-details/return-details.component';

const routes: Routes = [
  { path: '', component: ReturnListComponent },
  { path: ':id', component: ReturnDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnsRoutingModule { }
