import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { RolesService } from 'src/app/includes/services/roles.service';


@Component({
  selector: 'app-update-users',
  templateUrl: './update-users.component.html',
  styleUrls: ['./update-users.component.scss']
})
export class UpdateUsersComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  adminForm: FormGroup;
  isSubmitted = false;
  rolesData: any;
  admin: any;
  uniqueEmail: boolean = false;

  constructor(
    private adminService: AdminUsersService,
    private roleService: RolesService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      username: ['', Validators.required],
      role: ['', Validators.required],
      firstPwd: [''],
      password: [''],
      isActive: ['true', Validators.required],
      isDelete: ['false', Validators.required],
    });

    this.managePage()
    this.admin = this.route.snapshot.queryParams.admin || ''

    this.roleService.getActiveRoles().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ChangeDetectorRef.markForCheck()
        this.rolesData = res?.result
      }
    })

    this.adminService.getAdminUser(this.admin).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        for (let _key of Object.keys(res?.result)) this.adminForm.get(_key)?.setValue(res?.result[_key])
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  get af() {
    return this.adminForm.controls;
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  checkEmail(e: any) {
    const data = { email: '' }
    if (e.value) {
      data.email = e.value
    }
    this.adminService.getAdminUserByMail(data).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueEmail = false
        this.toastr.error("Email already exists")
      } else {
        this.uniqueEmail = true
      }
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateAdmin();
    } else {
      this.addAdmin();
    }
  }

  updateAdmin() {
    if (!this.adminForm.valid) {
      this.toastr.error('Something went wrong');
      return;
    }

    let pwd = this.adminForm.get("firstPwd")?.value
    let conPwd = this.adminForm.get("password")?.value

    if (pwd == conPwd) {
      this.adminService.updateAdminUser(this.adminForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success('Admin user added successfully');
          this.router.navigate([this.appRoute.admin.ADMIN_USERS]);
        }
      })
    } else {
      this.toastr.error("Password doesn't match")
    }
  }

  addAdmin() {
  }

}
