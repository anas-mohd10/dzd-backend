import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private AdminUsersService: AdminUsersService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.token = this.ActivatedRoute.snapshot.params?.token || ''

    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
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

    this.AdminUsersService.resetPassword({ ...this.form.value, token: this.token }).subscribe({
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
