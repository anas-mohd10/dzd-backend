import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  base: string = environment.base
  form: FormGroup;
  page: number = 1
  limit: FormControl = new FormControl(20)
  lastPage: boolean = false
  data: any = {}

  constructor(
    private NotificationsService: NotificationsService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initform()
    this.getNotifications()
  }

  initform() {
    this.form = new FormGroup({
      keyword: new FormControl(''),
      isActive: new FormControl(''),
      channel: new FormControl(''),
      type: new FormControl(''),
      status: new FormControl(''),
    });
  }

  clearFilters() {
    this.initform()
    this.getNotifications()
  }

  getNextPage() {
    this.page += 1
    this.getNotifications()
  }

  getPreviousPage() {
    this.page -= 1
    this.getNotifications()
  }

  getNotifications() {
    let payload = {
      ...this.form.value,
      limit: this.limit.value,
      page: this.page
    }

    this.NotificationsService.searchNotifications(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.notifications = res?.result?.data

        for (let notification of this.notifications) {
          notification.channel = notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)
          notification.type = notification.type.charAt(0).toUpperCase() + notification.type.slice(1)
          notification.date = new Date(notification.date).toDateString()
        }

        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
