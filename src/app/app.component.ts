import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NotificationsService } from './includes/services/notifications.service';

declare const $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  constructor(private NotificationsService: NotificationsService) {

    this.NotificationsService.latestNotifications({ page: 1 }).subscribe((res: any) => {
      console.log(res?.result);
    })
  }

  ngOnInit() {
    if ($(".datatable").length > 0) {
      $(".datatable").DataTable({
        bFilter: false,
      });
    }

    console.log('jhekjb');
    
  }
}
