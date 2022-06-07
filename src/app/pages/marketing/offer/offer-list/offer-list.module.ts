import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfferListComponent } from './offer-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [OfferListComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: 'offer',
        component: OfferListComponent,
      },
    ]),
  ],
})
export class OfferModule {}
