import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getMessaging, getToken } from '@angular/fire/messaging'
import { FirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss']
})
export class NotificationPermissionComponent implements OnInit {

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private FirebaseApp: FirebaseApp,
    private AdminUsersService: AdminUsersService
  ) { }

  isNotificationEnabled = false;
  nextStep = false;
  disablePrompt: boolean = false;
  isNotificationsBlocked: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('notification_prompt') === 'false') {
      this.disablePrompt = true
    } else {
      this.isNotificationEnabled = true
    }

    !this.disablePrompt ? document.body?.classList.add('overflow-hidden') : document.body?.classList.remove('overflow-hidden')
  }

  allowPrompt() {
    this.nextStep = true
    // if (Notification.permission == 'granted') {
    //   let messaging = getMessaging(this.FirebaseApp);
    //   getToken(messaging, { vapidKey: environment.vapidKey }).then((currentToken) => {
    //     this.disposePrompt()
    //     if (currentToken) {
    //       this.AdminUsersService.subscribeAdmin({ token: currentToken }).subscribe({
    //         next: (res: any) => {
    //           this.disposePrompt()
    //         }, error: (err: any) => {
    //           this.disposePrompt()
    //         }
    //       })
    //     }
    //   }).catch((err) => {
    //     this.disablePrompt = true
    //     this.nextStep = false
    //     localStorage.setItem('notification_prompt', 'false')
    //     document.body?.classList.toggle('overflow-hidden')
    //     this.ChangeDetectorRef.markForCheck()
    //   });
    // } else if (Notification.permission === 'denied') {
    //   this.disablePrompt = true
    //   this.nextStep = false
    //   // localStorage.setItem('notification_prompt', 'false')
    //   document.body?.classList.toggle('overflow-hidden')
    //   this.ChangeDetectorRef.markForCheck()
    // }
  }

  disposePrompt() {
    this.disablePrompt = true
    this.nextStep = false
    // localStorage.setItem('notification_prompt', 'false')
    document.body?.classList.toggle('overflow-hidden')
    this.ChangeDetectorRef.markForCheck()
  }
}