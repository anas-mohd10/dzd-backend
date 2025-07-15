import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

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
  ];
  modalRef: BsModalRef | null;
  shippingGatewayConfig: any = {
    aramex: ['apiUrl', 'username', 'password', 'accountNumber', 'accountPin', 'accountEntity', 'accountCountryCode', 'source'],
  };


  constructor(
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      isEnabled: new FormControl(false),
      isDefault: new FormControl(false),
      apiUrl: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      accountNumber: new FormControl(false),
      accountPin: new FormControl(false),
      accountEntity: new FormControl(''),
      accountCountryCode: new FormControl(''),
      source: new FormControl(''),
    })

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

}
