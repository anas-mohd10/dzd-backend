import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { HomeSettingsService } from 'src/app/includes/services/home.settings.service';

@Component({
  selector: 'app-add-dashboard-settings',
  templateUrl: './add-dashboard-settings.component.html',
  styleUrls: ['./add-dashboard-settings.component.scss']
})
export class AddDashboardSettingsComponent implements OnInit {

  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  homeSettingsForm: FormGroup
  isSubmitted = false;
  data: any

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private HomeSettingsService: HomeSettingsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initform()
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
      this.HomeSettingsService.addHomeSettings(payload).subscribe((res: any) => {
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
