import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './category-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchivedCategoryComponent } from '../archived-category/archived-category.component';

// import { WidgetsModule } from '../../_metronic/partials';

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CategoryComponent,
      },
      {
        path: 'archive',
        component: ArchivedCategoryComponent,
      },
    ]),
    // WidgetsModule,
  ],
})
export class CategoryModule { }
