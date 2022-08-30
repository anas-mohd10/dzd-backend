import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnsListComponent } from './returns-list/returns-list.component';
import { UpdateReturnsListComponent } from './update-returns-list/update-returns-list.component';

const routes: Routes = [
  { path: '', component: ReturnsListComponent },
  { path: 'update', component: UpdateReturnsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnsRoutingModule { }
