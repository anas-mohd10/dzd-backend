import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Type here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'sen', name: 'Sen' },
    ]
  };
  faqId: string = '';
  faqDetails: any;

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

    this.faqId = this.ActivatedRoute.snapshot.queryParams.faq || ''
    this.FaqService.getFaq(this.faqId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.faqDetails = res?.result
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

    this.FaqService.updateFaq({ ...this.form.value, _id: this.faqId }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.faq.FAQ_LIST]);
        } else if (res.errorCode == 0) {
          this.HotToastService.error(res?.message);
        }
      }, error: (err) => {
        this.HotToastService.error(err?.error?.message);
      }
    })
  }

}
