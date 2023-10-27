import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from './includes/services/notifications.service';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { AdminUsersService } from './includes/services/admin.users.service';
import { FirebaseApp } from '@angular/fire/app';
import { ToastrService } from 'ngx-toastr';

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
    private FirebaseApp: FirebaseApp,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    if (Notification.permission === 'granted') {
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
    }

    if ($(".datatable").length > 0) {
      $(".datatable").DataTable({
        bFilter: false,
      });
    }

    this.listen()
  }

  listen() {
    const messaging = getMessaging(this.FirebaseApp);
    onMessage(messaging, (payload: any) => {
      console.log('Message received. ', payload);
      this.toast.info(`<div class="d-flex align-items-center py-4"> <img src="${payload.notification.image}" width="60" class="mr-2"><div class="ps-2">${payload.notification.body}</div></div>`, payload.notification.title, {
        timeOut: 5000,
        enableHtml: true,
        progressAnimation: 'decreasing',
        progressBar: true,
      })
    });
  }
}
