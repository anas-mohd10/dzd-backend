import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-add-app-settings',
  templateUrl: './add-app-settings.component.html',
  styleUrls: ['./add-app-settings.component.scss']
})
export class AddAppSettingsComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  appsettingsform: FormGroup
  isSubmitted = false;
  primary: any
  secondary: any
  items_per_page: any
  text: string;
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

  logoFile: any
  logoFilePreview: any
  faviconFile: any
  faviconFilePreview: any

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initform()
    this.primary = AppSettings.PRIMARY_COLOR ? AppSettings.PRIMARY_COLOR : '#00bdab'
    this.secondary = AppSettings.SECONDARY_COLOR ? AppSettings.SECONDARY_COLOR : '#333333'
    this.items_per_page = AppSettings.ITEMS_PER_PAGE ? AppSettings.ITEMS_PER_PAGE : 25
    this.text = AppSettings.TEXT || "#000000"
    this.appsettingsform.get('primary')?.setValue(this.primary)
    this.appsettingsform.get('secondary')?.setValue(this.secondary)
    this.appsettingsform.get('star')?.setValue("#ffa514")
    this.appsettingsform.get('label')?.setValue(this.primary)
    this.appsettingsform.get('text')?.setValue(this.text)
    this.appsettingsform.get('itemsPerPage')?.setValue(this.items_per_page)
  }

  initform() {
    this.appsettingsform = this.formBuilder.group({
      primary: ['', Validators.required],
      secondary: ['', Validators.required],
      star: ['', Validators.required],
      label: ['', Validators.required],
      toastError: ['', Validators.required],
      toastSuccess: ['', Validators.required],
      toastInfo: ['', Validators.required],
      text: ['', Validators.required],
      currency: ['', Validators.required],
      itemsPerPage: ['', Validators.required],
      fontFamily: ['', Validators.required],
      domain: ['', Validators.required],
      packingSlip: ['', Validators.required],
    })
  }

  onInputChange(type: any, event: any) {
    switch (type) {
      case 'logo':
        this.logoFile = event.target.files[0]
        const reader = new FileReader();
        reader.onload = (e: any) => { this.logoFilePreview = e.target.result };
        reader.readAsDataURL(this.logoFile);
        break
      case 'favicon':
        this.faviconFile = event.target.files[0]
        const favReader = new FileReader();
        favReader.onload = (e: any) => { this.faviconFilePreview = e.target.result };
        favReader.readAsDataURL(event.target.files[0]);
        const image = new Image();
        image.src = URL.createObjectURL(event.target.files[0]);
        image.onload = () => {
          let height = image.width;
          let width = image.height;
          if (height != width && height != 16 && width != 16) {
            this.toastr.error('The specified file' + event.target.files[0].name + ' could not be uploaded');
            this.faviconFile = null
            this.faviconFilePreview = null
          }
        };
        break
    }
  }

  removeLogo(type: any) {
    switch (type) {
      case 'logo':
        this.logoFile = null
        this.logoFilePreview = null
        break
      case 'favicon':
        this.faviconFile = null
        this.faviconFilePreview = null
        break
    }
  }

  onSubmit() {
    if (!this.appsettingsform.valid) {
      this.toastr.error('Validation error occured');
      return
    }

    const data = {
      colors: {
        primary: this.appsettingsform.get('primary')?.value,
        secondary: this.appsettingsform.get('secondary')?.value,
        star: this.appsettingsform.get('star')?.value,
        label: this.appsettingsform.get('label')?.value,
        text: this.appsettingsform.get('text')?.value,
      },
      toast: {
        success: this.appsettingsform.get('toastSuccess')?.value,
        error: this.appsettingsform.get('toastError')?.value,
        info: this.appsettingsform.get('toastInfo')?.value
      },
      currency: this.appsettingsform.get('currency')?.value,
      fonts: {
        family: this.appsettingsform.get('fontFamily')?.value
      },
      itemsPerPage: this.appsettingsform.get('itemsPerPage')?.value,
      domain: this.appsettingsform.get('domain')?.value,
      notes: {
        packingSlip: this.appsettingsform.get('packingSlip')?.value,
      }
    }

    const formdata = new FormData();
    formdata.append('data', JSON.stringify(data))
    formdata.append('file', this.logoFile)
    formdata.append('favicon', this.faviconFile)

    this.AppSettingsService.addGeneralSettings(formdata).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.appSettings.APP_SETTINGS_LIST])
      } else {
        this.toastr.error(res?.message);
      }
    })
  }
}
