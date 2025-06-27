import { ChangeDetectorRef, Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

interface Notification {
  _id: string;
  orderNo: string;
  total: number;
  createdAt: string;
  orderStatus: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Array<Notification> = []
  todayOrders: number = 0
  appRoutes = appRoutes
  isDropdownOpen = false
  @Input("settings") settings: { currency: string };

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private NotificationsService: NotificationsService,
    private elementRef: ElementRef
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check if the clicked element is a link within our dropdown
    if (target.tagName === 'A' && target.closest('.dropdown-menu')) {
      // Close the dropdown immediately when a link is clicked
      this.isDropdownOpen = false;
      return;
    }
    
    // Close dropdown if clicking outside the component
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit(): void {
    this.NotificationsService.latestOrders().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.notifications = res?.result?.orders
          this.todayOrders = res?.result?.todayOrders
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  formatDateAndTime(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + new Date(date).toLocaleTimeString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true })
  }

  formatMessage(notification: Notification) {
    return `🥳 A new order ${notification?.orderNo} placed. Amount is ${this.settings?.currency} ${notification?.total}.`
  }

  onViewOrderClick(event: Event, orderId: string) {
    this.isDropdownOpen = false;
    // Don't prevent default or stop propagation - let the routerLink handle navigation
  }
}
