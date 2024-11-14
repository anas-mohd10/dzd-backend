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
  form: FormGroup
  isSubmitted = false;
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
      { class: 'manrope', name: 'Sen' },
      { class: 'Sen', name: 'Sen' },
    ]
  };

  fontFamily: Array<any> = ['Sen', 'GeogrotesqueCyr', 'BellMT', 'BookAntiqua', 'Active', 'Hellix']
  logoFile: any
  logoFilePreview: any
  faviconFile: any
  faviconFilePreview: any
  primary: string = ''
  secondary: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initform()
    this.primary = AppSettings.PRIMARY_COLOR ? AppSettings.PRIMARY_COLOR : '#00BDAB'
    this.secondary = AppSettings.SECONDARY_COLOR ? AppSettings.SECONDARY_COLOR : '#333333'
    this.items_per_page = AppSettings.ITEMS_PER_PAGE ? AppSettings.ITEMS_PER_PAGE : 25
    this.text = AppSettings.TEXT || "#000000"
    this.form.get('primary')?.setValue(this.primary)
    this.form.get('secondary')?.setValue(this.secondary)
    this.form.get('star')?.setValue("#ffa514")
    this.form.get('label')?.setValue(this.primary)
    this.form.get('text')?.setValue(this.text)
    this.form.get('itemsPerPage')?.setValue(this.items_per_page)
  }

  get formControls() {
    return this.form.controls
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
      name: ['', Validators.required],
      domain: ['', Validators.required],
      description: ['', Validators.required],
      packingSlip: ['', Validators.required],
      isOutOfStock: ['false'],
      isNotifyStock: ['false'],
      cartButton: ['Add to Cart', Validators.required],
      stockButton: ['Out of Stock', Validators.required],
      notifyButton: ['Notify Me', Validators.required]
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
      isOutOfStock: this.form.get('isOutOfStock')?.value,
      isNotifyStock: this.form.get('isNotifyStock')?.value,
      name: this.form.get('name')?.value,
      domain: this.form.get('domain')?.value,
      description: this.form.get('description')?.value,
      notes: { packingSlip: this.form.get('packingSlip')?.value },
      buttons: {
        cart: this.form.get('cartButton')?.value,
        stock: this.form.get('stockButton')?.value,
        notify: this.form.get('notifyButton')?.value
      }
    }

    const formdata = new FormData();
    formdata.append('data', JSON.stringify(data))
    formdata.append('file', this.logoFile)
    formdata.append('favicon', this.faviconFile)

    this.AppSettingsService.addGeneralSettings(formdata).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.storeSettings.STORE_SETTINGS])
      } else {
        this.toastr.error(res?.message);
      }
    })
  }
}
