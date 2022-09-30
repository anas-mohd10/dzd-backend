import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { AddNotificationsComponent } from './add-notifications/add-notifications.component';
import { UpdateNotificationsComponent } from './update-notifications/update-notifications.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    NotificationsListComponent,
    AddNotificationsComponent,
    UpdateNotificationsComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    DataTablesModule,
    FormsModule,
    ImageCropperModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      progressBar: true,
    }),
  ]
})
export class NotificationsModule { }
