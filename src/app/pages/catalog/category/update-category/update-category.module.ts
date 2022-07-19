import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateCategoryComponent } from './update-category.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [UpdateCategoryComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ToastrModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    RouterModule.forChild([
      {
        path: 'category/update',
        component: UpdateCategoryComponent,
      },
    ]),
  ],
})
export class UpdateCategoryModule {}