import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfferListComponent } from './offer-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [OfferListComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: OfferListComponent,
      },
    ]),
  ],
})
export class OfferModule {}
