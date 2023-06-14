import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { UpdateStoreComponent } from './update-store/update-store.component';

const routes: Routes = [
  { path: '', component: StoreListComponent },
  { path: 'add', component: AddStoreComponent },
  { path: 'update', component: UpdateStoreComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
