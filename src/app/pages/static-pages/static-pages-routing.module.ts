import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesListComponent } from './pages-list/pages-list.component';
import { AddPagesComponent } from './add-pages/add-pages.component';
import { UpdatePagesComponent } from './update-pages/update-pages.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: PagesListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: AddPagesComponent, canActivate: [PermissionGuard] },
  { path: 'update', component: UpdatePagesComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
