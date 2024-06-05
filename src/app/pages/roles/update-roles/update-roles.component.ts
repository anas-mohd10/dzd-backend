import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted = false;
  permissions: any = []
  rolePermissions: Array<any> = []
  roleId: string = '';
  roleDetails: any;
  items: any = [];
  permissionQuery: string = ''

  constructor(
    private RolesService: RolesService,
    private PermissionsService: PermissionsService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.roleId = this.ActivatedRoute.snapshot.queryParams.id || ''

    this.RolesService.getRoleDetails(this.roleId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.roleDetails = res?.result
          this.form.patchValue(res?.result)
          this.rolePermissions = res?.result?.permissions?.map((permission: any) => permission._id)
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      isActive: new FormControl('true'),
      permissions: new FormControl([], Validators.required)
    });

    this.PermissionsService.getPermissions().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.permissions = res?.result
          this.items = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  get roleForm() {
    return this.form.controls;
  }

  toggleRolePermissions(permission: string) {
    let isExists = this.rolePermissions.some((rolePermission: any) => rolePermission == permission)
    if (isExists) {
      this.rolePermissions = this.rolePermissions.filter((rolePermission: any) => rolePermission != permission)
    } else {
      this.rolePermissions.push(permission)
    }
  }

  toggleBulkPermissions(permissions: Array<any>) {
    for (let permission of permissions) {
      let isExists = this.rolePermissions.some((rolePermission: any) => rolePermission == permission?._id)
      if (isExists) {
        this.rolePermissions = this.rolePermissions.filter((rolePermission: any) => rolePermission != permission?._id)
      } else {
        this.rolePermissions.push(permission?._id)
      }
    }
  }

  rolesExists(permissions: Array<any>) {
    let count = 0
    for (let permission of permissions) {
      let isExists = this.rolePermissions.some((rolePermission: any) => rolePermission == permission?._id)
      isExists ? count++ : null
    }

    return count > 0 && count == permissions.length ? true : false
  }

  roleExists(permission: string) {
    return this.rolePermissions.some((rolePermission: any) => rolePermission == permission)
  }

  onSubmit() {
    this.form.get('permissions')?.setValue(this.rolePermissions)

    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.RolesService.updateRoles({
      _id: this.roleDetails._id,
      slug: this.roleDetails.slug,
      ...this.form.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.Router.navigate([this.appRoute.roles.ROLES_LIST])
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }
}