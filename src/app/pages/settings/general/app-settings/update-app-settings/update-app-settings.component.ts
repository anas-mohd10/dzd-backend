import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { validators } from 'src/app/config/constants/mobile-validators';
import { HttpClient } from '@angular/common/http';
import { defaultCountries } from 'src/app/config/constants/default-countries';

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
  offerCriteria: boolean
  priceOptions = [
    { value: true, label: 'MRP / Cut Price' },
    { value: false, label: 'Additional Discount' }
  ];
  // currencies: Array<any> = ['INR', 'USD', 'EUR', 'AED', 'IQD', 'دينار'],
  currencies: Array<any> = [
    { label: 'INR', value: 'INR' },
    { label: 'Rupee', value: '₹' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'AED', value: 'AED' },
    { label: 'IQD - EN', value: 'IQD' },
    { label: 'IQD - AR', value: 'دينار' }
  ]
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
      { class: 'Sen', name: 'Sen' },
    ]
  };
  placeHolders: Array<string> = []
  placeHolder: FormControl = new FormControl('', Validators.required)
  defaultCountries: Array<any> = defaultCountries
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
  defaultSort: Array<any> = [
    {
      label: "Low to High",
      value: "0"
    },
    {
      label: "High to Low",
      value: "1"
    },
    {
      label: "Popularity",
      value: "8"
    },
    {
      label: "A to Z",
      value: "5"
    },
    {
      label: "Z to A",
      value: "4"
    },
    {
      label: "Newest to Oldest",
      value: "2"
    },
    {
      label: "Oldest to Newest",
      value: "3"
    }
  ];
  logo?: string;
  darkLogo?: string;
  favicon?: string;
  defaultBanner?: string;
  defaultMobileBanner?: string;
  primary: string = '';
  modalRef?: BsModalRef;
  discardModalRef?: BsModalRef;
  secondary: string = '';
  storeStatus: boolean = true;
  defaultImage: string = '';
  languageItems: Array<any> = [
    { lang: 'English', langCode: 'en', regionCodes: ['US'] },
    { lang: 'Arabic', langCode: 'ar', regionCodes: ['AE', 'IQ'] }
  ];
  languages: Array<{
    lang: string, langCode: string, regionCodes: string[]
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

  toggleLanguages(language: { lang: string, langCode: string, regionCodes: string[] }) {
    let isExists = this.languages.some((item: { lang: string, langCode: string, regionCodes: string[] }) => item.lang == language.lang)
    if (isExists) {
      if (this.form.get('primaryLang')?.value == language.langCode) {
        this.HotToastService.error('Primary language cannot be removed')
      } else {
        this.languages = this.languages.filter((item: { lang: string, langCode: string, regionCodes: string[] }) => item.lang != language.lang)
        this.HotToastService.info('Language removed successfully')
      }
    } else {
      this.languages.push(language)
      this.HotToastService.success('Language added successfully')
    }
  }

  addPlaceholder() {
    if (this.currentlyEditingPlaceholder) {
      this.savePlaceholder();
    } else {
      const newPlaceholder = this.placeHolder.value.trim();
      if (newPlaceholder && !this.placeHolders.includes(newPlaceholder)) {
        this.placeHolders.push(newPlaceholder);
        this.HotToastService.success('Placeholder added successfully');
      }
    }

    this.placeHolder.setValue('');
    this.currentlyEditingPlaceholder = null;
    this.ChangeDetectorRef.markForCheck();
  }


  removePlaceholder(placeHolder: string) {
    this.placeHolders = this.placeHolders.filter((item: string) => item != placeHolder)
    this.HotToastService.success('Placeholder removed successfully')
    this.ChangeDetectorRef.markForCheck()
  }

  currentlyEditingPlaceholder: string | null = null;

  editPlaceholder(placeHolder: string) {
    if (this.currentlyEditingPlaceholder === placeHolder) {
      this.currentlyEditingPlaceholder = null;
      this.placeHolder.setValue('');
    } else {
      this.currentlyEditingPlaceholder = placeHolder;
      this.placeHolder.setValue(placeHolder);
    }
    this.ChangeDetectorRef.markForCheck();
  }

  savePlaceholder() {
    if (this.currentlyEditingPlaceholder && this.placeHolder.valid) {
      const index = this.placeHolders.findIndex(p => p === this.currentlyEditingPlaceholder);
      if (index !== -1) {
        this.placeHolders[index] = this.placeHolder.value;
        this.HotToastService.success('Placeholder updated successfully');
      }

      this.currentlyEditingPlaceholder = null;
      this.placeHolder.setValue('');
      this.ChangeDetectorRef.markForCheck();
    }
  }

  languageExists(language: { lang: string, langCode: string, regionCodes: string[] }) {
    let isExists = this.languages.some((item: { lang: string, langCode: string, regionCodes: string[] }) => item.lang == language.lang)
    return isExists
  }

  ngOnInit(): void {
    this.initform();
    this.refid = this.ActivatedRoute.snapshot.queryParams.id || '1';
    this.getSettings();

    this.primary = '#00BDAB'
    this.secondary = '#aaaaaa'
    this.form.get('primary')?.setValue('#00BDAB')

    // Add scroll handling for #addOnSettings
    if (window.location.hash === '#addOnSettings') {
      setTimeout(() => {
        const addOnSettingsElement = document.getElementById('addOnSettings');
        if (addOnSettingsElement) {
          addOnSettingsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Delay to ensure content is loaded
    }
  }

  get formControls() {
    return this.form.controls
  }

  getSettings() {
    this.AppSettingsService.getSettings().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.logo = res?.result?.logo
        this.darkLogo = res?.result?.darkLogo
        this.paymentGateways = res?.result?.paymentGateway
        this.favicon = res?.result?.favicon
        this.defaultBanner = res?.result?.defaultBanner
        this.defaultMobileBanner = res?.result?.defaultMobileBanner
        this.offerCriteria = res?.result?.offerCriteria
        this.form.get('offerCriteria')?.setValue(res?.result?.offerCriteria);
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
        this.form.get('defaultSort')?.setValue(res?.result?.defaultSort)
        this.form.get('email')?.setValue(res?.result?.email)
        this.form.get('gstNo')?.setValue(res?.result?.gstNo)
        this.form.get('countryCode')?.setValue(res?.result?.countryCode)
        this.form.get('country')?.setValue(res?.result?.country)
        this.form.get('mobile')?.setValue(res?.result?.mobile)
        this.form.get('primaryAddress')?.setValue(res?.result?.primaryAddress)
        this.form.get('paymentGateway')?.setValue(res?.result?.paymentGateway)
        this.form.get('currency')?.setValue(res?.result?.currency)
        this.form.get('isStoreLive')?.setValue(res?.result?.isStoreLive)
        this.form.get('companyName')?.setValue(res?.result?.companyName)
        this.form.get('domain')?.setValue(res?.result?.domain)
        this.form.get('name')?.setValue(res?.result?.name)
        this.form.get('adminLogo')?.setValue(res?.result?.adminLogo)
        this.form.get('adminFavicon')?.setValue(res?.result?.adminFavicon)
        this.form.get('defaultImage')?.setValue(res?.result?.defaultImage)
        this.defaultImage = res?.result?.defaultImage
        this.form.get('description')?.setValue(res?.result?.description)
        this.form.get('addOnLabel')?.setValue(res?.result?.addOnLabel)
        this.form.get('isAddOnLabelEnabled')?.setValue(res?.result?.isAddOnLabelEnabled)
        this.form.get('isAddOnEnabled')?.setValue(res?.result?.isAddOnEnabled)
        this.form.get('itemsPerPage')?.setValue(res?.result?.itemsPerPage)
        this.form.get('isOutOfStock')?.setValue(res?.result?.isOutOfStock)
        this.form.get('isPushNotification')?.setValue(res?.result?.isPushNotification)
        this.form.get('isTax')?.setValue(res?.result?.isTax)
        this.form.get('isShippingTaxable')?.setValue(res?.result?.isShippingTaxable)
        this.form.get('isIndex')?.setValue(res?.result?.isIndex)
        this.form.get('isDefaultChargesEnabled')?.setValue(res?.result?.isDefaultChargesEnabled)
        this.form.get('isDeliveryLocationEnabled')?.setValue(res?.result?.isDeliveryLocationEnabled)
        this.form.get('isNotifyStock')?.setValue(res?.result?.isNotifyStock)
        this.form.get('packingSlip')?.setValue(res?.result?.notes?.packingSlip)
        this.form.get('defaultShippingCharge')?.setValue(res?.result?.defaultShippingCharge)
        this.form.get('defaultMinimumCartAmount')?.setValue(res?.result?.defaultMinimumCartAmount)
        this.form.get('cartButton')?.setValue(res?.result?.buttons?.cart)
        this.form.get('stockButton')?.setValue(res?.result?.buttons?.stock)
        this.form.get('notifyButton')?.setValue(res?.result?.buttons?.notify)
        this.form.get('shippingCost')?.setValue(res?.result?.shippingCost)
        this.form.get('logo')?.setValue(res?.result?.logo)
        this.form.get('darkLogo')?.setValue(res?.result?.darkLogo)
        this.form.get('favicon')?.setValue(res?.result?.favicon)
        this.form.get('defaultBanner')?.setValue(res?.result?.defaultBanner)
        this.form.get('defaultMobileBanner')?.setValue(res?.result?.defaultMobileBanner)
        this.form.get('verifyNumberWithTwilio')?.setValue(res?.result?.verifyNumberWithTwilio)
        this.form.get('deliverSlotBufferTime')?.setValue(res?.result?.deliverSlotBufferTime || 60);
        this.form.get('isVoucherEnabled')?.setValue(res?.result?.isVoucherEnabled);
        this.form.get('isRelatedProductsCart')?.setValue(res?.result?.isRelatedProductsCart);
        this.form.get('isPlpPagination')?.setValue(res?.result?.isPlpPagination);
        this.form.get('isBillingAddressEnabled')?.setValue(res?.result?.isBillingAddressEnabled)
        this.form.get('clarityAppId')?.setValue(res?.result?.clarityAppId)

        this.form.get('commaSeparation')?.setValue(
          res?.result?.commaSeparation ?? true  // Use nullish coalescing for default
        );
        this.form.get('currencyLocation')?.setValue(
          res?.result?.currencyLocation ?? 'before'
        );
        this.form.get('decimalValues')?.setValue(
          Number(res?.result?.decimalValues)
        );
        this.placeHolders = res?.result?.placeHolders

        for (let lang of res?.result?.languages) {
          let isExists = this.languages.some((item: { lang: string, langCode: string, regionCodes: string[] }) => item.lang == lang?.lang)
          !isExists && this.languages.push({ lang: lang?.lang, langCode: lang?.langCode, regionCodes: lang?.regionCodes })
        }
        for (let language of this.languageItems) {
          let isExists = this.languages.some((item: { lang: string, langCode: string, regionCodes: string[] }) => item.lang == language?.lang)
          !isExists && this.languages.push({ lang: language?.lang, langCode: language?.langCode, regionCodes: language?.regionCodes })
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

  handleAdminMedia(event: any, mediaType: string) {
    switch (mediaType) {
      case 'logo':
        this.form.get('adminLogo')?.setValue(event.path)
        break;
      case 'favicon':
        this.form.get('adminFavicon')?.setValue(event.path)
    }
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
      offerCriteria: [false],
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
      defaultSort: ['', Validators.required],
      name: ['', Validators.required],
      companyName: [''],
      country: [''],
      domain: ['', Validators.required],
      description: ['', Validators.required],
      primaryLang: [''],
      isMultiLang: ['false'],
      languages: [[]],
      packingSlip: [''],
      isOutOfStock: ['false'],
      addOnLabel:['Add On'],
      isAddOnLabelEnabled:['false'],
      isAddOnEnabled: ['false'],
      isTax: ['false'],
      isShippingTaxable: ['false'], // Add this new control
      isIndex: ['false'],
      isDefaultChargesEnabled: ['false'],
      isDeliveryLocationEnabled: ['false'],
      isStoreLive: ['true'],
      defaultImage: [''],
      isNotifyStock: ['false'],
      adminLogo: [''],
      isPushNotification: ['true'],
      adminFavicon: [''],
      commaSeparation: [true],
      currencyLocation: ['before'],
      decimalValues: [  ],
      cartButton: ['Add to Cart', Validators.required],
      stockButton: ['Out of Stock', Validators.required],
      notifyButton: ['Notify Me', Validators.required],
      logo: ['', Validators.required],
      darkLogo: [''],
      favicon: ['', Validators.required],
      defaultBanner: [''],
      defaultMobileBanner: [''],
      defaultShippingCharge: ['0'],
      defaultMinimumCartAmount: ['0'],
      deliverSlotBufferTime: [60],
      verifyNumberWithTwilio: ['false'],
      isVoucherEnabled: ['false'],
      isRelatedProductsCart:['false'],
      isBillingAddressEnabled: ['false'],
      isPlpPagination: ['false'],
      clarityAppId: ['']
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

  toggleAddOnItems(event: { toggleState: boolean, switchId: string }) {
    this.form.get(event.switchId)?.setValue(event.toggleState)
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

  handleStoreDarkLogo(event: any) {
    this.form.get('darkLogo')?.setValue(event.path)
  }


  handleStoreFavicon(event: any) {
    this.form.get('favicon')?.setValue(event.path)
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'logo':
        this.form.get('logo')?.setValue('');
        this.logo = '';
        break;
        case 'darkLogo':
        this.form.get('darkLogo')?.setValue('');
        this.darkLogo = '';
        break;
      case 'favicon':
        this.form.get('favicon')?.setValue('');
        this.favicon = '';
        break;
      case 'defaultBanner':
        this.form.get('defaultBanner')?.setValue('');
        this.defaultBanner = '';
        break;
      case 'defaultMobileBanner':
        this.form.get('defaultMobileBanner')?.setValue('');
        this.defaultMobileBanner = '';
        break;
    }
  }

  handleDefaultBanner(event: any) {
    this.form.get('defaultBanner')?.setValue(event.path)
    this.defaultBanner = event.path
  }

  handleDefaultMobileBanner(event: any) {
    this.form.get('defaultMobileBanner')?.setValue(event.path)
    this.defaultMobileBanner = event.path
  }

  setPaymentGateways(paymentGateway: string) {
    this.paymentGateways.includes(paymentGateway)
      ? this.paymentGateways = this.paymentGateways.filter((item: string) => item != paymentGateway)
      : this.paymentGateways.push(paymentGateway)
  }

  onSubmit() {
    console.log("this.form", this.form.get('languages'))
    this.form.get('paymentGateway')?.setValue(this.paymentGateways)
    this.form.get('languages')?.setValue(this.languages)

    if (!this.form.valid) {
      this.HotToastService.error('Please fill all required fields')
      this.isSubmitted = true
      return
    }
    console.log("this.form", this.form.get('verifyNumberWithTwilio')?.value)
    this.AppSettingsService.updateGeneralSettings({
      colors: {
        primary: this.form.get('primary')?.value,
        secondary: this.form.get('secondary')?.value,
        star: this.form.get('star')?.value,
        label: this.form.get('label')?.value,
        text: this.form.get('text')?.value,
      },
      placeHolders: this.placeHolders,
      toast: {
        success: this.form.get('toastSuccess')?.value,
        error: this.form.get('toastError')?.value,
        info: this.form.get('toastInfo')?.value
      },
      currency: this.form.get('currency')?.value,
      fonts: { family: this.form.get('fontFamily')?.value },
      defaultSort: this.form.get('defaultSort')?.value,
      itemsPerPage: this.form.get('itemsPerPage')?.value,
      isOutOfStock: this.form.get('isOutOfStock')?.value,
      isTax: this.form.get('isTax')?.value,
      isIndex: this.form.get('isIndex')?.value,
      isDefaultChargesEnabled: this.form.get('isDefaultChargesEnabled')?.value,
      isDeliveryLocationEnabled: this.form.get('isDeliveryLocationEnabled')?.value,
      isNotifyStock: this.form.get('isNotifyStock')?.value,
      refid: this.refid,
      primaryAddress: this.form.get('primaryAddress')?.value,
      gstNo: this.form.get('gstNo')?.value,
      email: this.form.get('email')?.value,
      countryCode: this.form.get('countryCode')?.value,
      country: this.form.get('country')?.value,
      companyName: this.form.get('companyName')?.value,
      mobile: this.form.get('mobile')?.value,
      isShippingTaxable: this.form.get('isShippingTaxable')?.value,
      primaryLang: this.form.get('primaryLang')?.value,
      isPushNotification: this.form.get('isPushNotification')?.value,
      isMultiLang: this.form.get('isMultiLang')?.value,
      languages: this.form.get('languages')?.value,
      defaultImage: this.form.get('defaultImage')?.value,
      isAddOnLabelEnabled: this.form.get('isAddOnLabelEnabled')?.value,
      addOnLabel: this.form.get('addOnLabel')?.value,
      isAddOnEnabled: this.form.get('isAddOnEnabled')?.value,
      name: this.form.get('name')?.value,
      adminLogo: this.form.get('adminLogo')?.value,
      adminFavicon: this.form.get('adminFavicon')?.value,
      domain: this.form.get('domain')?.value,
      description: this.form.get('description')?.value,
      shippingCost: this.form.get('shippingCost')?.value,
      logo: this.form.get('logo')?.value,
      darkLogo: this.form.get('darkLogo')?.value,
      paymentGateway: this.form.get('paymentGateway')?.value,
      favicon: this.form.get('favicon')?.value,
      defaultBanner: this.form.get('defaultBanner')?.value,
      defaultMobileBanner: this.form.get('defaultMobileBanner')?.value,
      defaultShippingCharge: this.form.get('defaultShippingCharge')?.value,
      defaultMinimumCartAmount: this.form.get('defaultMinimumCartAmount')?.value,
      offerCriteria: this.form.get('offerCriteria')?.value,
      isStoreLive: this.form.get('isStoreLive')?.value,
      notes: { packingSlip: this.form.get('packingSlip')?.value },
      deliverSlotBufferTime: this.form.get('deliverSlotBufferTime')?.value || 60,
      commaSeparation: Boolean(this.form.get('commaSeparation')?.value),
      currencyLocation: this.form.get('currencyLocation')?.value,
      decimalValues: Number(this.form.get('decimalValues')?.value),
      verifyNumberWithTwilio: this.form.get('verifyNumberWithTwilio')?.value,
      isVoucherEnabled: this.form.get('isVoucherEnabled')?.value,
      isRelatedProductsCart: this.form.get('isRelatedProductsCart')?.value,
      isPlpPagination: this.form.get('isPlpPagination')?.value,
      isBillingAddressEnabled: this.form.get('isBillingAddressEnabled')?.value,
      clarityAppId:this.form.get('clarityAppId')?.value,
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
