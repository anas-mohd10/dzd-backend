import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationsService } from './includes/services/notifications.service';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { AdminUsersService } from './includes/services/admin.users.service';
import { FirebaseApp } from '@angular/fire/app';
import { ToastrService } from 'ngx-toastr';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from './includes/services/app.settings.service';

declare const $: any;
@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isNotificationEnabled = false;
  isReady: boolean = false;

  constructor(
    private NotificationsService: NotificationsService,
    private AdminUsersService: AdminUsersService,
    private FirebaseApp: FirebaseApp,
    private toast: ToastrService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit() {    

    if (Notification.permission === 'granted') {
      this.isNotificationEnabled = true;
      let messaging = getMessaging(this.FirebaseApp);
      getToken(messaging, { vapidKey: environment.vapidKey }).then((currentToken) => {
        if (currentToken) {
          this.AdminUsersService.subscribeAdmin({ token: currentToken }).subscribe({
            next: (res: any) => {

            }, error: (err: any) => {

            }
          })
        }
      }).catch((err) => {
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
      this.HotToastService.info(`payload.notification.body`, payload.notification.title)
    });
  }
}
