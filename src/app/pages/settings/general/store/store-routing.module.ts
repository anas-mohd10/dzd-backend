import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: StoreListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: AddStoreComponent, canActivate: [PermissionGuard] },
  { path: 'update', component: UpdateStoreComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
