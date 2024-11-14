import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { PrivacyPolicyService } from 'src/app/includes/services/privacy-policy.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-privacy-policy',
  templateUrl: './add-privacy-policy.component.html',
  styleUrls: ['./add-privacy-policy.component.scss']
})
export class AddPrivacyPolicyComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
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
      { class: 'manrope', name: 'Sen' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
      { class: 'poppins', name: 'Poppins' }
    ]
  };

  constructor(
    private PrivacyPolicyService: PrivacyPolicyService,
    private FormBuilder: FormBuilder,
    private HotToastService: HotToastService,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.fetchPrivacyPolicy()
  }

  initForm() {
    this.form = this.FormBuilder.group({
      description: ['', Validators.required]
    });
  }

  get formControls() {
    return this.form.controls;
  }

  fetchPrivacyPolicy() {
    this.PrivacyPolicyService.getPrivacyPolicy().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.isData = res?.result.length > 0 ? true : false
        let data = res?.result[0]
        this.slug = data?.slug
        this.form.get("description")?.setValue(data?.description)
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
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    if (!this.isData) {
      this.PrivacyPolicyService.createPrivacyPolicy(this.form.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    } else {
      this.PrivacyPolicyService.updatePrivacyPolicy(this.slug, this.form.value).subscribe((res: any) => {
        this.afterResult(res?.errorCode, res?.message)
      })
    }
  }

  afterResult(errorcode: any, message: any) {
    if (errorcode != 0) {
      this.HotToastService.error(message);
    } else if (errorcode == 0) {
      this.HotToastService.success(message);
      this.isHidden = true
      this.ngOnInit()
    }
  }
}
