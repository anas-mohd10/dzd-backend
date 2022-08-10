import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private adminService: AdminUsersService,
    private roleService: RolesService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.admin = this.route.snapshot.queryParams.admin || ''
    this.getRoles()
    this.getAdmin()
  }

  initForm() {
    this.adminForm = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      mobile: [''],
      username: [''],
      roleId: [''],
      firstPwd: [''],
      password: [''],
      isActive: [''],
    });
  }

  get af() {
    return this.adminForm.controls;
  }

  getRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      this.rolesData = res?.result
    })
  }

  getAdmin() {
    this.adminService.getAdminUser(this.admin).subscribe((res: any) => {
      this.adminForm.get("username")?.setValue(res?.result[0]?.username)
      this.adminForm.get("firstname")?.setValue(res?.result[0]?.firstname)
      this.adminForm.get("lastname")?.setValue(res?.result[0]?.lastname)
      this.adminForm.get("email")?.setValue(res?.result[0]?.email)
      this.adminForm.get("mobile")?.setValue(res?.result[0]?.mobile)
      this.adminForm.get("roleId")?.setValue(res?.result[0]?.roleId)
      this.adminForm.get("isActive")?.setValue(res?.result[0]?.isActive)
    })
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
      this.adminService.updateAdminUser(this.admin, this.adminForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
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
