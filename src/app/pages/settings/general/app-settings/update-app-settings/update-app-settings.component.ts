import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { validators } from 'src/app/config/constants/mobile-validators';
import { HttpClient } from '@angular/common/http';

interface Media {
  title: string;
  _id: string;
  size: string;
  path: string;
  slug: string;
  tag: string;
  type: string;
  uploadedBy: string;
  uploadedDescription: string;
  uploadedTo: string;
  createdAt: string;
};

@Component({
  selector: 'app-update-app-settings',
  templateUrl: './update-app-settings.component.html',
  styleUrls: ['./update-app-settings.component.scss']
})
export class UpdateAppSettingsComponent implements OnInit {
  appRoute = appRoutes
  task = PageTasks.UPDATE;
  editMode = true;
  data: any
  form: FormGroup
  isSubmitted = false;
  refid: any;
  currency: any
  currencies: Array<any> = ['INR', 'USD', 'EUR', 'AED', 'IQD']
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Type here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'sen', name: 'Sen' },
    ]
  };
  paymentGateways: Array<string> = []
  fontFamily: Array<any> = [
    'Sen',
    'Be Vietnam Pro',
    'Poppins',
    'Sen',
    'GeogrotesqueCyr',
    'BellMT',
    'BookAntiqua',
    'Active',
    'Hellix'
  ];
  logo?: string;
  favicon?: string;
  primary: string = '';
  modalRef?: BsModalRef;
  discardModalRef?: BsModalRef;
  secondary: string = '';
  storeStatus: boolean = true;
  defaultImage: string = '';
  languageItems: Array<any> = [
    { lang: 'English', langCode: 'en' },
    { lang: 'Arabic', langCode: 'ar' }
  ];
  languages: Array<{
    lang: string, langCode: string
  }> = [];

  constructor(
    private formBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private BsModalRef: BsModalRef,
    private HttpClient: HttpClient
  ) { }

  toggleLanguages(language: { lang: string, langCode: string }) {
    let isExists = this.languages.some((item: { lang: string, langCode: string }) => item.lang == language.lang)
    if (isExists) {
      if (this.form.get('primaryLang')?.value == language.langCode) {
        this.HotToastService.error('Primary language cannot be removed')
      } else {
        this.languages = this.languages.filter((item: { lang: string, langCode: string }) => item.lang != language.lang)
        this.HotToastService.info('Language removed successfully')
      }
    } else {
      this.languages.push(language)
      this.HotToastService.success('Language added successfully')
    }
  }

  languageExists(language: { lang: string, langCode: string }) {
    let isExists = this.languages.some((item: { lang: string, langCode: string }) => item.lang == language.lang)
    return isExists
  }

  ngOnInit(): void {
    this.initform();
    this.refid = this.ActivatedRoute.snapshot.queryParams.id || '1';
    this.getSettings();

    this.primary = '#00BDAB'
    this.secondary = '#aaaaaa'
    this.form.get('primary')?.setValue('#00BDAB')
  }

  get formControls() {
    return this.form.controls
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId(this.refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.logo = res?.result?.logo
        this.paymentGateways = res?.result?.paymentGateway
        this.favicon = res?.result?.favicon
        this.primary = "#" + res?.result?.colors?.primary.split('FF')[1]
        this.secondary = "#" + res?.result?.colors?.secondary.split('FF')[1]
        this.form.get('primary')?.setValue("#" + res?.result?.colors?.primary.split('FF')[1])
        this.form.get('secondary')?.setValue("#" + res?.result?.colors?.secondary.split('FF')[1])
        this.form.get('star')?.setValue("#" + res?.result?.colors?.star.split('FF')[1])
        this.form.get('label')?.setValue("#" + res?.result?.colors?.label.split('FF')[1])
        this.form.get('text')?.setValue("#" + res?.result?.colors?.text.split('FF')[1])
        this.form.get('toastSuccess')?.setValue("#" + res?.result?.toast?.success.split('FF')[1])
        this.form.get('toastError')?.setValue("#" + res?.result?.toast?.error.split('FF')[1])
        this.form.get('toastInfo')?.setValue("#" + res?.result?.toast?.info.split('FF')[1])
        this.form.get('fontFamily')?.setValue(res?.result?.fonts?.family)
        this.form.get('email')?.setValue(res?.result?.email)
        this.form.get('gstNo')?.setValue(res?.result?.gstNo)
        this.form.get('countryCode')?.setValue(res?.result?.countryCode)
        this.form.get('mobile')?.setValue(res?.result?.mobile)
        this.form.get('primaryAddress')?.setValue(res?.result?.primaryAddress)
        this.form.get('paymentGateway')?.setValue(res?.result?.paymentGateway)
        this.form.get('currency')?.setValue(res?.result?.currency)
        this.form.get('isStoreLive')?.setValue(res?.result?.isStoreLive)
        this.form.get('companyName')?.setValue(res?.result?.companyName)
        this.form.get('domain')?.setValue(res?.result?.domain)
        this.form.get('name')?.setValue(res?.result?.name)
        this.form.get('defaultImage')?.setValue(res?.result?.defaultImage)
        this.defaultImage = res?.result?.defaultImage
        this.form.get('description')?.setValue(res?.result?.description)
        this.form.get('itemsPerPage')?.setValue(res?.result?.itemsPerPage)
        this.form.get('isOutOfStock')?.setValue(res?.result?.isOutOfStock)
        this.form.get('isNotifyStock')?.setValue(res?.result?.isNotifyStock)
        this.form.get('packingSlip')?.setValue(res?.result?.notes?.packingSlip)
        this.form.get('cartButton')?.setValue(res?.result?.buttons?.cart)
        this.form.get('stockButton')?.setValue(res?.result?.buttons?.stock)
        this.form.get('notifyButton')?.setValue(res?.result?.buttons?.notify)
        this.form.get('shippingCost')?.setValue(res?.result?.shippingCost)
        this.form.get('logo')?.setValue(res?.result?.logo)
        this.form.get('favicon')?.setValue(res?.result?.favicon)

        for (let lang of res?.result?.languages) {
          let isExists = this.languages.some((item: { lang: string, langCode: string }) => item.lang == lang?.lang)
          !isExists && this.languages.push({ lang: lang?.lang, langCode: lang?.langCode })
        }

        this.form.get('primaryLang')?.setValue(res?.result?.primaryLang)
        this.ChangeDetectorRef.markForCheck()
        this.storeStatus = res?.result?.isStoreLive
      }
    })
  }

  handleDefaultImage(event: any) {
    this.form.get('defaultImage')?.setValue(event.path)
  }

  toggleStoreStatus(event: { toggleState: boolean, switchId: string }, template: TemplateRef<any>) {
    this.form.get('isStoreLive')?.setValue(event.toggleState)
    this.storeStatus = event.toggleState
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  }

  decline() {
    this.storeStatus = this.data?.isStoreLive || false
    this.modalRef?.hide()
  }

  confirm() {
    this.modalRef?.hide()
    this.form.get('isStoreLive')?.setValue(this.storeStatus)
  }

  initform() {
    this.form = this.formBuilder.group({
      primary: ['', Validators.required],
      secondary: ['', Validators.required],
      star: ['', Validators.required],
      label: ['', Validators.required],
      toastError: ['', Validators.required],
      currency: ['', Validators.required],
      toastSuccess: ['', Validators.required],
      toastInfo: ['', Validators.required],
      text: ['', Validators.required],
      itemsPerPage: ['', Validators.required],
      primaryAddress: ['', Validators.required],
      gstNo: [''],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+971', Validators.required],
      mobile: ['', Validators.required],
      fontFamily: ['', Validators.required],
      name: ['', Validators.required],
      companyName: [''],
      domain: ['', Validators.required],
      description: ['', Validators.required],
      primaryLang: [''],
      isMultiLang: ['false'],
      languages: [[]],
      packingSlip: [''],
      isOutOfStock: ['false'],
      isStoreLive: ['true'],
      defaultImage: [''],
      isNotifyStock: ['false'],
      cartButton: ['Add to Cart', Validators.required],
      stockButton: ['Out of Stock', Validators.required],
      notifyButton: ['Notify Me', Validators.required],
      logo: ['', Validators.required],
      favicon: ['', Validators.required],
    })
  }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get("countryCode")?.value) {
      case "+91":
        this.updateMobilePattern(`^[0-9]{${validators.india.validation.maximum}}$`);
        break;
      case "+971":
        this.updateMobilePattern(`^[0-9]{${validators.uae.validation.maximum}}$`);
        break;
    }
  }

  declineDiscard() {
    this.discardModalRef?.hide()
  }

  approveDiscard() {
    let websiteUrl = this.data.domain?.endsWith('/') ? this.data.domain : this.data.domain + '/'
    this.HttpClient.post(`${websiteUrl}api/v1/w/cacheFlush`, {}).subscribe({
      next: (res: any) => {
        if (res?.status == true) {
          this.HotToastService.success("Cache flushed successfully")
          this.declineDiscard()
        } else {
          this.HotToastService.error("Something went wrong")
        }
      }, error: (err: any) => {
        this.HotToastService.error("Something went wrong")
      }
    })
  }

  openDiscardModal(template: TemplateRef<any>) {
    this.discardModalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' });
  }

  handleStoreLogo(event: any) {
    this.form.get('logo')?.setValue(event.path)
  }

  handleStoreFavicon(event: any) {
    this.form.get('favicon')?.setValue(event.path)
  }

  setPaymentGateways(paymentGateway: string) {
    this.paymentGateways.includes(paymentGateway)
      ? this.paymentGateways = this.paymentGateways.filter((item: string) => item != paymentGateway)
      : this.paymentGateways.push(paymentGateway)
  }

  onSubmit() {
    this.form.get('paymentGateway')?.setValue(this.paymentGateways)
    this.form.get('languages')?.setValue(this.languages)

    if (!this.form.valid) {
      this.HotToastService.error('Please fill all required fields')
      this.isSubmitted = true
      return
    }

    this.AppSettingsService.updateGeneralSettings({
      colors: {
        primary: this.form.get('primary')?.value,
        secondary: this.form.get('secondary')?.value,
        star: this.form.get('star')?.value,
        label: this.form.get('label')?.value,
        text: this.form.get('text')?.value,
      },
      toast: {
        success: this.form.get('toastSuccess')?.value,
        error: this.form.get('toastError')?.value,
        info: this.form.get('toastInfo')?.value
      },
      currency: this.form.get('currency')?.value,
      fonts: { family: this.form.get('fontFamily')?.value },
      itemsPerPage: this.form.get('itemsPerPage')?.value,
      isOutOfStock: this.form.get('isOutOfStock')?.value,
      isNotifyStock: this.form.get('isNotifyStock')?.value,
      refid: this.refid,
      primaryAddress: this.form.get('primaryAddress')?.value,
      gstNo: this.form.get('gstNo')?.value,
      email: this.form.get('email')?.value,
      countryCode: this.form.get('countryCode')?.value,
      companyName: this.form.get('companyName')?.value,
      mobile: this.form.get('mobile')?.value,
      primaryLang: this.form.get('primaryLang')?.value,
      isMultiLang: this.form.get('isMultiLang')?.value,
      languages: this.form.get('languages')?.value,
      defaultImage: this.form.get('defaultImage')?.value,
      name: this.form.get('name')?.value,
      domain: this.form.get('domain')?.value,
      description: this.form.get('description')?.value,
      shippingCost: this.form.get('shippingCost')?.value,
      logo: this.form.get('logo')?.value,
      paymentGateway: this.form.get('paymentGateway')?.value,
      favicon: this.form.get('favicon')?.value,
      isStoreLive: this.form.get('isStoreLive')?.value,
      notes: { packingSlip: this.form.get('packingSlip')?.value },
      buttons: {
        cart: this.form.get('cartButton')?.value,
        stock: this.form.get('stockButton')?.value,
        notify: this.form.get('notifyButton')?.value
      }
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.getSettings()
        } else {
          this.HotToastService.error(res?.message)
        }
      },
      error: (err) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }
}
