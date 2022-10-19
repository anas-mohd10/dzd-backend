import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPageLimitsComponent } from './add-page-limits/add-page-limits.component';
import { PageLimitsComponent } from './page-limits/page-limits.component';
import { UpdatePageLimitsComponent } from './update-page-limits/update-page-limits.component';

const routes: Routes = [
  { path: '', component: PageLimitsComponent },
  { path: 'add', component: AddPageLimitsComponent },
  { path: 'update', component: UpdatePageLimitsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageLimitsRoutingModule { }
