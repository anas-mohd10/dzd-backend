import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShippingListComponent } from './shipping-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ShippingListComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShippingListComponent,
      },
    ]),
  ],
})
export class ShippingModule {}
