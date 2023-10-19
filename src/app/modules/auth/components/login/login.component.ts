import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes, authRoute } from '../../../../config/routes';
import { AuthService } from '../../../../includes/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../includes/services/toast.service';
import { localstorageVariables } from 'src/app/config/localStorageVariable';
import { ToastrService } from 'ngx-toastr';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isSubmitted: boolean = false
  authRoute = authRoute;
  appRoute = appRoutes;
  userData: {};
  failedUser: boolean = false;
  public Toggledata = true;
  public CustomControler: any;
  public subscription: Subscription;
  errorMessage: any;
  redirectUrl: any;
  modalRef?: BsModalRef
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  isValidated: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private ToastrService: ToastrService,
    private AdminUsersService: AdminUsersService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.redirectUrl = this.ActivatedRoute.snapshot.queryParams?.redirectUrl || this.appRoute.DASHBOARD;
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get af() {
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmitted = true;

    this.userData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }

    this.authService.login(this.userData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.ToastrService.error(res?.message || 'Invalid username or password');
      } else {
        this.authService.saveUserData(res?.result)
        localStorage.setItem(localstorageVariables.access_token, res?.result?.token);
        localStorage.setItem(localstorageVariables.is_logged_in, 'true');
        this.Router.navigate([this.redirectUrl]);
      }
    })
  }

  forgotPassword(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
  }

  confirm() {
    if(!this.email.valid){
      this.isValidated = true
      return
    }

    this.AdminUsersService.forgotPassword({ email: this.email.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          let token = res?.result?.token;
          this.Router.navigate([`/auth/forgot-password/${token}`])
          this.modalRef?.hide()
        } else {
          this.ToastrService.error(res?.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message);
      },
    })
  }

  ngOnDestroy(): void {
  }
}
