import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartListComponent } from './cart-list/cart-list.component';
import { UpdateCartComponent } from './update-cart/update-cart.component';

const routes: Routes = [
  { path: '', component: CartListComponent },
  { path: 'update', component: UpdateCartComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
