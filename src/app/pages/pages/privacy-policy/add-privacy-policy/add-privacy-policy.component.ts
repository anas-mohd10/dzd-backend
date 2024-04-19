import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { PrivacyPolicyService } from 'src/app/includes/services/privacy-policy.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-privacy-policy',
  templateUrl: './add-privacy-policy.component.html',
  styleUrls: ['./add-privacy-policy.component.scss']
})
export class AddPrivacyPolicyComponent implements OnInit, OnDestroy {
  appRoute = appRoutes
  aboutData: any;
  displayTable: boolean;
  privacypolicyForm: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted: boolean;
  isData: Boolean = false
  isHidden: Boolean = true
  slug: any;

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
    placeholder: 'Enter privacy policy here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ]
  };

  constructor(
    private privacypolicyService: PrivacyPolicyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getAbout()
  }

  initForm() {
    this.privacypolicyForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  get pf() {
    return this.privacypolicyForm.controls;
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

  getAbout() {
    this.privacypolicyService.getPrivacyPolicy().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.isData = res?.result.length > 0 ? true : false
        let data = res?.result[0]
        this.slug = data?.slug
        this.privacypolicyForm.get("description")?.setValue(data?.description)
      }
    })
  }

  reloadPage() {
    this.isSubmitted = false
    this.isHidden = true
    this.ngOnInit()
  }

  showButton() {
    this.isHidden = false
  }

  onSubmit() {
    if (!this.privacypolicyForm.valid) {
      this.isSubmitted = true
      return;
    }

    if (!this.isData) {
      this.privacypolicyService.createPrivacyPolicy(this.privacypolicyForm.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    } else {
      this.privacypolicyService.updatePrivacyPolicy(this.slug, this.privacypolicyForm.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    }
  }

  afterResult(errorcode: any, message: any) {
    if (errorcode != 0) {
      this.toastr.error(message);
    } else if (errorcode == 0) {
      this.toastr.success(message);
      this.isHidden = true
      this.ngOnInit()
    }
  }

  ngOnDestroy(): void {
  }
}
