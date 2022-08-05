import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCouponsComponent } from './add-coupons/add-coupons.component';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { UpdateCouponsComponent } from './update-coupons/update-coupons.component';

const routes: Routes = [
  { path: '', component: CouponsListComponent },
  { path: 'add', component: AddCouponsComponent },
  { path: 'update', component: UpdateCouponsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
