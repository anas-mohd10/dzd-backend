import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from './product-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ProductCardComponent } from '../product-card/product-card.component';
// import { WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductComponent,
      },
      {
        path: 'list',
        component: ProductCardComponent
      }
    ]),
    // WidgetsModule,
  ],
})
export class ProductModule { }
