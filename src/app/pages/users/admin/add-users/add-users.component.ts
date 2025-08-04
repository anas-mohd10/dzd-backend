import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { AuthService } from 'src/app/includes/services/auth.service';
import { RolesService } from 'src/app/includes/services/roles.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  form: FormGroup;
  isSubmitted = false;
  rolesData: any;
  isAdminExists: boolean = false;
  showPassword: boolean = false
  isDeveloperAccess: boolean = false

  constructor(
    private AdminUsersService: AdminUsersService,
    private RolesService: RolesService,
    private FormBuilder: FormBuilder,
    private Router: Router,
    private AuthService: AuthService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.pattern("^[0-9]{9}$")]],
      role: [''],
      password: ['', Validators.required],
      isDeveloperAccess: ['false'],
      isActive: ['true',],
    });

    this.AuthService.me().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.isDeveloperAccess = res?.result?.isDeveloperAccess
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })

    this.RolesService.getActiveRoles().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.rolesData = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {

      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  verifyEmailAddress() {
    if (this.form.get('email')?.value) {
      this.AdminUsersService.getDuplicateEmail({ email: this.form.get('email')?.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.isAdminExists = false
          } else {
            this.isAdminExists = true
            this.HotToastService.error(res?.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.message)
        }
      })
    }
  }

  updateMobilePattern(newPattern: string) {
    const validators = this.form.get('mobile')?.validator;
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get("countryCode")?.value) {
      case "+91":
        this.updateMobilePattern(`^[0-9]{10}$`);
        break;
      case "+971":
        this.updateMobilePattern(`^[0-9]{9}$`);
        break;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    if (this.isAdminExists) {
      this.HotToastService.error('This email cannot be used at this time');
    } else {
      this.AdminUsersService.addAdminUsers(this.form.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.admin.ADMIN_USERS]);
          } else {
            this.HotToastService.error(res?.message);
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.message)
        }
      })
    }
  }
}
