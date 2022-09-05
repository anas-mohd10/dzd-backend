import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLayoutListComponent } from './add-layout-list/add-layout-list.component';
import { LayoutListComponent } from './layout-list/layout-list.component';
import { UpdateLayoutListComponent } from './update-layout-list/update-layout-list.component';

const routes: Routes = [
  { path: '', component: LayoutListComponent },
  { path: 'add', component: AddLayoutListComponent },
  { path: 'update', component: UpdateLayoutListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
