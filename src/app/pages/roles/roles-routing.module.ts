import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { UpdateRolesComponent } from './update-roles/update-roles.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: RolesListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: AddRolesComponent, canActivate: [PermissionGuard] },
  { path: 'update', component: UpdateRolesComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
