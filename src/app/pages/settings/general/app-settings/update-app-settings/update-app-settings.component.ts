import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-update-app-settings',
  templateUrl: './update-app-settings.component.html',
  styleUrls: ['./update-app-settings.component.scss']
})
export class UpdateAppSettingsComponent implements OnInit {
  appRoute = appRoutes
  task = PageTasks.UPDATE;
  editMode = true;
  data: any
  form: FormGroup
  isSubmitted = false;
  refid: any;
  currency: any
  currencies: Array<any> = ['INR', 'USD', 'EUR', 'AED']
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
      { class: 'manrope', name: 'Manrope' },
      { class: 'Manrope', name: 'Manrope' },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private AppSettingsService: AppSettingsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initform()
    this.refid = this.ActivatedRoute.snapshot.queryParams.id || ''

    this.AppSettingsService.getGeneralSettingsbyId(this.refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.form.get('primary')?.setValue("#" + res?.result?.colors?.primary.split('FF')[1])
        this.form.get('secondary')?.setValue("#" + res?.result?.colors?.secondary.split('FF')[1])
        this.form.get('star')?.setValue("#" + res?.result?.colors?.star.split('FF')[1])
        this.form.get('label')?.setValue("#" + res?.result?.colors?.label.split('FF')[1])
        this.form.get('text')?.setValue("#" + res?.result?.colors?.text.split('FF')[1])
        this.form.get('toastSuccess')?.setValue("#" + res?.result?.toast?.success.split('FF')[1])
        this.form.get('toastError')?.setValue("#" + res?.result?.toast?.error.split('FF')[1])
        this.form.get('toastInfo')?.setValue("#" + res?.result?.toast?.info.split('FF')[1])
        this.form.get('fontFamily')?.setValue(res?.result?.fonts?.family)
        this.form.get('currency')?.setValue(res?.result?.currency)
        this.form.get('domain')?.setValue(res?.result?.domain)
        this.form.get('itemsPerPage')?.setValue(res?.result?.itemsPerPage)
        this.form.get('packingSlip')?.setValue(res?.result?.notes?.packingSlip)
        this.cdr.markForCheck()
      }
    })
  }

  initform() {
    this.form = this.formBuilder.group({
      primary: ['', Validators.required],
      secondary: ['', Validators.required],
      star: ['', Validators.required],
      label: ['', Validators.required],
      toastError: ['', Validators.required],
      currency: ['', Validators.required],
      toastSuccess: ['', Validators.required],
      toastInfo: ['', Validators.required],
      text: ['', Validators.required],
      itemsPerPage: ['', Validators.required],
      fontFamily: ['', Validators.required],
      domain: ['', Validators.required],
      packingSlip: ['', Validators.required],
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.toastr.error('Validation error occured');
      return
    }

    const data = {
      colors: {
        primary: this.form.get('primary')?.value,
        secondary: this.form.get('secondary')?.value,
        star: this.form.get('star')?.value,
        label: this.form.get('label')?.value,
        text: this.form.get('text')?.value,
      },
      toast: {
        success: this.form.get('toastSuccess')?.value,
        error: this.form.get('toastError')?.value,
        info: this.form.get('toastInfo')?.value
      },
      currency: this.form.get('currency')?.value,
      fonts: { family: this.form.get('fontFamily')?.value },
      itemsPerPage: this.form.get('itemsPerPage')?.value,
      refid: this.refid,
      domain: this.form.get('domain')?.value,
      notes: {
        packingSlip: this.form.get('packingSlip')?.value,
      }
    }

    this.AppSettingsService.updateGeneralSettings(data).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.toastr.success(res?.message);
        this.Router.navigate([this.appRoute.appSettings.APP_SETTINGS_LIST])
      } else {
        this.toastr.error(res?.message);
      }
    })
  }
}
