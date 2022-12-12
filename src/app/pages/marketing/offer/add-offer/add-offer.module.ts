import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddOfferComponent } from './add-offer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [AddOfferComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    ImageCropperModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddOfferComponent,
      },
    ]),
  ],
})
export class AddOfferModule { }
