import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxComponent } from './tax-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [TaxComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: 'tax',
        component: TaxComponent,
      },
    ]),
  ],
})
export class TaxModule {}
