import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPrivacyPolicyComponent } from './add-privacy-policy/add-privacy-policy.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: AddPrivacyPolicyComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
