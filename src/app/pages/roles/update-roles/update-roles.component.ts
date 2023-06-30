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
  }

  getRoles() {
  }

  getRoleBySlug() {
  }

  checkPermission(id: any, event: any) {
  }

  checkAllPermission(event: any) {
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
  }

}
