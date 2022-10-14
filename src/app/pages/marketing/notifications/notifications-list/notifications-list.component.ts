import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  notifications: any
  base: any
  notificationform: FormGroup;

  //Page and limit for query
  page: any = 1;
  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  limit: any = 8;
  selectedpage: any = 1
  max: any = 3

  //Total no. of data from backend
  totalcount: any;
  totaldata: any;
  sentdata: any;
  alldata: any
  pendingdata: any
  count: any = 0

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any

  constructor(
    private notificationsService: NotificationsService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })

    this.notificationsService.getNotificationsByPage(this.page, this.limit).subscribe((res: any) => {
      this.notifications = res?.result
      for (let notification of this.notifications) {
        notification.scheduledDate = new Date(notification.scheduledDate).toDateString()
      }
      this.count = this.notifications.length
      this.cdr.markForCheck();
    });

    this.notificationsService.getNotificationsCount().subscribe((res: any) => {
      this.totalcount = res?.result?.count
      this.alldata = res?.result?.count
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.cdr.markForCheck();
      this.setPages()
    })

    this.notificationsService.getSentNotificationsCount().subscribe((res: any) => {
      this.sentdata = res?.result?.count
      this.cdr.markForCheck();
    })

    this.notificationsService.getPendingNotificationsCount().subscribe((res: any) => {
      this.pendingdata = res?.result?.count
      this.cdr.markForCheck();
    })
  }

  initForm() {
    this.notificationform = this.formBuilder.group({
      channel: [''],
      type: [''],
      status: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  searchNotification() {
    this.currpage = 1
    this.notificationsService.searchNotifications(this.notificationform.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.notifications = res?.result?.data
        for (let notification of this.notifications) {
          notification.scheduledDate = new Date(notification.scheduledDate).toDateString()
        }
        this.count = this.notifications.length
        this.totalcount = res?.result?.total
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
      }
    })
  }

  fetchNotification(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.notificationform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.notificationform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.notificationform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.notificationform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.notificationform.value, this.currpage, this.limit)
      } else {
        this.getData(this.notificationform.value, this.currpage, this.limit)
      }
    }
  }

  setPages() {
    this.currpage = 1
    this.selectedpage = 1
    this.pages.length = 0
    if (this.totaldata > 3) {
      for (let i = 1; i <= this.max; i++) {
        this.pages.push(i)
      }
    } else {
      for (let i = 1; i <= this.totaldata; i++) {
        this.pages.push(i)
      }
    }
  }

  getData(data: any, page: any, limit: any) {
    this.notificationsService.searchNotifications(data, page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.notifications = res?.result?.data
        for (let notification of this.notifications) {
          notification.scheduledDate = new Date(notification.scheduledDate).toDateString()
        }
        this.count = this.notifications.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }

}
