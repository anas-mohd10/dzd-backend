import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

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

  //Varibales
  primary: any
  secondary: any
  items_per_page: any
  text: string;

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
      text: ['', Validators.required],
      itemsPerPage: ['', Validators.required],
      fontFamily: ['', Validators.required]
    })
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
      fonts: { family: this.appsettingsform.get('fontFamily')?.value },
      itemsPerPage: this.appsettingsform.get('itemsPerPage')?.value
    }

    this.AppSettingsService.addGeneralSettings(data).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.appSettings.APP_SETTINGS_LIST])
      } else {
        this.toastr.error(res?.message);
      }
    })
  }
}
