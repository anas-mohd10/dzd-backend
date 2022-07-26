import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './category-list.component';
import { DataTablesModule } from 'angular-datatables';
// import { WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryComponent,
      },
    ]),
    // WidgetsModule,
  ],
})
export class CategoryModule {}
