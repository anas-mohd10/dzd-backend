import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  form: FormGroup;
  isSubmitted = false;
  rolesData: any;
  adminId: any;
  uniqueEmail: boolean = false;
  isMobileEditable: boolean = false
  isEmailEditable: boolean = false
  password: FormControl = new FormControl('', Validators.required)
  showPassword: boolean = false
  adminDetails: any = {}
  isPasswordEditable: boolean = false
  isBasicEditable: boolean = false
  isDuplicate: boolean = false
  modalRef?: BsModalRef

  constructor(
    private AdminUsersService: AdminUsersService,
    private RolesService: RolesService,
    private FormBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['+91', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      username: ['', Validators.required],
      role: ['', Validators.required],
      isActive: ['true', Validators.required],
    });

    this.adminId = this.route.snapshot.queryParams.id || ''

    this.RolesService.getActiveRoles().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ChangeDetectorRef.markForCheck()
          this.rolesData = res?.result
        }else{

        }
      }, error: (err: any) => {

      }
    })

    this.getAdminDetails()
  }

  getAdminDetails() {
    this.AdminUsersService.getAdminUser(this.adminId).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.adminDetails = res?.result
        this.form.patchValue(res?.result)
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  toggleEdit(type: any) {
    type == 'email' ?
      this.isEmailEditable = !this.isEmailEditable : type == 'mobile' ?
        this.isMobileEditable = !this.isMobileEditable : this.isBasicEditable = !this.isBasicEditable
  }

  editPassword() {
    this.isPasswordEditable = !this.isPasswordEditable
  }

  togglePassword() {
    this.showPassword = !this.showPassword
  }

  saveDetails(type: any) {
    switch (type) {
      case 'mobile':
        if (!this.form.get('mobile')?.valid) {
          return
        }

        let mobilePayload = {
          countryCode: this.form.get('countryCode')?.value,
          mobile: this.form.get('mobile')?.value,
          refid: this.adminDetails.refid
        }
        this.AdminUsersService.updateAdminMobile(mobilePayload).subscribe({
          next: (res: any) => {
            if (res?.errorCode == 0) {
              this.isMobileEditable = false
              this.getAdminDetails()
              this.HotToastService.success(res?.message)
              this.ChangeDetectorRef.markForCheck()
            } else {
              this.HotToastService.error(res?.message)
            }
          }, error: (err: any) => {
            this.HotToastService.error(err?.message)
          }
        })
        break
      case 'email':
        if (!this.form.get('email')?.valid) {
          return
        }

        let payload = { email: this.form.get('email')?.value, refid: this.adminDetails.refid }
        this.AdminUsersService.updateAdminEmail(payload).subscribe({
          next: (res: any) => {
            if (res?.errorCode == 0) {
              this.isEmailEditable = false
              this.getAdminDetails()
              this.HotToastService.success(res?.message)
              this.ChangeDetectorRef.markForCheck()
            } else {
              this.HotToastService.error(res?.message)
            }
          }, error: (err: any) => {
            this.HotToastService.error(err?.message)
          }
        })
        break
    }
  }

  open(template: TemplateRef<any>) {
    this.password?.value ? this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' }) : null
  }

  confirm() {
    this.AdminUsersService.changePassword({
      email: this.adminDetails?.email,
      password: this.password?.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.isPasswordEditable = false
          this.getAdminDetails()
          this.HotToastService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.modalRef?.hide()
          this.password?.setValue('')
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  decline() {
    this.modalRef?.hide()
  }

  updateAdmin() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.AdminUsersService.updateAdminDetails({
      username: this.form.get('username')?.value,
      firstname: this.form.get('firstname')?.value,
      lastname: this.form.get('lastname')?.value,
      isActive: this.form.get('isActive')?.value,
      refid: this.adminDetails.refid,
      slug: this.adminDetails.slug,
      role: this.form.get('role')?.value
    }).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.HotToastService.error(res?.message);
      } else if (res.errorCode == 0) {
        this.HotToastService.success('adminId user added successfully');
        this.router.navigate([this.appRoute.admin.ADMIN_USERS]);
      }
    })
  }
}
