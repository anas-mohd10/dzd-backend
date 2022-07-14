import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddVariantProductComponent } from './add-variant-product.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AddVariantProductComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    RouterModule.forChild([
      {
        path: 'variant-product/add',
        component: AddVariantProductComponent,
      },
    ]),
  ],
})
export class AddVariantProductModule {}
