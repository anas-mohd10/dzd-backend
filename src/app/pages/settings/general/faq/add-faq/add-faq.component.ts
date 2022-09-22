import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { FaqService } from 'src/app/includes/services/faq.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private faqService: FaqService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
  }

  initForm() {
    this.faqForm = this.formBuilder.group({
      subject: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get ff() {
    return this.faqForm.controls;
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateFaq();
    } else {
      this.addFaq();
    }
  }

  updateFaq() { }

  addFaq() {
    if (!this.faqForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }

    this.faqService.addFAQ(this.faqForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('FAQ added successfully');
        this.router.navigate([this.appRoute.faq.FAQ_LIST]);
      }
    })
  }

}
