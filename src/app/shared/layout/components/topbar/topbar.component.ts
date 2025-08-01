import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
import { LayoutService } from '../../core/layout.service';
import { AuthService } from 'src/app/includes/services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
  modalRef?: BsModalRef;

  @ViewChild('container') container: any;
  @ViewChild('dropdown') dropdown: any;

  appRoutes = appRoutes
  isShowClicked: Boolean = false
  pages: any = [1, 2, 3]
  userData: any = this.AuthService.getCurrentUser()
  currentPage: any = this.pages[0]
  notifications: Array<Notification> = []
  @Input('settings') settings: any

  constructor(
    private layout: LayoutService,
    private NotificationsService: NotificationsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private AuthService: AuthService,
    private router: Router // Add Router to constructor
  ) {
    document.addEventListener('click', this.offClickHandler.bind(this));
  }

  offClickHandler($event: any) {
    if (this.container && !this.container.nativeElement.contains($event.target)) {
      this.isShowClicked = false
      document.querySelector('.notificationContainer')?.classList.remove('showContainer')
    }
  }

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;

    this.NotificationsService.latestOrders().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.notifications = res?.result
          this.ChangeDetectorRef.markForCheck()
        }else {}
      }, error: (err: any) => { }
    })
  }

  // Update the logout click handler to show modal
  logout(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered'
    });
  }

  // Confirm logout
  confirmLogout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('UserData');
    localStorage.removeItem('is_logged_in');
    this.modalRef?.hide();
    this.router.navigate(['/auth/login']);
  }

  // Decline logout
  declineLogout() {
    this.modalRef?.hide();
  }

  navigateToAccount(): void {
    this.router.navigate(['/app/my-account']);
  }
}