import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { PermissionsService } from 'src/app/includes/services/permissions.service';
import { RolesService } from 'src/app/includes/services/roles.service';

@Component({
  selector: 'app-update-roles',
  templateUrl: './update-roles.component.html',
  styleUrls: ['./update-roles.component.scss']
})
export class UpdateRolesComponent implements OnInit {
  form: FormGroup;
  appRoute = appRoutes
  task = PageTasks.UPDATE;
  editMode = false;
  isSubmitted = false;
  permissions: any = []
  checkedPermissions: Array<any> = []
  isSelected: boolean = false
  roleDetails: any = {}
  role: string = ''

  constructor(
    private RolesService: RolesService,
    private PermissionsService: PermissionsService,
    private FormBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      name: ['', Validators.required],
      description: [''],
      isActive: ['true']
    });

    this.managePage()
    this.role = this.ActivatedRoute.snapshot.queryParams.role || ''

    this.PermissionsService.getPermissions().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.permissions = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.RolesService.getRoleDetails(this.role).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.roleDetails = res?.result
        for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
        for (let permission of res?.result?.permissions) this.checkedPermissions.push(permission?.refid)
        if (this.checkedPermissions.length == this.permissions.length) this.isSelected = true
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  get roleForm() {
    return this.form.controls;
  }

  managePermission(permission: any) {
    if (!this.checkedPermissions.includes(permission)) {
      this.checkedPermissions.push(permission)
    } else {
      this.checkedPermissions = this.checkedPermissions.filter((item: any) => item != permission)
    }

    if (this.checkedPermissions.length == this.permissions.length) this.isSelected = true
  }

  selectPermissions() {
    for (let permission of this.permissions) this.checkedPermissions.push(permission?.refid)
    this.isSelected = true
  }

  removePermissions() {
    this.checkedPermissions = []
    this.isSelected = false
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
    this.editMode ? this.updateRole() : this.addRole();
  }

  addRole() {
  }

  updateRole() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    if (this.checkedPermissions.length > 0) {
      this.RolesService.updateRoles({ ...this.form.value, permissions: this.checkedPermissions, refid: this.role }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.ToastrService.success(res?.message)
            this.Router.navigate([appRoutes.roles.ROLES_LIST])
          } else {
            this.ToastrService.error(res?.message)
          }
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    }
  }
}