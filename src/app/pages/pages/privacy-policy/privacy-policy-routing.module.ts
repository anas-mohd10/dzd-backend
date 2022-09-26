import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPrivacyPolicyComponent } from './add-privacy-policy/add-privacy-policy.component';

const routes: Routes = [
  { path: '', component: AddPrivacyPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
