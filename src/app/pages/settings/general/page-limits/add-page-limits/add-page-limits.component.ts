import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-add-page-limits',
  templateUrl: './add-page-limits.component.html',
  styleUrls: ['./add-page-limits.component.scss']
})
export class AddPageLimitsComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  pagelimitform: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
