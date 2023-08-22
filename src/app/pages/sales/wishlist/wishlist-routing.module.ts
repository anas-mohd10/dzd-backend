import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WishlistListComponent } from './wishlist-list/wishlist-list.component';
import { WishlistDetailsComponent } from './wishlist-details/wishlist-details.component';

const routes: Routes = [
  { path: '', component: WishlistListComponent },
  { path: 'details', component: WishlistDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishlistRoutingModule { }
