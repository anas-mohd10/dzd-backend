import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAboutComponent } from './add-about/add-about.component';

const routes: Routes = [
  { path: '', component: AddAboutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
