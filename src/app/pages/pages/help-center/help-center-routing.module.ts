import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddHelpCenterComponent } from './add-help-center/add-help-center.component';

const routes: Routes = [
  { path: '', component: AddHelpCenterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpCenterRoutingModule { }
