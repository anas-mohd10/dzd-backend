import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { authRoute } from 'src/app/config/routes';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup
  isSubmitted: boolean = false
  token: string = ''
  authRoute = authRoute
  isDisabled: boolean = false
  isUnmatched: boolean = false

  constructor(
    private AdminUsersService: AdminUsersService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.token = this.ActivatedRoute.snapshot.params?.token || ''
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    })

    this.AdminUsersService.resetToken({ token: this.token }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
          this.ToastrService.error(res.message)
        }
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  get formControls() {
    return this.form.controls;
  }

  reset() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.form.get('password')?.value == this.form.get('confirmPassword')?.value
      ? this.isUnmatched = false : this.isUnmatched = true

    this.AdminUsersService.resetPassword({ password: this.form.get('password')?.value, token: this.token }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate(['/auth/login'])
          this.ToastrService.success(res?.message);
        } else {
          this.ToastrService.error(res?.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message);
      }
    })
  }

}
