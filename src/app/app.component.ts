import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from './includes/services/notifications.service';
import { getMessaging, getToken } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { AdminUsersService } from './includes/services/admin.users.service';
import { FirebaseApp } from '@angular/fire/app';

declare const $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isNotificationEnabled = false;

  constructor(
    private NotificationsService: NotificationsService,
    private AdminUsersService: AdminUsersService,
    private FirebaseApp: FirebaseApp
  ) { }

  ngOnInit() {
    if (Notification.permission === 'granted') {
      console.log('enabled');

      this.isNotificationEnabled = true;
      let messaging = getMessaging(this.FirebaseApp);
      getToken(messaging, { vapidKey: environment.vapidKey }).then((currentToken) => {

        if (currentToken) {
          this.AdminUsersService.subscribeAdmin({ token: currentToken }).subscribe({
            next: (res: any) => { }, error: (err: any) => { }
          })
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
    } else {
      console.log('disabled');

    }

    if ($(".datatable").length > 0) {
      $(".datatable").DataTable({
        bFilter: false,
      });
    }
  }
}
