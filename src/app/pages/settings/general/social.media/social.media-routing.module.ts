import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSocialMediaComponent } from './add-social-media/add-social-media.component';
import { SocialMediaListComponent } from './social-media-list/social-media-list.component';
import { UpdateSocialMediaComponent } from './update-social-media/update-social-media.component';

const routes: Routes = [
  { path: '', component: SocialMediaListComponent },
  { path: 'add', component: AddSocialMediaComponent },
  { path: 'update', component: UpdateSocialMediaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
