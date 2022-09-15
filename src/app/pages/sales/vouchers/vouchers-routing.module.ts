import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVouchersComponent } from './add-vouchers/add-vouchers.component';
import { UpdateVouchersComponent } from './update-vouchers/update-vouchers.component';
import { VouchersListComponent } from './vouchers-list/vouchers-list.component';

const routes: Routes = [
  { path: '', component: VouchersListComponent },
  { path: 'add', component: AddVouchersComponent },
  { path: 'update', component: UpdateVouchersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
