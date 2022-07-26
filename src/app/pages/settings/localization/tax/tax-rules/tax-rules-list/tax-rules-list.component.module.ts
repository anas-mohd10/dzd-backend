import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxRulesComponent } from './tax-rules-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [TaxRulesComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: TaxRulesComponent,
      },
    ]),
  ],
})
export class TaxRulesModule {}
