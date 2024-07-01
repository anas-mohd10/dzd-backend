import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVoucherComponent } from './create-voucher/create-voucher.component';
import { UpdateVoucherComponent } from './update-voucher/update-voucher.component';
import { VoucherListingComponent } from './voucher-listing/voucher-listing.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: VoucherListingComponent, canActivate: [PermissionGuard] },
  { path: 'create', component: CreateVoucherComponent, canActivate: [PermissionGuard] },
  { path: 'update/:voucher', component: UpdateVoucherComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
