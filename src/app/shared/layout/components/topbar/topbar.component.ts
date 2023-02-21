import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
import { LayoutService } from '../../core/layout.service';

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

  appRoutes = appRoutes
  isShowClicked: Boolean = false
  pages: any = [1, 2, 3]
  currentPage: any = this.pages[0]
  notifications: any = []

  constructor(private layout: LayoutService, private NotificationsService: NotificationsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isShowClicked = false
    this.headerLeft = this.layout.getProp('header.left') as string;

    this.NotificationsService.latestNotifications({ page: this.currentPage }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.notifications = res?.result
        if (this.notifications.length <= 5) this.pages = [1]
        if (this.notifications.length <= 10 && this.notifications.length > 5) this.pages = [1, 2]
        if (this.notifications.length <= 15 && this.notifications.length > 10) this.pages = [1, 2, 3]
        this.cdr.markForCheck()
      }
    })
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
        this.cdr.markForCheck()
      }
    })
  }
}
