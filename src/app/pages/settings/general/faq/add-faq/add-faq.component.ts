import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  faqForm: FormGroup
  isSubmitted = false;

  constructor() { }

  ngOnInit(): void {
  }

}
