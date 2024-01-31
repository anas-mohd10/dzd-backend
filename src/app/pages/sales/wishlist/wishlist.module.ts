import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistListComponent } from './wishlist-list/wishlist-list.component';
import { WishlistDetailsComponent } from './wishlist-details/wishlist-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    WishlistListComponent,
    WishlistDetailsComponent
  ],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class WishlistModule { }
