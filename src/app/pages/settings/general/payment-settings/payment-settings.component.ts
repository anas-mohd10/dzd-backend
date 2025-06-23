import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { PaymentDetailsService } from 'src/app/includes/services/payment-details.service';
import { environment } from 'src/environments/environment';

interface Pg {
  title: string;
  id: string;
  icon: string;
}

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss'],
})
export class PaymentSettingsComponent implements OnInit {
  appRoute = appRoutes;
  details: any;
  activePgDetails: any;
  pgDetails: any;
  paymentGateways: Array<any> = [];
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form: FormGroup = new FormGroup({});
  pgs: Array<Pg> = [
    { title: 'Network', id: 'network-international', icon: `${environment.base}network-international.png` },
    { title: 'Network ( Tokenized )', id: 'network-international-tokenized', icon: `${environment.base}network-international.png` },
    { title: 'Tap Payments', id: 'tap', icon: `${environment.base}tap.png` },
    { title: 'Paytabs', id: 'paytabs', icon: `${environment.base}paytabs.png` },
    { title: 'Qi', id: 'qi', icon: `${environment.base}qi.png` },
    { title: 'Razorpay', id: 'razorpay', icon: `${environment.base}razorpay.png` },
    { title: 'Rak Bank', id: 'rakbank', icon: `${environment.base}rakbank.png` },
    { title: 'Tabby', id: 'tabby', icon: `${environment.base}tabby.png` },
    { title: 'Tamara', id: 'tamara', icon: `${environment.base}tamara.png` },
  ];
  displayIcon: string = '';
  modalRef?: BsModalRef;
  settingsForm: FormGroup = new FormGroup({});
  paymentGatewayConfig: any = {
    paytabs: ['profileId', 'serverKey', 'region'],
    tabby: ['merchantCode', 'secretKey', 'publicKey'],
    tap: ['secretKey', 'publicKey'],
    rakbank: ['publicKey', 'privateKey'],
    'network-international': ['outletReference', 'apiKey', 'apiUrl'],
    'network-international-tokenized': ['outletReference', 'apiKey', 'apiUrl'],
    qi: ['secretKey', 'apiUrl', 'username', 'password'],
    razorpay: ['secretKey', 'keyId'],
    tamara: ['apiUrl', 'publicKey', 'privateKey', 'payByOption']
  };

  get formControls() {
    return this.form.controls;
  }

  constructor(
    private PaymentDetailsService: PaymentDetailsService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      paymentGateway: new FormControl('', Validators.required),
      profileId: new FormControl(''),
      merchantCode: new FormControl(''),
      merchantId: new FormControl(''),
      secretKey: new FormControl(''),
      accessToken: new FormControl(''),
      keyId: new FormControl(''),
      displayName: new FormControl(''),
      displayIcon: new FormControl(null),
      displayDescription: new FormControl(''),
      apiKey: new FormControl(''),
      outletReference: new FormControl(''),
      publicKey: new FormControl(''),
      privateKey: new FormControl(''),
      payByOption: new FormControl(''),
      region: new FormControl(''),
      serverKey: new FormControl(''),
      apiUrl: new FormControl(''),
      isEnabled: new FormControl(false),
      username: new FormControl(''),
      password: new FormControl(''),
    });

    this.fetchGateways();
    this.fetchSettings();

    this.settingsForm = new FormGroup({
      isOnlinePayment: new FormControl(false),
      isCashOnDelivery: new FormControl(false),
      isCardOnDelivery: new FormControl(false),
    });
  }

  paymentGatewayEnabled(pgId: string) {
    let isExists = this.paymentGateways.some(
      (paymentGateway: any) => paymentGateway.paymentGateway == pgId
    );
    return isExists;
  }

  fetchGateways() {
    this.PaymentDetailsService.getPaymentGateways().subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.paymentGateways = response.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.HotToastService.error(error.error.message);
      },
    });
  }

  onSwitcTriggered(
    event: { switchId: string; toggleState: boolean },
    type: string
  ) {
    switch (type) {
      case 'online':
        this.settingsForm.patchValue({ isOnlinePayment: event.toggleState });
        break;
      case 'cash':
        this.settingsForm.patchValue({ isCashOnDelivery: event.toggleState });
        break;
      case 'card':
        this.settingsForm.patchValue({ isCardOnDelivery: event.toggleState });
        break;
    }

    this.AppSettingsService.updateSettings(this.settingsForm.value).subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.HotToastService.success(response.message);
          this.fetchSettings();
        } else {
          this.HotToastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.HotToastService.error(error.error.message);
      },
    });
  }

  fetchSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settingsForm.patchValue(res.result);
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }

  onPaymentGatewayTriggered(event: { switchId: string; toggleState: boolean }) {
    this.form.patchValue({ isEnabled: event.toggleState });
  }

  onMediaTriggered(event: any) {
    this.form.patchValue({ displayIcon: event?._id });
  }

  open(template: TemplateRef<any>, pgId: string) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });
    this.onPaymentGatewayChange(pgId);
  }

  getPgIcon(pgId: string) {
    switch (pgId) {
      case 'network-international':
        return `assets/payment-icons/network.png`;
      case 'network-international-tokenized':
        return `assets/payment-icons/network.png`;
      case 'tap':
        return `assets/payment-icons/tap.jpg`;
      case 'paytabs':
        return `assets/payment-icons/paytabs.jpg`;
      case 'qi':
        return `assets/payment-icons/qi.png`;
      case 'razorpay':
        return `assets/payment-icons/razorpay.png`;
      case 'rakbank':
        return `assets/payment-icons/rakbank.png`;
      case 'tabby':
        return `assets/payment-icons/tabby.jpg`;
      case 'tamara':
        return `assets/payment-icons/tamara.png`;
    }
  }

  close() {
    this.modalRef?.hide();
    this.form.reset();
    this.form.patchValue({ payByOption: '', isEnabled: false })
    this.displayIcon = '';
    this.isSubmitted = false;
  }

  onPaymentGatewayChange(pgId: string) {
    this.activePgDetails = this.pgs.filter((pg) => pg.id == pgId)[0];
    this.form.patchValue({
      displayName: this.activePgDetails.title,
      paymentGateway: pgId,
    });
    this.PaymentDetailsService.getPaymentDetails(pgId).subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.pgDetails = response.result;
          this.displayIcon = response.result?.displayIcon?.path;
          this.form.patchValue(this.pgDetails);
          this.form.patchValue({
            displayIcon: response.result?.displayIcon?._id,
          });
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(response.message);
        }
      },
      error: (error: any) => {
        this.HotToastService.error(error.error.message);
      },
    });

    const paymentGateway = this.form.get('paymentGateway')?.value;
    const fields = [
      'profileId',
      'apiKey',
      'outletReference',
      'merchantCode',
      'merchantId',
      'secretKey',
      'displayName',
      'displayIcon',
      'publicKey',
      'region',
      'keyId',
      'serverKey',
      'apiUrl',
      'accessToken',
      'privateKey',
      'payByOption'
    ];

    fields.forEach((field) => {
      let pgConfig = this.paymentGatewayConfig[paymentGateway] || [];
      if (pgConfig?.includes(field)) {
        this.form.get(field)?.setValidators([Validators.required]);
      } else {
        this.form.get(field)?.clearValidators();
      }
      this.form.get(field)?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.PaymentDetailsService.manage({
      _id: this.pgDetails?._id,
      ...this.form.value,
    }).subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.HotToastService.success(response.message);
          this.close();
          this.fetchGateways();
        } else {
          this.HotToastService.error(response.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }
}
