import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from './update-product.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [UpdateProductComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule,
    NgSelectModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    RouterModule.forChild([
      {
        path: '',
        component: UpdateProductComponent,
      },
    ]),
  ],
})
export class UpdateProductModule { }
