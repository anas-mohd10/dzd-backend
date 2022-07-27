import { Component, OnInit } from '@angular/core';
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
  roleForm: FormGroup;
  appRoute = appRoutes
  task = PageTasks.UPDATE;
  editMode = false;
  isSubmitted = false;
  permissionsData: any;
  permissionsArray: any = []
  roleNames: any = [];
  role: any;
  roleData: any;

  constructor(
    private roleService: RolesService,
    private permissionService: PermissionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.role = this.route.snapshot.queryParams.role || ''
    this.getPermission()
    this.getRoles()
    this.getRoleBySlug()
  }

  initForm() {
    this.roleForm = this.formBuilder.group({
      name: [''],
      description: [''],
      selectall: [''],
      permission: [''],
    });
  }

  get rf() {
    return this.roleForm.controls;
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

  getPermission() {
    this.permissionService.getPermissions().subscribe((res: any) => {
      this.permissionsData = res?.result
    })
  }

  getRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      for (let role of res?.result) {
        this.roleNames.push(role.name)
      }
    })
  }

  getRoleBySlug() {
    this.roleService.getRoleById(this.role).subscribe((res: any) => {
      this.roleData = res?.result[0]
      this.roleForm.get("name")?.setValue(res?.result[0].name)
      this.roleForm.get("description")?.setValue(res?.result[0].description)
      this.permissionsArray = res?.result[0].permission
    })
  }

  checkPermission(id: any, event: any) {
    let checked = event.target.checked
    if (checked == true) {
      if (!this.permissionsArray.includes(id)) {
        this.permissionsArray.push(id)
        if (this.permissionsArray.length == this.permissionsData.length) {
          this.roleForm.get("selectall")?.setValue(true)
        }
      }
    } else if (checked == false) {
      let index = this.permissionsArray.indexOf(id)
      this.permissionsArray.splice(index, 1)
      this.roleForm.get("selectall")?.setValue(false)
    }
  }

  checkAllPermission(event: any) {
    let checked = event.target.checked
    if (checked == true) {
      for (let permission of this.permissionsData) {
        if (!this.permissionsArray.includes(permission._id)) {
          this.permissionsArray.push(permission._id)
        }
      }
      this.roleForm.get("permission")?.setValue(true)
    } else if (checked == false) {
      for (let permission of this.permissionsData) {
        let index = this.permissionsArray.indexOf(permission._id)
        this.permissionsArray.splice(index, 1)
      }
      this.roleForm.get("permission")?.setValue(false)
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
  }

  updateRole() {
    if (!this.roleForm.valid) {
      return;
    }

    let name = this.roleForm.get('name')?.value

    if (this.roleData.name != name) {
      if (!this.roleNames.includes(name)) {
        this.roleForm.get("permission")?.setValue(this.permissionsArray)
        this.roleService.updateRoles(this.role, this.roleForm.value).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error('Something went wrong');
          } else if (res.errorCode == 0) {
            this.toastr.success('Role updates successfully');
            this.router.navigate([this.appRoute.roles.ROLES_LIST]);
          }
        })
      } else {
        this.toastr.info(`${name} already exists`);
      }
    } else if (this.roleData.name = name) {
      this.roleForm.get("permission")?.setValue(this.permissionsArray)
      this.roleService.updateRoles(this.role, this.roleForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Role updates successfully');
          this.router.navigate([this.appRoute.roles.ROLES_LIST]);
        }
      })
    }
  }

}
