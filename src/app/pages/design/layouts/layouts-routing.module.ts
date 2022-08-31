import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { AddLayoutListComponent } from './add-layout-list/add-layout-list.component';
import { UpdateLayoutListComponent } from './update-layout-list/update-layout-list.component';

const routes: Routes = [
  { path: '', component: LayoutComponent },
  { path: '', component: AddLayoutListComponent },
  { path: '', component: UpdateLayoutListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
