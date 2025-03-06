import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  modalRef?: BsModalRef

  constructor(
    private AdminUsersService: AdminUsersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private router: Router
  ) { }

  get controls() {
    return this.passwordForm.controls
  }

  formatDate(date: any) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  formatTime(date: any) {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl(''),
      countryCode: new FormControl(''),
      email: new FormControl(''),
      mobile: new FormControl('')
    })

    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    })

    this.AdminUsersService.getAdminDetails({}).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.adminDetails = res?.result
          this.form.patchValue(this.adminDetails)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.errorMessage)
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.errorMessage)
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
        this.HotToastService.success(res?.message)
      } else {
        this.HotToastService.error(res?.errorMessage)
      }
    })
  }

  resetForm() {
    this.form.reset()
    this.form.patchValue(this.adminDetails)
  }

  // Update the logout click handler to show modal
  logout(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered'
    });
  }

  // Confirm logout
  confirmLogout() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('UserData');
    localStorage.removeItem('is_logged_in');
    this.modalRef?.hide();
    this.router.navigate(['/auth/login']);
  }

  // Decline logout
  declineLogout() {
    this.modalRef?.hide();
  }


  editDetails() {
    if (!this.form.valid) {
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    this.AdminUsersService.updateAdminUser(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ngOnInit()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.errorMessage)
      }
    })
  }
}
