import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { AuthService } from 'src/app/includes/services/auth.service';
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
  isDeveloperAccess: boolean = false

  constructor(
    private AdminUsersService: AdminUsersService,
    private RolesService: RolesService,
    private FormBuilder: FormBuilder,
    private AuthService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }


  handleMobilePattern() {
    switch (this.form.get("countryCode")?.value) {
      case "+91":
        this.updateMobilePattern(`^[0-9]{10}$`);
        break;
      case "+971":
        this.updateMobilePattern(`^[0-9]{9}$`);
        break;
    }
  }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [ Validators.pattern("^[0-9]{9}$")]],
      role: ['', Validators.required],
      isDeveloperAccess: ['false'],
      isActive: ['true'],
    });

    this.AuthService.me().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.isDeveloperAccess = res?.result?.isDeveloperAccess
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })

    this.adminId = this.route.snapshot.queryParams.adminId || ''

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

  getFormatDate(date: any) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  getFormatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  getAdminDetails() {
    this.AdminUsersService.getAdminUser(this.adminId).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.adminDetails = res?.result
        this.form.patchValue(res?.result)
        this.handleMobilePattern()
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
        
        this.AdminUsersService.updateAdminMobile({
          countryCode: this.form.get('countryCode')?.value,
          mobile: this.form.get('mobile')?.value,
          _id: this.adminId
        }).subscribe({
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
      this.HotToastService.error('Please fill all the required fields')
      this.isSubmitted = true
      return;
    }

    this.AdminUsersService.updateAdminDetails({
      ...this.form.value,
      refid: this.adminDetails.refid,
      _id: this.adminDetails._id,
      slug: this.adminDetails.slug,
    }).subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.HotToastService.success(res.message);
          this.router.navigate([this.appRoute.admin.ADMIN_USERS]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }
}
