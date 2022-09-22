import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { FaqService } from 'src/app/includes/services/faq.service';

@Component({
  selector: 'app-update-faq',
  templateUrl: './update-faq.component.html',
  styleUrls: ['./update-faq.component.scss']
})
export class UpdateFaqComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  faqForm: FormGroup
  isSubmitted = false;
  slug: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private faqService: FaqService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.slug || ''
    this.getFaqBySlug()
  }

  getFaqBySlug() {
    this.faqService.getFaq(this.slug).subscribe((res: any) => {
      this.faqForm.get("subject")?.setValue(res?.result[0]?.subject)
      this.faqForm.get("question")?.setValue(res?.result[0]?.question)
      this.faqForm.get("answer")?.setValue(res?.result[0]?.answer)
      this.faqForm.get("isActive")?.setValue(res?.result[0]?.isActive)
    })
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

  updateFaq() {
    if (!this.faqForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }

    this.faqService.updateFaq(this.slug, this.faqForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('FAQ updated successfully');
        this.router.navigate([this.appRoute.faq.FAQ_LIST]);
      }
    })
  }

  addFaq() { }

}
