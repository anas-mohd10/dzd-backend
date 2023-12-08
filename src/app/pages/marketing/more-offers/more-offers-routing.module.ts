import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersListingComponent } from './offers-listing/offers-listing.component';
import { AddMoreOffersComponent } from './add-more-offers/add-more-offers.component';
import { UpdateMoreOffersComponent } from './update-more-offers/update-more-offers.component';

const routes: Routes = [
  { path: '', component: OffersListingComponent },
  { path: 'add', component: AddMoreOffersComponent },
  { path: 'update/:offer', component: UpdateMoreOffersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoreOffersRoutingModule { }
