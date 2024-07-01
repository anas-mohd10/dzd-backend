import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/core/auth/authentication.guard';
import { AddUsersComponent } from './add-users/add-users.component';
import { UpdateUsersComponent } from './update-users/update-users.component';
import { UsersComponent } from './users/users.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: UsersComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: AddUsersComponent, canActivate: [PermissionGuard] },
  { path: 'update', component: UpdateUsersComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
