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

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initform()
    this.primary = AppSettings.PRIMARY_COLOR
    this.secondary = AppSettings.SECONDARY_COLOR

    this.appsettingsform.get('primaryColor')?.setValue(AppSettings.PRIMARY_COLOR)
    this.appsettingsform.get('secondaryColor')?.setValue(AppSettings.SECONDARY_COLOR)
    this.appsettingsform.get('itemPerPage')?.setValue(AppSettings.ITEMS_PER_PAGE)
  }

  initform() {
    this.appsettingsform = this.formBuilder.group({
      primaryColor: ['', Validators.required],
      secondaryColor: ['', Validators.required],
      fontFamily: [''],
      itemsPerPage: ['', Validators.required]
    })
  }

  onSubmit() {
    if (!this.appsettingsform.valid) {
      return
    }

    const data = {
      primaryColor: this.appsettingsform.get('primaryColor')?.value,
      secondaryColor: this.appsettingsform.get('secondaryColor')?.value,
      fontFamily: this.appsettingsform.get('fontFamily')?.value,
      itemsPerPage: this.appsettingsform.get('itemPerPage')?.value
    }

    this.AppSettingsService.addGeneralSettings(data).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.toastr.success('Settings configured');
        this.router.navigate([this.appRoute.appSettings.APP_SETTINGS_LIST])
      } else {
        this.toastr.error('Something went wrong');
      }
    })
  }
}
