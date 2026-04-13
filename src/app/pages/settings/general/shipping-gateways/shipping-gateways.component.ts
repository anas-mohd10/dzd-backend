import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ShippingGatwaysService } from 'src/app/includes/services/shipping-gatways.service';

type shippingGateways = {
  title: string
  keyId: string
}

@Component({
  selector: 'app-shipping-gateways',
  templateUrl: './shipping-gateways.component.html',
  styleUrls: ['./shipping-gateways.component.scss']
})
export class ShippingGatewaysComponent implements OnInit {
  appRoute = appRoutes
  isShippingGateway: boolean = false
  isSubmitted: boolean = false;
  form: FormGroup = new FormGroup({});
  shippingGateways: shippingGateways[] = [
    { title: 'Aramex', keyId: 'aramex' },
    { title: 'Safexpress', keyId: 'safexpress' },
  ];
  activeDocId: string | null
  modalRef: BsModalRef | null;
  shippingGatewayConfig: any = {
    aramex: [
      'apiUrl',
      'username',
      'password',
      'accountNumber',
      'accountPin',
      'accountEntity',
      'accountCountryCode',
      'source',
      'version',
      'productGroup',
      'productType',
      'paymentType',
      'paymentOptions',
      'exporterType',
      'services'
    ],
    safexpress: [
      'apiUrl',
      'authUrl',
      'consigneeUrl',
      'username',
      'password',
      'apiKey',
      'authApiKey',
      'branchCode',
      'clientId',
      'consignorId',
      'dealerCode',
      'groupCode',
      'rateCard',
      'sfxPrcCode'
    ]
  };
  gateways: Array<any> = []

  constructor(
    private ShippingGatwaysService: ShippingGatwaysService,
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  open(template: TemplateRef<any>, docId: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.fetchGateway(docId)
  }

  close() {
    this.activeDocId = null
    this.modalRef?.hide()
    this.form.reset()
    this.form.patchValue({ isDefault: false, isEnabled: false })
  }

  get formControls() {
    return this.form.controls
  }

  toggleSwitch(type: 'isEnabled' | 'isDefault', event: { switchId: string, toggleState: boolean }) {
    this.form.get([type])?.setValue(event.toggleState)
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      isEnabled: new FormControl(false),
      isDefault: new FormControl(false),
      gateway: new FormControl(''),
      apiUrl: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      accountNumber: new FormControl(''),
      accountPin: new FormControl(''),
      accountEntity: new FormControl(''),
      accountCountryCode: new FormControl(''),
      source: new FormControl(''),
      version: new FormControl(''),
      productGroup: new FormControl(''),
      productType: new FormControl(''),
      paymentOptions: new FormControl(''),
      paymentType: new FormControl(''),
      exporterType: new FormControl(''),
      services: new FormControl(''),
      apiKey: new FormControl(''),
      authApiKey: new FormControl(''),
      branchCode: new FormControl(''),
      clientId: new FormControl(''),
      consignorId: new FormControl(''),
      dealerCode: new FormControl(''),
      groupCode: new FormControl(''),
      rateCard: new FormControl(''),
      sfxPrcCode: new FormControl(''),
      authUrl: new FormControl(''),
      consigneeUrl: new FormControl('')
    })

    Promise.all([
      this.fetchGateways(),
      this.fetchSettings()
    ])
  }

  fetchSettings() {
    this.AppSettingsService.getSettings().subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.isShippingGateway = res.result.isShippingGateway
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }

  fetchGateways() {
    this.ShippingGatwaysService.shippingGateways().subscribe({
      next: (resp: any) => {
        if (resp && resp.errorCode == 0) {
          this.gateways = resp.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(resp.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }

  fetchGateway(docId: string) {
    this.activeDocId = docId
    this.form.patchValue({ gateway: docId })
    this.ShippingGatwaysService.shippingGateway(docId).subscribe({
      next: (resp: any) => {
        if (resp && resp.errorCode == 0) {
          this.form.patchValue(resp.result.response)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(resp.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })

    const fields = [
      'apiUrl',
      'username',
      'password',
      'accountNumber',
      'accountPin',
      'accountEntity',
      'accountCountryCode',
      'source',
      'version',
      'productGroup',
      'productType',
      'paymentType',
      'paymentOptions',
      'exporterType',
      'services',
      'apiKey',
      'authApiKey',
      'branchCode',
      'clientId',
      'consignorId',
      'dealerCode',
      'groupCode',
      'rateCard',
      'sfxPrcCode',
      'authUrl',
      'consigneeUrl'
    ]

    fields.forEach((field) => {
      let pgConfig = this.shippingGatewayConfig[docId] || [];
      if (pgConfig?.includes(field)) {
        this.form.get(field)?.setValidators([Validators.required]);
      } else {
        this.form.get(field)?.clearValidators();
      }
      this.form.get(field)?.updateValueAndValidity();
    });
  }

  saveChanges() {
    if (!this.form.valid) {
      this.isSubmitted = true
      this.HotToastService.error("Please fill all the required fields")
      return
    }

    this.ShippingGatwaysService.manageShippingGateway(this.form.value).subscribe({
      next: (resp: any) => {
        if (resp && resp.errorCode == 0) {
          this.close()
          this.HotToastService.success(resp.message)
          this.fetchGateways()
        } else {
          this.HotToastService.error(resp.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }
}
