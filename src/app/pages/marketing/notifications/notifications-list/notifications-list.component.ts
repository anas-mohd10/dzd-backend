import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { NotificationsService } from 'src/app/includes/services/notifications.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  appRoute = appRoutes
  notifications: Array<any> = []
  base: string = `${environment.base}`
  form: FormGroup;
  page: number = 1
  limit: number = 20
  totalResults: number = 0
  totalPages: number = 1
  Math = Math // Make Math available in template

  constructor(
    private NotificationsService: NotificationsService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      status: new FormControl(''),
      notificationType: new FormControl('manual'), // Default to manual notifications
    });

    this.getNotifications()
  }

  clearFilters() {
    this.form.patchValue({ 
      status: '',
      notificationType: 'manual'
    })
    this.getNotifications()
  }

  onNotificationTypeChange() {
    this.page = 1 // Reset to first page when filter changes
    this.getNotifications()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getNotifications()
  }

  formatDateAndTime(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + new Date(date).toLocaleTimeString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true })
  }



  getNotifications() {
    const notificationType = this.form.get('notificationType')?.value;
    let isManual: boolean | undefined;
    
    // Set isManual based on notification type selection
    if (notificationType === 'manual') {
      isManual = true;
    } else if (notificationType === 'system') {
      isManual = false;
    }
    // If 'all' is selected, don't set isManual (undefined) to get all notifications
    
    const searchParams: any = {
      ...this.form.value,
      limit: this.limit,
      page: this.page
    };
    
    // Only add isManual if it's defined
    if (isManual !== undefined) {
      searchParams.isManual = isManual;
    }
    
    // Remove notificationType from search params as it's not needed by API
    delete searchParams.notificationType;
    
    this.NotificationsService.searchNotifications(searchParams).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.notifications = res?.result?.data
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }
}
