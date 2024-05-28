import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { FaqService } from 'src/app/includes/services/faq.service';

@Component({
  selector: 'app-update-faq',
  templateUrl: './update-faq.component.html',
  styleUrls: ['./update-faq.component.scss']
})
export class UpdateFaqComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes
  form: FormGroup
  isSubmitted = false;
  faqId: string = '';

  constructor(
    private HotToastService: HotToastService,
    private FaqService: FaqService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      subject: new FormControl('GENERAL', Validators.required),
      question: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
      isActive: new FormControl('true', Validators.required),
    });
    this.faqId = this.ActivatedRoute.snapshot.queryParams.slug || ''
    this.FaqService.getFaq(this.faqId).subscribe({
      next: (res: any) => {
        if(res?.errorCode == 0){
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        }        
      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.FaqService.updateFaq({...this.form.value, slug: this.faqId}).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.HotToastService.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.HotToastService.success('FAQ updated successfully');
        this.Router.navigate([this.appRoute.faq.FAQ_LIST]);
      }
    })
  }

  addFaq() { }

}
