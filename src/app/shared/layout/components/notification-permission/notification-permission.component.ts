import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getMessaging, getToken } from '@angular/fire/messaging'
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss']
})
export class NotificationPermissionComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  isNotificationEnabled = false;
  nextStep = false
  disablePrompt: boolean = false

  ngOnInit(): void {
    if (localStorage.getItem('notification_prompt') === 'false') {
      this.disablePrompt = true
    } else {
      this.isNotificationEnabled = true
    }

    !this.disablePrompt ? document.body?.classList.add('overflow-hidden') : document.body?.classList.remove('overflow-hidden')
  }

  allowPrompt() {
    Notification.requestPermission().then((res) => {
      if (res === 'granted') {
        this.isNotificationEnabled = true
        
        // this.disposePrompt()
        // let app = initializeApp(environment.firebaseConfig)
        // let messaging = getMessaging(app);
        // getToken(messaging, { vapidKey: 'BGBVeTQBGpLoGMFZAXq4E6t5v_PBAgkv50sZBB6gYd9GbNu_9nfmQQq7V65T6Yy0Bh9LlH9JRZ3wmiK1nlHPgvc' }).then((currentToken) => {
        //   console.log(currentToken)
        //   if (currentToken) {
        //   } else {
        //   }
        // }).catch((err) => {
        //   console.log('An error occurred while retrieving token. ', err);
        // });

        this.ChangeDetectorRef.markForCheck()
      }
    })
    this.nextStep = true
  }

  disposePrompt() {
    this.disablePrompt = true
    localStorage.setItem('notification_prompt', 'false')
    document.body?.classList.toggle('overflow-hidden')
  }
}