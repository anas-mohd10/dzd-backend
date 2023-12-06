import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaLibraryRoutingModule } from './media-library-routing.module';
import { MediaListingComponent } from './media-listing/media-listing.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    MediaListingComponent,
    MediaDetailsComponent
  ],
  imports: [
    CommonModule,
    MediaLibraryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ClipboardModule
  ]
})
export class MediaLibraryModule { }
