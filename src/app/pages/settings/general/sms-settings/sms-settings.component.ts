import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { SmsDetailsService } from 'src/app/includes/services/sms-details.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sms-settings',
  templateUrl: './sms-settings.component.html',
  styleUrls: ['./sms-settings.component.scss']
})
export class SmsSettingsComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSmsGatewayEnabled: FormControl = new FormControl(false)
  smsGatewayItems: Array<any> = [
    { title: "Twilio", id: "twilio", logo: `${environment.base}twilio-logo.png` },
    { title: 'Etisalat', id: 'etisalat', logo: `${environment.base}etisalat-logo.png` }
  ]
  selectedSmsGateway: any
  activeSmsGateway?: any
  modalRef?: BsModalRef
  smsGateways: Array<any> = [];
  smsGatewayConfig: any = {
    'etisalat': ['username', 'password', 'senderId'],
  };

  constructor(
    private SmsDetailsService: SmsDetailsService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      smsGateway: new FormControl('', Validators.required),
      username: new FormControl(''),
      password: new FormControl(''),
      senderId: new FormControl(''),
      apiKey: new FormControl(''),
      isEnabled: new FormControl(false)
    })

    this.getSmsGateways()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if(res?.errorCode == 0){
          this.isSmsGatewayEnabled?.setValue(res?.result?.isSmsGatewayEnabled)
          this.ChangeDetectorRef.markForCheck()
        }else{ }
      }, error: (err: any) => {}
    })
  }

  enableSmsSettings(event: { toggleState: boolean, switchId: string }) {
    this.isSmsGatewayEnabled?.setValue(event.toggleState)
    this.AppSettingsService.updateSettings({ isSmsGatewayEnabled: this.isSmsGatewayEnabled.value }).subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.modalRef?.hide()
        } else {
          this.HotToastService.error(res?.message)
        }
      },
      (error: any) => {
        this.HotToastService.error('An error occurred')
      }
    )
  }

  enableSmsGateway(event: { toggleState: boolean, switchId: string }) {
    this.form.get('isEnabled')?.setValue(event.toggleState)
  }

  getSmsGateways() {
    this.SmsDetailsService.getSmsGateways().subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.smsGateways = res?.result
          this.ChangeDetectorRef.detectChanges()
        } else { }
      },
      (error: any) => { }
    )
  }

  onSubmit() {
    this.SmsDetailsService.manage({ _id: this.selectedSmsGateway?._id, ...this.form.value }).subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.getSmsGateways()
          this.close()
        } else {
          this.HotToastService.error(response.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  open(template: TemplateRef<any>, smsId: string) {
    this.getSmsDetails(smsId)
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
  }

  smsGatewayEnabled(smsId: string) {
    let isExists = this.smsGateways?.some((smsItem: any) => smsItem.smsGateway == smsId)
    return isExists
  }

  close() {
    this.modalRef?.hide()
    this.form.patchValue({
      smsGateway: '',
      username: '',
      password: '',
      senderId: '',
      apiKey: '',
      isEnabled: false
    })
  }

  getSmsDetails(smsId: string) {
    this.activeSmsGateway = this.smsGatewayItems.filter(sms => sms.id == smsId)[0]
    this.form.patchValue({ smsGateway: smsId })
    this.SmsDetailsService.getSmsDetails(smsId).subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
          this.selectedSmsGateway = res?.result
          /**
           * This code block is used to dynamically set the validators for the form fields based on the smsGatewayConfig
          */
          const fields = ['username', 'password', 'senderId'];
          fields.forEach(field => {
            let smsConfig = this.smsGatewayConfig[res?.result?.smsGateway || this.activeSmsGateway?.id] || []
            if (smsConfig?.includes(field)) {
              this.form.get(field)?.setValidators([Validators.required]);
            } else {
              this.form.get(field)?.clearValidators();
            }
            this.form.get(field)?.updateValueAndValidity();
          });
        } else { }
      },
      (error: any) => { }
    )
  }
}
