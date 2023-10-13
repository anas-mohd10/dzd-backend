import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getMessaging, getToken } from '@angular/fire/messaging'
import { FirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss']
})
export class NotificationPermissionComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ChangeDetectorRef: ChangeDetectorRef,
    private fbApp: FirebaseApp
  ) { }

  isNotificationEnabled = false;
  nextStep = false;
  disablePrompt: boolean = false;
  isNotificationsBlocked: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('notification_prompt') === 'false') {
      this.disablePrompt = true
    } else {
      this.allowPrompt()
      this.isNotificationEnabled = true
    }

    !this.disablePrompt ? document.body?.classList.add('overflow-hidden') : document.body?.classList.remove('overflow-hidden')
  }

  allowPrompt() {
    let messaging = getMessaging(this.fbApp);
    getToken(messaging, { vapidKey: environment.vapidKey }).then((currentToken) => {
      console.log(currentToken)
      this.disposePrompt()
      if (currentToken) {
      } else {
      }
    }).catch((err) => {
      this.disposePrompt()
      // alert('Sorry, an error occurred while retrieving token.')
      console.log('An error occurred while retrieving token. ', err);
      if (Notification.permission === 'denied') {
        this.isNotificationsBlocked = true
        this.ChangeDetectorRef.markForCheck()
      }
    });

    // Notification.requestPermission().then((res) => {
    //   if (res === 'granted') {
    //     this.isNotificationEnabled = true

    //     // 


    //     this.ChangeDetectorRef.markForCheck()
    //   }
    // })
    this.nextStep = true
  }

  disposePrompt() {
    this.disablePrompt = true
    localStorage.setItem('notification_prompt', 'false')
    document.body?.classList.toggle('overflow-hidden')
    this.ChangeDetectorRef.markForCheck()
  }
}