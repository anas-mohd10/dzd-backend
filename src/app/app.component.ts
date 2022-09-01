import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

declare const $: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    if ($(".datatable").length > 0) {
      $(".datatable").DataTable({
        bFilter: false,
      });
    }
  }
}
