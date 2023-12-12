import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';
import { VoucherListingComponent } from './voucher-listing/voucher-listing.component';

const routes: Routes = [
  { path: '', component: VoucherListingComponent },
  { path: 'create', component: CreateVoucherComponent },
  { path: 'update/:voucher', component: UpdateVoucherComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
