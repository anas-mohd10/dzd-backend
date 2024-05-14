import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
  permissions: any = []
  rolePermissions: Array<any> = []

  constructor(
    private RolesService: RolesService,
    private PermissionsService: PermissionsService,
    private FormBuilder: FormBuilder,
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
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

  roleExists(permission: string) {
    return this.rolePermissions.some((rolePermission: any) => rolePermission == permission)
  }

  onSubmit() {
    this.form.get('permissions')?.setValue(this.rolePermissions)

    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.RolesService.addRoles(this.form.value).subscribe({
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
