import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { UpdateCustomersComponent } from './update-customers/update-customers.component';
import { ReferralHistoryComponent } from './referral-history/referral-history.component';
import { NewsletterSubscribersComponent } from './newsletter-subscribers/newsletter-subscribers.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: CustomersListComponent, canActivate: [PermissionGuard] },
  { path: 'add', component: AddCustomersComponent, canActivate: [PermissionGuard] },
  { path: "newsletter-subscribers", component: NewsletterSubscribersComponent, canActivate: [PermissionGuard] },
  { path: "referral-history/:id", component: ReferralHistoryComponent, canActivate: [PermissionGuard] },
  { path: 'update/:id', component: UpdateCustomersComponent, canActivate: [PermissionGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
