import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { UpdateCustomersComponent } from './update-customers/update-customers.component';
import { ReferralHistoryComponent } from './referral-history/referral-history.component';
import { NewsletterSubscribersComponent } from './newsletter-subscribers/newsletter-subscribers.component';

const routes: Routes = [
  { path: '', component: CustomersListComponent },
  { path: 'add', component: AddCustomersComponent },
  { path: "newsletter-subscribers", component: NewsletterSubscribersComponent },
  { path: "referral-history/:id", component: ReferralHistoryComponent },
  { path: 'update/:id', component: UpdateCustomersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
