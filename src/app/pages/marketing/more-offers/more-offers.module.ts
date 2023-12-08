import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoreOffersRoutingModule } from './more-offers-routing.module';
import { OffersListingComponent } from './offers-listing/offers-listing.component';
import { AddMoreOffersComponent } from './add-more-offers/add-more-offers.component';
import { UpdateMoreOffersComponent } from './update-more-offers/update-more-offers.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    OffersListingComponent,
    AddMoreOffersComponent,
    UpdateMoreOffersComponent
  ],
  imports: [
    CommonModule,
    TabsModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    MoreOffersRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})
export class MoreOffersModule { }
