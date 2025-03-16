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

  // In the form initialization, add new controls
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
        recaptchaEnterpriseKey: new FormControl(''),
        recaptchaProjectId: new FormControl(''),
    // recaptchaSiteKey: { type: String },
    // recaptchaProjectId: {type: String},
    // recaptchaPrivateKey: {type: String},
    // recaptchaEmail: {type: String},
        recaptchaPrivateKey: new FormControl(''),
        recaptchaEmail: new FormControl(''),
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
        isRateLimitEnabled: new FormControl(false),
        rateLimitWindowMs: new FormControl(15), // Store in minutes
        rateLimitMaxRequests: new FormControl(5),
    })

      this.getSettings()
  }

  toggleAuthOptions(event: { toggleState: boolean, switchId: string }) {
    this.form.get(event.switchId)?.patchValue(event.toggleState);
  }

  msToMins(ms: number) {
    if(!ms) return 0;
    return ms >= 60 ? `${ms} minutes` : `${ms} seconds`;
  }

  // Convert milliseconds to minutes when receiving from server
  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          const settings = {...res.result};
          if (settings.rateLimitWindowMs) {
            settings.rateLimitWindowMs = settings.rateLimitWindowMs / (60 * 1000); // Convert ms to minutes
          }
          this.form.patchValue(settings);
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => { }
    });
  }

  // Convert minutes to milliseconds when sending to server
  onSubmit() {
    const formData = {...this.form.value};
    if (formData.rateLimitWindowMs) {
      formData.rateLimitWindowMs = formData.rateLimitWindowMs * 60 * 1000; // Convert minutes to ms
    }
    
    this.AppSettingsService.updateSettings(formData).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings();
          this.ChangeDetectorRef.markForCheck();
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    });
  }
}
