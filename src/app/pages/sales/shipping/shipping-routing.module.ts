import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddShippingComponent } from './add-shipping/add-shipping.component';
import { ShippingListComponent } from './shipping-list/shipping-list.component';
import { UpdateShippingComponent } from './update-shipping/update-shipping.component';

const routes: Routes = [
  { path: '', component: ShippingListComponent },
  { path: 'add', component: AddShippingComponent },
  { path: 'update', component: UpdateShippingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRoutingModule { }
