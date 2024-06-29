import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaListingComponent } from './media-listing/media-listing.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { PermissionGuard } from 'src/app/core/auth/permission.guard';

const routes: Routes = [
  { path: '', component: MediaListingComponent, canActivate: [PermissionGuard] },
  { path: ':media', component: MediaDetailsComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MediaLibraryRoutingModule { }
