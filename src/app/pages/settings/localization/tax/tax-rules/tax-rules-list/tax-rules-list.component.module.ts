import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxRulesComponent } from './tax-rules-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [TaxRulesComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: TaxRulesComponent, }]),
  ],
})
export class TaxRulesModule { }
