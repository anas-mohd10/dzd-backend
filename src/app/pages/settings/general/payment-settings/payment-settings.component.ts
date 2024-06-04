import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { PaymentDetailsService } from 'src/app/includes/services/payment-details.service';
@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent implements OnInit {
  appRoute = appRoutes;
  details: any;
  activePgId: string = ''
  pgDetails: any;
  isEditMode: boolean = false;
  form: FormGroup = new FormGroup({});

  constructor(
    private PaymentDetailsService: PaymentDetailsService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      paymentGateway: new FormControl('', Validators.required),
      profileId: new FormControl(''),
      merchantCode: new FormControl(''),
      merchantId: new FormControl(''),
      secretKey: new FormControl(''),
      publicKey: new FormControl(''),
      isEnabled: new FormControl(false),
    })
  }

  onPaymentGatewayChange(pgId: string) {
    this.activePgId = pgId;
    this.PaymentDetailsService.getPaymentDetails(pgId).subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.pgDetails = response.result;
          if (response?.result) {
            this.isEditMode = true
          } else {
            this.isEditMode = false
          }
          this.form.patchValue(this.pgDetails);
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.HotToastService.error(error.error.message);
      }
    })
  }

  onSubmit() {
    console.log(this.form.value);
  }

}
