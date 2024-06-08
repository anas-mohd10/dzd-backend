import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxClassComponent } from './tax-class-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [TaxClassComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: TaxClassComponent }]),
  ],
})
export class TaxClassModule { }
