import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialMediaRoutingModule } from './social.media-routing.module';
import { SocialMediaListComponent } from './social-media-list/social-media-list.component';
import { AddSocialMediaComponent } from './add-social-media/add-social-media.component';
import { UpdateSocialMediaComponent } from './update-social-media/update-social-media.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    SocialMediaListComponent,
    AddSocialMediaComponent,
    UpdateSocialMediaComponent
  ],
  imports: [
    CommonModule,
    SocialMediaRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class SocialMediaModule { }
