import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { AdminUsersService } from './includes/services/admin.users.service';
import { FirebaseApp } from '@angular/fire/app';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from './includes/services/app.settings.service';

declare const $: any;

interface Notification {
  title: string;
  body: string;
  image?: string;
}

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isNotificationEnabled = false;
  isReady: boolean = false;
  isNotificationTriggered: boolean = false;
  notification: Notification = {
    title: '',
    body: '',
    image: ''
  };
  audio: HTMLAudioElement = new Audio();

  constructor(
    private AppSettingsService: AppSettingsService,
    private AdminUsersService: AdminUsersService,
    private FirebaseApp: FirebaseApp,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) {
    // Load the beep sound
    this.audio.src = 'assets/notification.wav';
    this.audio.load()
  }

  ngOnInit() {
    // Apply theme based on URL (localhost vs production)
    this.applyThemeBasedOnUrl();

    this.requestPermission();
    this.listen()

    this.AppSettingsService.getSettings().subscribe((res: any) => {
      if (res && res.errorCode == 0) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
          favicon.setAttribute('href', `${res?.result?.baseS3Url}${res?.result?.adminFavicon}`);
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  /**
   * Apply theme color based on URL
   * localhost -> #2A3234 (dark gray) primary, #B3907A (tan) secondary
   * production -> #00BDAB (teal) primary, #00BDAB (teal) secondary
   */
  private applyThemeBasedOnUrl(): void {
    const hostname = window.location.hostname;
    const isLocalhost = true
    // const isLocalhost = hostname.includes('clas-01') || hostname.includes('localhost') || hostname.includes('classy');
    const primaryColor = isLocalhost ? '#2A3234' : '#00BDAB';
    const secondaryColor = isLocalhost ? '#B3907A' : '#00BDAB';
    const backgroundColor = isLocalhost ? '#f4eee542' : '#F0F8F7';

    document.documentElement.style.setProperty('--brand-primary', "#2A3234");
    document.documentElement.style.setProperty('--brand-secondary', "#B3907A");
    document.documentElement.style.setProperty('--app-bg-color', "#f4eee542");
    console.log("colour settt")
  }

  // Request permission for notifications
  requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          let messaging = getMessaging(this.FirebaseApp);
          getToken(messaging, { vapidKey: environment.vapidKey }).then((currentToken) => {
            if (currentToken) {
              this.AdminUsersService.subscribeAdmin({ token: currentToken }).subscribe({
                next: (res: any) => {
                  if (!localStorage.getItem('notificationEnabled')) {
                    this.HotToastService.success('You have enabled notifications');
                  }
                  localStorage.setItem('notificationEnabled', 'true')
                }, error: (err: any) => { }
              })
            }
          }).catch((err: any) => { })
        } else {
          localStorage.setItem('notificationEnabled', 'false')
          this.HotToastService.success('You have blocked notifications');
        }
      });
    } else {
      console.error('This browser does not support notifications.');
    }
  }

  listen() {
    const messaging = getMessaging(this.FirebaseApp);
    onMessage(messaging, (payload: any) => {
      this.playBeepSound()
      this.isNotificationTriggered = true;
      this.notification = payload.notification;
      this.ChangeDetectorRef.markForCheck()

      // Automatically reset `isNotificationTriggered` after 10 seconds
      setTimeout(() => {
        this.isNotificationTriggered = false;
        this.ChangeDetectorRef.markForCheck();
      }, 10000); // 10 seconds in milliseconds
    });
  }

  playBeepSound() {
    // Play the beep sound when notification is received
    this.audio.play().catch((error) => {
      console.error('Failed to play beep sound:', error);
    });
  }
}
