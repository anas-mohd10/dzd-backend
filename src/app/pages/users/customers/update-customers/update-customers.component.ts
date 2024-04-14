
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-update-customers',
  templateUrl: './update-customers.component.html',
  styleUrls: ['./update-customers.component.scss']
})
export class UpdateCustomersComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ElementRef;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  customersForm: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean = true;
  customerData: any;
  slug: any;
  uniqueNum: boolean;
  addresses: Array<any> = []
  address: any
  validBtn: boolean = false
  selectedID: any = ''
  selectedAddress: string = ''

  isAddressSubmitted: boolean = false
  addressForm: FormGroup
  defaultAddress: FormControl = new FormControl('')
  isEditAddress: boolean = false
  addressDetails: any = {}
  focusedAddress: any = {}
  modalRef?: BsModalRef
  deleteModalRef?: BsModalRef
  walletRef?: BsModalRef
  transactions: Array<any> = []
  amount: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)])
  description: FormControl = new FormControl('')
  isWalletSubmitted: boolean = false
  settings: any = {}
  referralCode: FormControl = new FormControl('')
  transactionType: FormControl = new FormControl('all')
  loyaltyRef?: BsModalRef
  historyItems: Array<any> = []
  points: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)])
  loyaltyDescription: FormControl = new FormControl('')
  isLoyaltySubmitted: boolean = false
  loyalityType: FormControl = new FormControl('all')

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService,
    private Toast: HotToastService,
    private BsModalService: BsModalService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.params['id'] || ''
    this.getCustomerDetails()
    this.getAddress()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })
  }

  initForm() {
    this.customersForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]],
      isActive: ['true', Validators.required],
    });

    this.addressForm = new FormGroup({
      name: new FormControl(''),
      countryCode: new FormControl(''),
      mobile: new FormControl('', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]{10}$")]),
      firstlane: new FormControl('', Validators.required),
      secondlane: new FormControl(''),
      city: new FormControl('', Validators.required),
      area: new FormControl(''),
      landmark: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      pincode: new FormControl(''),
      state: new FormControl('', Validators.required),
      lat: new FormControl(''),
      lng: new FormControl(''),
    })
  }

  get cf() {
    return this.customersForm.controls;
  }

  get addressControls() {
    return this.addressForm.controls;
  }

  openWallet(template: TemplateRef<any>) {
    this.walletRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
    this.getTransactions()
  }

  closeWallet() {
    this.walletRef?.hide()
    this.amount?.reset()
    this.description?.reset()
    this.isWalletSubmitted = false
  }

  openLoyalty(template: TemplateRef<any>) {
    this.loyaltyRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
    this.getHistory()
  }

  closeLoyalty() {
    this.loyaltyRef?.hide()
    this.points?.reset()
    this.loyaltyDescription?.reset()
    this.isLoyaltySubmitted = false
  }

  getHistory() {
    this.customerService.getLoyaltyTransactions(this.customerData?.slug, this.loyalityType?.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.historyItems = res?.result
        }
      }
    })
  }

  getTransactions() {
    this.customerService.getTransactions(this.customerData?.slug, this.transactionType.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.transactions = res?.result
        }
      }
    })
  }

  addToWallet(type: string) {
    if (!this.amount.valid) {
      this.isWalletSubmitted = true
      return
    }

    this.customerService.createTransaction({
      amount: this.amount.value,
      user: this.customerData?._id,
      description: this.description.value,
      type: type
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.amount?.reset()
          this.description?.reset()
          this.getTransactions()
          this.getCustomerDetails()
          this.isWalletSubmitted = false
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.message)
      }
    })
  }

  open(template: TemplateRef<any>, address: any) {
    if (address) {
      this.isEditAddress = true
      this.customerService.getAddressDetails(address).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.addressDetails = res?.result
          for (let _key of Object.keys(res?.result)) {
            this.addressForm.get(_key)?.setValue(res?.result[_key])
            this.addressForm.get('lat')?.setValue(res?.result?.coordinates?.lat)
            this.addressForm.get('lng')?.setValue(res?.result?.coordinates?.lng)
            this.ChangeDetectorRef.markForCheck()
          }
        }
      })
    }
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  close() {
    this.modalRef?.hide()
    this.addressForm.reset()
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  checkEmail(e: any) {
    const data = { email: '' }
    if (e.value) {
      data.email = e.value
    }
    this.customerService.getCustomerByMail(data).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueEmail = false
        this.Toast.error("Email already exists")
      } else {
        this.uniqueEmail = true
      }
    })
  }

  validateNumber(e: any) {
    const data = { mobile: '' }
    if (e.value) data.mobile = e.value

    this.customerService.getCustomerByNum(data).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueNum = false
        this.Toast.error("Mobile number already exists")
      } else {
        this.uniqueNum = true
      }
    })
  }

  addAddress() {
    if (!this.addressForm.valid) {
      this.isAddressSubmitted = true
      return
    }

    let payload = {
      ...this.addressForm?.value,
      coordinates: {
        lat: this.addressForm?.get('lat')?.value,
        lng: this.addressForm?.get('lng')?.value,
      },
      customer: this.customerData?._id
    }

    if (!this.isEditAddress) {
      this.customerService.addAddress(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.getAddress()
          this.addressForm.reset()
          this.Toast.success(res?.message)
          this.modalRef?.hide()
        } else {
          this.Toast.error(res?.message)
        }
      })
    } else {
      payload['refid'] = this.addressDetails?.refid
      this.customerService.updateCustomerAddress(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.getAddress()
          this.addressForm.reset()
          this.Toast.success(res?.message)
          this.modalRef?.hide()
        } else {
          this.Toast.error(res?.message)
        }
      })
    }
  }

  getAddress() {
    this.customerService.getAddress({ userid: this.slug }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.addresses = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  editAddress(refid: any) {
    this.isEditAddress = true
    this.customerService.getAddressDetails(refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.addressDetails = res?.result
        for (let _key of Object.keys(res?.result)) {
          this.addressForm.get(_key)?.setValue(res?.result[_key])
          this.addressForm.get('lat')?.setValue(res?.result?.coordinates?.lat)
          this.addressForm.get('lng')?.setValue(res?.result?.coordinates?.lng)
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  setDefaultAddress(refid: any) {
    this.customerService.updateDefaultAddress(refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getAddress()
        this.Toast.success(res?.message)
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  selectAddress(refid: any) {
    this.selectedAddress = refid
  }

  confirm() {
    this.customerService.deleteAddress(this.selectedAddress).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getAddress()
        this.Toast.success(res?.message)
        this.ChangeDetectorRef.markForCheck()
      }
    })
    this.deleteModalRef?.hide()
  }

  decline() {
    this.deleteModalRef?.hide()
  }

  openModal(template: TemplateRef<any>, address: any) {
    this.deleteModalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    this.selectedAddress = address
  }

  getCustomerDetails() {
    this.customerService.getCustomerDetails(this.slug).subscribe((res: any) => {
      this.customerData = res?.result
      this.referralCode.setValue(res?.result?.referralCode)
      this.referralCode.disable()
      this.customersForm.get("name")?.setValue(this.customerData.name)
      this.customersForm.get("mobile")?.setValue(this.customerData.mobile)
      this.customersForm.get("email")?.setValue(this.customerData.email)
      this.customersForm.get("countryCode")?.setValue(this.customerData.countryCode)
      this.customersForm.get("isActive")?.setValue(this.customerData.isActive)
      this.customersForm.get("walletBalance")?.setValue(this.customerData.walletBalance)
      this.ChangeDetectorRef.markForCheck()
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCustomer();
    } else {
      this.addCustomer();
    }
  }

  updateCustomer() {
    if (!this.customersForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }

    let data = {
      name: this.customersForm.get("name")?.value,
      email: this.customersForm.get("email")?.value,
      countryCode: this.customersForm.get("countryCode")?.value,
      mobile: this.customersForm.get("mobile")?.value,
      walletBalance: this.customersForm.get("walletBalance")?.value,
      isActive: this.customersForm.get("isActive")?.value,
    }
    this.customerService.updateCustomer(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.Toast.error(res?.message);
      } else if (res.errorCode == 0) {
        this.Toast.success(res?.message);
        this.router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
      }
    })
  }

  addCustomer() { }
}
