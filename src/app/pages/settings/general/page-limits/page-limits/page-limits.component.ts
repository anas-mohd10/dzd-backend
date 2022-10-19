import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-page-limits',
  templateUrl: './page-limits.component.html',
  styleUrls: ['./page-limits.component.scss']
})
export class PageLimitsComponent implements OnInit {
  appRoute = appRoutes
  constructor() { }

  ngOnInit(): void {
  }

}
