import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandComponent } from './brand-list.component';
import { DataTablesModule } from 'angular-datatables';
import { BrandCardComponent } from '../brand-card/brand-card.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [BrandComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    NgxPaginationModule,
    RouterModule.forChild([
      {
        path: '',
        component: BrandComponent,
      },
      {
        path: 'list',
        component: BrandCardComponent,
      },
    ]),
  ],
})
export class BrandModule { }
