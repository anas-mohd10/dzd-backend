import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchivedCategoryComponent } from '../archived-category/archived-category.component';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: CategoryComponent },
      { path: 'archived', component: ArchivedCategoryComponent },
    ]),
  ],
})
export class CategoryModule { }
