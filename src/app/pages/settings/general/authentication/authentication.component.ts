import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});

  constructor(
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      isOtpLogin: new FormControl(false),
      isPasswordLogin: new FormControl(true),
      isFacebookLogin: new FormControl(false),
      isGoogleLogin: new FormControl(false),
      isRecaptchaEnabled: new FormControl(false),
      recaptchaSiteKey: new FormControl(''),
      recaptchaSecretKey: new FormControl(''),
      isOtpForGuestCheckout: new FormControl(false),
      isGuestCheckout: new FormControl(false),
      isOtpForRegistration: new FormControl(false),
      androidRecaptchaKey: new FormControl(''),
      iosRecaptchaKey: new FormControl(''), 
      facebookLogin: new FormGroup({
        text: new FormControl('Login with Facebook'),
        clientId: new FormControl(''),
        clientSecret: new FormControl(''),
      }),
      googleLogin: new FormGroup({
        text: new FormControl('Login with Google'),
        clientId: new FormControl(''),
        clientSecret: new FormControl(''),
      }),
    })

    this.getSettings()
  }

  toggleAuthOptions(event: { toggleState: boolean, switchId: string }) {
    this.form.get(event.switchId)?.patchValue(event.toggleState);
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  onSubmit() {
    this.AppSettingsService.updateSettings(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings()
          this.ChangeDetectorRef.markForCheck()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    });
  }
}
