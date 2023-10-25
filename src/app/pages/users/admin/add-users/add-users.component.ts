import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
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
  isDuplicate: boolean = false;
  showPassword: boolean = false

  constructor(
    private AdminUsersService: AdminUsersService,
    private RolesService: RolesService,
    private FormBuilder: FormBuilder,
    private Router: Router,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      username: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      isActive: ['true', Validators.required],
    });

    this.RolesService.getActiveRoles().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.rolesData = res?.result
        this.ChangeDetectorRef.markForCheck()
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
            this.isDuplicate = false
          } else {
            this.isDuplicate = true
            this.ToastrService.error(res?.message)
          }
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }

  addAdmin() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    if (!this.isDuplicate) {
      this.AdminUsersService.addAdminUsers(this.form.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.ToastrService.success(res?.message);
            this.Router.navigate([this.appRoute.admin.ADMIN_USERS]);
          } else {
            this.ToastrService.error(res?.message);
          }
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    } else {
      this.ToastrService.error('This email cannot be used at this time');
    }
  }
}
