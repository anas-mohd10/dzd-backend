import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaListingComponent } from './media-listing/media-listing.component';
import { MediaDetailsComponent } from './media-details/media-details.component';

const routes: Routes = [
  { path: '', component: MediaListingComponent },
  { path: ':media', component: MediaDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MediaLibraryRoutingModule { }
