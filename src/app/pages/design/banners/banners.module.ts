import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannersRoutingModule } from './banners-routing.module';
import { BannerListComponent } from './banner-list/banner-list.component';
import { AddBannerListComponent } from './add-banner-list/add-banner-list.component';
import { UpdateBannerListComponent } from './update-banner-list/update-banner-list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { WidgetsModule } from 'src/app/shared/partials';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BannerListComponent,
    AddBannerListComponent,
    UpdateBannerListComponent
  ],
  imports: [
    CommonModule,
    BannersRoutingModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    ImageCropperModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    SharedModule,
    WidgetsModule,
  ]
})
export class BannersModule { }
