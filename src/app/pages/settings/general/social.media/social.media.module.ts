import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaRoutingModule } from './social.media-routing.module';
import { SocialMediaListComponent } from './social-media-list/social-media-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSocialNediaComponent } from './add-social-nedia/add-social-nedia.component';
import { UpdateSocialNediaComponent } from './update-social-nedia/update-social-nedia.component';

@NgModule({
  declarations: [
    SocialMediaListComponent,
    AddSocialNediaComponent,
    UpdateSocialNediaComponent,
  ],
  imports: [
    CommonModule,
    SocialMediaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SocialMediaModule { }
