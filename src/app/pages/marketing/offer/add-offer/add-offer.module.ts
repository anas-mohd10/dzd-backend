import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddOfferComponent } from './add-offer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [AddOfferComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'offer/add',
        component: AddOfferComponent,
      },
    ]),
  ],
})
export class AddOfferModule {}
