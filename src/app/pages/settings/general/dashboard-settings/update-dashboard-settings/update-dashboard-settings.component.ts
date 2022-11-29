import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { HomeSettingsService } from 'src/app/includes/services/home.settings.service';

@Component({
  selector: 'app-update-dashboard-settings',
  templateUrl: './update-dashboard-settings.component.html',
  styleUrls: ['./update-dashboard-settings.component.scss']
})
export class UpdateDashboardSettingsComponent implements OnInit {

  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  homeSettingsForm: FormGroup
  isSubmitted = false;
  data: any
  slug: any;
  homeDatas: any;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private HomeSettingsService: HomeSettingsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.slug = this.ActivatedRoute.snapshot.queryParams.id || ''
    this.initform()

    this.HomeSettingsService.getHomeSetting(this.slug).subscribe((res: any) => {
      this.homeDatas = res?.result[0]
      this.homeSettingsForm.get('carausel')?.setValue(this.homeDatas?.positions?.carausel?.value)
      this.homeSettingsForm.get('category')?.setValue(this.homeDatas?.positions?.category?.value)
      this.homeSettingsForm.get('collection')?.setValue(this.homeDatas?.positions?.collection?.value)
      this.homeSettingsForm.get('banners')?.setValue(this.homeDatas?.positions?.banners?.value)
      this.homeSettingsForm.get('brands')?.setValue(this.homeDatas?.positions?.brands?.value)
      this.homeSettingsForm.get('products')?.setValue(this.homeDatas?.positions?.products?.value)
    })
  }

  initform() {
    this.homeSettingsForm = this.formBuilder.group({
      carausel: [1, Validators.required],
      category: [2, Validators.required],
      collection: [3, Validators.required],
      banners: [4, Validators.required],
      brands: [5, Validators.required],
      products: [6, Validators.required],
    })
  }

  onSubmit() {
    if (!this.homeSettingsForm.valid) {
      this.toastr.error('Something went wrong')
      return
    }

    const payload = this.createPayload()
    if (payload) {
      this.HomeSettingsService.updateHomeSettings(this.slug, payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success('Settings configured');
          this.router.navigate([this.appRoute.dashboardSettings.DASHBOARD_SETTINGS_LIST])
        } else {
          this.toastr.error('Something went wrong');
        }
      })
    }
  }

  createPayload() {
    const data = {
      carausel: this.homeSettingsForm.get('carausel')?.value,
      category: this.homeSettingsForm.get('category')?.value,
      collection: this.homeSettingsForm.get('collection')?.value,
      banners: this.homeSettingsForm.get('banners')?.value,
      brands: this.homeSettingsForm.get('brands')?.value,
      products: this.homeSettingsForm.get('products')?.value,
    }
    return data
  }

}
