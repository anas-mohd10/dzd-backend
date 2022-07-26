import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateOfferComponent } from './update-offer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [UpdateOfferComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UpdateOfferComponent,
      },
    ]),
  ],
})
export class UpdateOfferModule {}
