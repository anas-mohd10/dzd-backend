import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNotificationsComponent } from './add-notifications/add-notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { UpdateNotificationsComponent } from './update-notifications/update-notifications.component';

const routes: Routes = [
  { path: '', component: NotificationsListComponent },
  { path: 'add', component: AddNotificationsComponent },
  { path: 'update', component: UpdateNotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
