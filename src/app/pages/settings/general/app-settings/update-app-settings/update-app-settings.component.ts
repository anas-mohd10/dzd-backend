import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-update-app-settings',
  templateUrl: './update-app-settings.component.html',
  styleUrls: ['./update-app-settings.component.scss']
})
export class UpdateAppSettingsComponent implements OnInit {

  appRoute = appRoutes
  slug: any
  task = PageTasks.UPDATE;
  editMode = true;
  generalSetting: any
  appsettingsform: FormGroup
  isSubmitted = false;
  primary: any
  secondary: any

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
    this.slug = this.ActivatedRoute.snapshot.queryParams.id || ''

    this.AppSettingsService.getGeneralSetting(this.slug).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.generalSetting = res?.result[0]
        this.primary = res?.result[0]?.primaryColor || AppSettings.PRIMARY_COLOR
        this.secondary = res?.result[0]?.secondaryColor || AppSettings.SECONDARY_COLOR
        this.appsettingsform.get('primaryColor')?.setValue(res?.result[0]?.primaryColor)
        this.appsettingsform.get('secondaryColor')?.setValue(res?.result[0]?.secondaryColor)
        this.appsettingsform.get('primaryColor')?.setValue(res?.result[0]?.primaryColor)
        this.appsettingsform.get('itemPerPage')?.setValue(res?.result[0]?.itemsPerPage)
        this.cdr.markForCheck()
      } else {

      }
    })
  }

  initform() {
    this.appsettingsform = this.formBuilder.group({
      primaryColor: ['', Validators.required],
      secondaryColor: ['', Validators.required],
      fontFamily: [''],
      itemPerPage: ['', Validators.required]
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

    this.AppSettingsService.updateGeneralSettings(this.slug, data).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.toastr.success('Settings configured');
        this.Router.navigate([this.appRoute.appSettings.APP_SETTINGS_LIST])
      } else {
        this.toastr.error('Something went wrong');
      }
    })
  }
}
