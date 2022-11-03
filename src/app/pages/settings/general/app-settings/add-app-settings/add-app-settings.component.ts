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

    this.appsettingsform.get('primaryColor')?.setValue(this.primary)
    this.appsettingsform.get('secondaryColor')?.setValue(this.secondary)
    this.appsettingsform.get('itemsPerPage')?.setValue(this.items_per_page)
  }

  initform() {
    this.appsettingsform = this.formBuilder.group({
      primaryColor: ['', Validators.required],
      secondaryColor: ['', Validators.required],
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
      itemsPerPage: this.appsettingsform.get('itemsPerPage')?.value
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
