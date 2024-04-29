import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddBrandComponent } from './add-brand.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [AddBrandComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddBrandComponent,
      },
    ]),
  ],
})
export class AddBrandModule {}
