import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-design-sidebar',
  templateUrl: './design-sidebar.component.html',
  styleUrls: ['./design-sidebar.component.scss']
})
export class DesignSidebarComponent implements OnInit {
  appRoute = appRoutes
  
  constructor() { }

  ngOnInit(): void {
  }

  navigateBack(){
    window.history.back();
  }

}
