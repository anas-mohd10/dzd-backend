import { Component, OnInit } from '@angular/core';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-add-coupons',
  templateUrl: './add-coupons.component.html',
  styleUrls: ['./add-coupons.component.scss']
})
export class AddCouponsComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  
  appRoute = appRoutes
  constructor() { }

  ngOnInit(): void {
  }

}
