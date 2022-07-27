import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  roleForm: FormGroup;
  appRoute = appRoutes
  task = PageTasks.ADD;
  editMode = false;
  isSubmitted = false;
  permissionsData: any;
  permissionsArray: any = []
  roleNames: any = [];

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
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.managePage()
    this.getPermission()
    this.getRoles()
    this.roleForm.get("permission")?.setValue(false)
  }

  initForm() {
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      selectall: [''],
      permission: [Validators.required],
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
    if (!this.roleForm.valid) {
      return;
    }

    let name = this.roleForm.get('name')?.value

    if (!this.roleNames.includes(name)) {
      this.roleForm.get("permission")?.setValue(this.permissionsArray)
      this.roleService.addRoles(this.roleForm.value).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something Went Wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Role Added Successfully');
          this.router.navigate([this.appRoute.roles.ROLES_LIST]);
        }
      })
    } else {
      this.toastr.info(`${name} already exists`);
    }
  }

  updateRole() { }
}
