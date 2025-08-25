import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes, authRoute } from '../../../../config/routes';
import { AuthService } from '../../../../includes/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { localstorageVariables } from 'src/app/config/localStorageVariable';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

interface Settings {
  logo: string
  darkLogo: string
  adminLogo: string
  adminFavicon: string
  favicon: string,
  title: string,
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
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
  isValidated: boolean = false;
  isPassword: boolean = true;
  settings: Settings | null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private AdminUsersService: AdminUsersService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.redirectUrl = this.ActivatedRoute.snapshot.queryParams?.redirectUrl || this.appRoute.DASHBOARD;

    this.AppSettingsService.getSettings().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.settings = res.result;
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get formControls() {
    return this.form.controls;
  }

  submit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    const emailAddress: string = this.form.get('email')?.value.toLowerCase()
    this.form.patchValue({ email: emailAddress })

    this.authService.login(this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.authService.saveUserData(res?.result)
          localStorage.setItem(localstorageVariables.access_token, res?.result?.token);
          localStorage.setItem(localstorageVariables.is_logged_in, 'true');
          this.Router.navigate([this.redirectUrl]);
        } else {
          this.HotToastService.error(res?.message || 'Invalid username or password');
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

  forgotPassword(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  }

  togglePassword() {
    this.isPassword = !this.isPassword;
  }

  confirm() {
    if (!this.email.valid) {
      this.isValidated = true
      return
    }

    this.AdminUsersService.forgotPassword({ email: this.email.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.email.reset()
          this.modalRef?.hide()
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    })
  }

  ngOnDestroy(): void {
  }
}
