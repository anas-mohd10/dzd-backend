import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  appRoute = appRoutes
  adminDetails: any = {}
  form: FormGroup
  isValid: boolean = true
  isTouched: boolean = false
  isResetPassword: boolean = false
  @ViewChild('username') username: ElementRef;
  @ViewChild('email') email: ElementRef;
  isPasswordSubmitted: boolean = false
  passwordForm: FormGroup


  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  get passwordControls() {
    return this.passwordForm.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl(''),
      countryCode: new FormControl(''),
      mobile: new FormControl('')
    })

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    })

    this.AdminUsersService.getAdminDetails({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.adminDetails = res?.result
        this.adminDetails.createdAt = new Date(this.adminDetails.createdAt).toString()
        this.ChangeDetectorRef.markForCheck()

        for (let key of Object.keys(this.adminDetails)) {
          this.form.get(key)?.setValue(this.adminDetails[key])
        }
      }
    })
  }

  touchAction(action: any) {
    switch (action) {
      case true:
        this.isTouched = true
        break
      case false:
        this.isTouched = false
        break
      default:
        this.isTouched = true
        break
    }
  }

  resetPassword(action: any) {
    switch (action) {
      case true:
        this.isResetPassword = true
        break
      case false:
        this.passwordForm.reset()
        this.isPasswordSubmitted = false
        this.isResetPassword = false
        break
      default:
        this.isResetPassword = true
        break
    }
  }

  changePassword() {
    if (!this.passwordForm.valid) {
      this.isPasswordSubmitted = true
      return
    }

    this.AdminUsersService.resetPassword(this.passwordForm.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
      } else {
        this.ToastrService.error(res?.errorMessage)
      }
    })
  }

  editDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }

    this.AdminUsersService.updateAdminUser(this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ngOnInit()
        this.isValid = true
        this.isTouched = false
        this.ToastrService.success('Details updated successfully')
      }
    })
  }
}
