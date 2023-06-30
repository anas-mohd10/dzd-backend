import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { PermissionsService } from 'src/app/includes/services/permissions.service';
import { RolesService } from 'src/app/includes/services/roles.service';
@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {
  form: FormGroup;
  appRoute = appRoutes
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted = false;
  permissionsData: any;
  permissionsArray: any = []
  roleNames: any = [];

  checkedPermissions: Array<any> = []
  permissions: Array<any> = []

  constructor(
    private RolesService: RolesService,
    private PermissionsService: PermissionsService,
    private FormBuilder: FormBuilder,
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getPermissions()
  }

  initForm() {
    this.form = this.FormBuilder.group({
      name: ['', Validators.required],
      description: [''],
      isActive: ['true']
    });
  }

  get roleForm() {
    return this.form.controls;
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

  getPermissions() {
    this.PermissionsService.getPermissions().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.permissions = res?.result
      }
    })
  }

  selectAllPermissions() {
    for (let permission of this.permissions) this.checkedPermissions.push(permission?.refid)
  }

  deselectAllPermissions() {
    this.permissionsData = []
  }

  checkPermission(permission: any) {
    if (!this.checkedPermissions.includes(permission)) {
      this.checkedPermissions.push(permission)
    } else {
      this.checkedPermissions = this.checkedPermissions.filter(item => item != permission)
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateRole();
    } else {
      this.addRole();
    }
  }

  addRole() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    let payload = {
      ...this.form.value,
      permissions: this.checkedPermissions
    }

    if (this.checkedPermissions.length > 0) {
      this.RolesService.addRoles(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          this.Router.navigate([this.appRoute.roles.ROLES_LIST])
        }
      })
    } else {
      this.ToastrService.error('Select atleast one permission to continue')
    }
  }

  updateRole() { }
}
