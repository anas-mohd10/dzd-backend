import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  couponsData: any;
  notificationsData: any
  displayTable: boolean;

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getNotifications()
  }

  getNotifications() {
    this.notificationsService.getNotifications().subscribe((res: any) => {
      this.notificationsData = res?.result
      for (let notification of this.notificationsData) {
        notification.scheduledDate = new Date(notification.scheduledDate).toDateString()
      }
      this.dtTrigger.next();
    })
  }

}
