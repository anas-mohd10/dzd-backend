import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { AddNotificationsComponent } from './add-notifications/add-notifications.component';
import { UpdateNotificationsComponent } from './update-notifications/update-notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    NotificationsListComponent,
    AddNotificationsComponent,
    UpdateNotificationsComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class NotificationsModule { }
