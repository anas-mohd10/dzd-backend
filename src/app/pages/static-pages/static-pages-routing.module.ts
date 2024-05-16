import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesListComponent } from './pages-list/pages-list.component';
import { AddPagesComponent } from './add-pages/add-pages.component';
import { UpdatePagesComponent } from './update-pages/update-pages.component';

const routes: Routes = [
  { path: '', component: PagesListComponent },
  { path: 'add', component: AddPagesComponent },
  { path: 'update', component: UpdatePagesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
