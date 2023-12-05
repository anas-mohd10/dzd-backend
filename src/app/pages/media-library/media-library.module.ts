import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaLibraryRoutingModule } from './media-library-routing.module';
import { MediaListingComponent } from './media-listing/media-listing.component';
import { MediaDetailsComponent } from './media-details/media-details.component';


@NgModule({
  declarations: [
    MediaListingComponent,
    MediaDetailsComponent
  ],
  imports: [
    CommonModule,
    MediaLibraryRoutingModule
  ]
})
export class MediaLibraryModule { }
