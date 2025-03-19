import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddCategoryComponent } from './add-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [AddCategoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '',  component: AddCategoryComponent }]),
  ],
})
export class AddCategoryModule { }
