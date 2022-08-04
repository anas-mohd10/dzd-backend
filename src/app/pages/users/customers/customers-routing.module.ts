import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { UpdateCustomersComponent } from './update-customers/update-customers.component';

const routes: Routes = [
  { path: '', component: CustomersListComponent },
  { path: 'add', component: AddCustomersComponent },
  { path: 'update', component: UpdateCustomersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
