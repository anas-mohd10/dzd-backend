import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { UpdateFaqComponent } from './update-faq/update-faq.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: FaqListComponent, canActivate: [PermissionGuard]},
  { path: 'add', component: AddFaqComponent , canActivate: [PermissionGuard]},
  { path: 'update', component: UpdateFaqComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
