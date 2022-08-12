import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSocialNediaComponent } from './add-social-nedia/add-social-nedia.component';
import { SocialMediaListComponent } from './social-media-list/social-media-list.component';
import { UpdateSocialNediaComponent } from './update-social-nedia/update-social-nedia.component';

const routes: Routes = [
  { path: '', component: SocialMediaListComponent },
  { path: 'add', component: AddSocialNediaComponent },
  { path: 'manage', component: UpdateSocialNediaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
