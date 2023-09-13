import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes, authRoute } from '../../../../config/routes';
import { AuthService } from '../../../../includes/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../includes/services/toast.service';
import { localstorageVariables } from 'src/app/config/localStorageVariable';
// import { WebStorage } from '../../web.storage';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.redirectUrl = this.route.snapshot.queryParams?.redirectUrl || this.appRoute.DASHBOARD;
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
        this.toastr.error(res?.message || 'Invalid username or password');
      } else {
        this.authService.saveUserData(res?.result)
        localStorage.setItem(localstorageVariables.access_token, res?.result?.token);
        localStorage.setItem(localstorageVariables.is_logged_in, 'true');
        this.router.navigate([this.redirectUrl]);
      }
    })
  }

  ngOnDestroy(): void {
  }
}
