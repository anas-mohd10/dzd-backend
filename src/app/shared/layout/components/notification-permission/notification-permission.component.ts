import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-notification-permission',
  templateUrl: './notification-permission.component.html',
  styleUrls: ['./notification-permission.component.scss']
})
export class NotificationPermissionComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

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
    Notification.requestPermission();
    this.nextStep = true
  }

  disposePrompt() {
    this.disablePrompt = true
    localStorage.setItem('notification_prompt', 'false')
    document.body?.classList.toggle('overflow-hidden')
  }
}
