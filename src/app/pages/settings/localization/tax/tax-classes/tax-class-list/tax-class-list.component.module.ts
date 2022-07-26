import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxClassComponent } from './tax-class-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [TaxClassComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: TaxClassComponent,
      },
    ]),
  ],
})
export class TaxClassModule {}
