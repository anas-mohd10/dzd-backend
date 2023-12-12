import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VouchersListComponent } from '../../sales/vouchers/vouchers-list/vouchers-list.component';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';

const routes: Routes = [
  { path: '', component: VouchersListComponent },
  { path: 'create', component: CreateVoucherComponent },
  { path: 'update/:voucher', component: UpdateVoucherComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
