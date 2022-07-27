import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { UpdateRolesComponent } from './update-roles/update-roles.component';

const routes: Routes = [
  { path: '', component: RolesListComponent },
  { path: 'add', component: AddRolesComponent },
  { path: 'update', component: UpdateRolesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
