import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpdateOfferComponent } from './update-offer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [UpdateOfferComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
      {
        path: '',
        component: UpdateOfferComponent,
      },
    ]),
  ],
})
export class UpdateOfferModule {}
