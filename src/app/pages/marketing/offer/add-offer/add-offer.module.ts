import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddOfferComponent } from './add-offer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [AddOfferComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddOfferComponent,
      },
    ]),
  ],
})
export class AddOfferModule {}
