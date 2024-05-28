import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { FaqService } from 'src/app/includes/services/faq.service';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes
  form: FormGroup
  isSubmitted = false;

  constructor(
    private HotToastService: HotToastService,
    private FaqService: FaqService,
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = new FormGroup({
      subject: new FormControl('GENERAL', Validators.required),
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
      isActive: new FormControl('true', Validators.required),
    });
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.FaqService.addFaq(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.faq.FAQ_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }
    })
  }

}
