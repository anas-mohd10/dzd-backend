import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Add this import
import { appRoutes } from 'src/app/config/routes';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
import { LayoutService } from '../../core/layout.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  settings: any = {}

  @ViewChild('container') container: any;
  @ViewChild('dropdown') dropdown: any;

  appRoutes = appRoutes
  isShowClicked: Boolean = false
  pages: any = [1, 2, 3]
  currentPage: any = this.pages[0]
  notifications: any = []

  constructor(
    private layout: LayoutService,
    private NotificationsService: NotificationsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private router: Router // Add Router to constructor
  ) {
    document.addEventListener('click', this.offClickHandler.bind(this));
  }

  offClickHandler($event: any) {
    if (!this.container.nativeElement.contains($event.target)) {
      this.isShowClicked = false
      document.querySelector('.notificationContainer')?.classList.remove('showContainer')
    }
  }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId("1").subscribe((res: any) => {
      environment.base = res.result.baseS3Url;
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
    this.headerLeft = this.layout.getProp('header.left') as string;

    this.NotificationsService.latestNotifications({ page: this.currentPage }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.notifications = res?.result
        if (this.notifications.length <= 5) this.pages = [1]
        if (this.notifications.length <= 10 && this.notifications.length > 5) this.pages = [1, 2]
        if (this.notifications.length <= 15 && this.notifications.length > 10) this.pages = [1, 2, 3]
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  navigateToAccount(): void {
    this.router.navigate(['/app/my-account']);
  }

  toggleNotifications() {
    this.isShowClicked = !this.isShowClicked
  }

  fetchNotifications(page: any) {
    this.currentPage = page
    this.NotificationsService.latestNotifications({ page: this.currentPage }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.notifications = res?.result
        if (this.notifications.length >= 5) this.pages = [1]
        if (this.notifications.length >= 10) this.pages = [1, 2]
        if (this.notifications.length >= 15) this.pages = [1, 2, 3]
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}