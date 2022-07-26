import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandComponent } from './brand-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [BrandComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: BrandComponent,
      },
    ]),
  ],
})
export class BrandModule {}
