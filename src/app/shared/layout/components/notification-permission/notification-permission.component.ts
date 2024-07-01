import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
    @Inject(DOCUMENT) private document: Document,
    private ChangeDetectorRef: ChangeDetectorRef,
    private fbApp: FirebaseApp,
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
    try {
      this.nextStep = true
      let messaging = getMessaging(this.fbApp);
      getToken(messaging, { vapidKey: environment.vapidKey }).then((currentToken) => {
        this.disposePrompt()
        if (currentToken) {
          this.AdminUsersService.subscribeAdmin({ token: currentToken }).subscribe({
            next: (res: any) => { 
              this.disposePrompt()
            }, error: (err: any) => { 
              this.disposePrompt()
            }
          })
        }
      }).catch((err) => {
        this.disposePrompt()
        if (Notification.permission === 'denied') {
          this.isNotificationsBlocked = true
          this.ChangeDetectorRef.markForCheck()
        }
      });
    } catch (error) {
      this.nextStep = false
    }
  }

  disposePrompt() {
    this.disablePrompt = true
    this.nextStep = false
    localStorage.setItem('notification_prompt', 'false')
    document.body?.classList.toggle('overflow-hidden')
    this.ChangeDetectorRef.markForCheck()
  }
}