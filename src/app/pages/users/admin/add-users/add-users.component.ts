import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  adminForm: FormGroup;
  isSubmitted = false;
  rolesData: any;
  uniqueEmail: boolean = true;

  constructor(
    private adminService: AdminUsersService,
    private roleService: RolesService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.getRoles()
  }

  initForm() {
    this.adminForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      username: ['', Validators.required],
      roleId: ['', Validators.required],
      firstPwd: ['', Validators.required],
      password: ['', Validators.required],
      isActive: ['true', Validators.required],
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

  updateAdmin() { }

  addAdmin() {
    if (!this.adminForm.valid) {
      return;
    }
    let pwd = this.adminForm.get("firstPwd")?.value
    let conPwd = this.adminForm.get("password")?.value
    if (this.uniqueEmail == true) {
      if (pwd == conPwd) {
        this.adminService.addAdminUsers(this.adminForm.value).subscribe((res: any) => {
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
    } else {
      this.toastr.error('Email already exists');
    }
  }
}
