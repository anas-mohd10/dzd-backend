import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { validators } from 'src/app/config/constants/mobile-validators';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { Country, ICountry, State, IState, City, ICity } from 'country-state-city'
import { debounceTime } from 'rxjs/operators';
import { FormSettingsService } from 'src/app/includes/services/form-settings.service';
import { addressFieldsMap, FieldMap as ImportedFieldMap } from 'src/app/pages/settings/general/form-settings/fieldsMap';
import { LocationService } from 'src/app/includes/services/location.service';

interface CustomerOrder {
  orderNo: string;
  orderStatus: string;
  createdAt: string;
  total: string;
  paymentMethod: string;
  source: string;
  paymentStatus: string;
}

interface CustomerOrderDetails {
  totalResults: number | 0;
  totalPages: number | 1;
  orders: Array<CustomerOrder>;
}

interface LoginActivity {
  userAgent: string;
  loginId: string;
  loginIp: string;
  logoutIp: string;
  loginTimezone: string;
  logoutTimezone: string;
  loginTime: string;
  logoutTime: string;
}

@Component({
  selector: 'app-update-customers',
  templateUrl: './update-customers.component.html',
  styleUrls: ['./update-customers.component.scss'],
})
export class UpdateCustomersComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ElementRef;
  savedCardsModal?: BsModalRef;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;
  form: FormGroup;
  isSubmitted = false;
  isEmailExists: boolean = false;
  isPhoneExists: boolean = false;
  customerDetails: any;
  slug: any;
  addresses: Array<any> = [];
  address: any;
  validBtn: boolean = false;
  selectedID: any = '';
  selectedAddress: string = '';
  isAddressSubmitted: boolean = false;
  addressForm: FormGroup = new FormGroup({});
  defaultAddress: FormControl = new FormControl('');
  isEditAddress: boolean = false;
  addressDetails: any = {};
  focusedAddress: any = {};
  modalRef?: BsModalRef;
  deleteModalRef?: BsModalRef;
  walletRef?: BsModalRef;
  transactions: Array<any> = [];
  amount: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);
  description: FormControl = new FormControl('Transaction successful! Your wallet has been updated.');
  isWalletSubmitted: boolean = false;
  settings: any = {};
  referralCode: FormControl = new FormControl('');
  transactionType: FormControl = new FormControl('all');
  loyaltyRef?: BsModalRef;
  historyItems: Array<any> = [];
  points: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/),]);
  loyaltyDescription: FormControl = new FormControl('');
  isLoyaltySubmitted: boolean = false;
  savedCards: Array<any> = [];
  loyalityType: FormControl = new FormControl('all');
  page: number = 1;
  limit: number = 20;
  orders: Array<any> = [];
  customerOrderDetails: CustomerOrderDetails = { totalResults: 0, totalPages: 0, orders: [], };
  ordersRef?: BsModalRef;
  successOrders: Array<string> = ['PLACED', 'SHIPPED', 'PARTIAL PROCESSED', 'OUT FOR DELIVERY', 'DELIVERED', 'PACKED'];
  countries: Array<any> = [];
  states: Array<any> = [];
  cities: Array<any> = [];
  acceptedOrders: Array<string> = ['ACCEPTED'];
  cancelledOrders: Array<string> = ['CANCELLED', 'PENDING', 'FAILED'];
  previousCountry: string = '';
  previousState: string = '';
  loginRef?: BsModalRef;
  loginActivities: Array<LoginActivity> = [];
  manageWalletRef?: BsModalRef;

  walletKeyword: FormControl = new FormControl('');
  walletPageIndex: number = 1;
  walletPageSize: number = 10;
  walletTotalPages: number = 1;
  walletTotalResults: number = 0;
  addressFields: ImportedFieldMap[] = addressFieldsMap
  addressFieldsMap: { [key: string]: ImportedFieldMap } = {}

  constructor(
    private FormBuilder: FormBuilder,
    private OrdersService: OrdersService,
    private CustomersService: CustomersService,
    private ActivatedRoute: ActivatedRoute,
    private LocationService: LocationService,
    private FormSettingsService: FormSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Router: Router,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private AppSettingsService: AppSettingsService
  ) {
    this.walletKeyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value: any) => {
        this.getTransactions();
      });
  }

  //Function to open the saved cards modal
  openSavedCards(template: TemplateRef<any>) {
    this.savedCardsModal = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
    });
  }

  closeSavedCards() {
    this.savedCardsModal?.hide();
  }

  ngOnInit(): void {
    this.initForm();
    this.managePage();
    this.slug = this.ActivatedRoute.snapshot.params['id'] || '';
    this.getCustomerDetails();
    this.getAddress();

    this.fetchCountries();

    this.FormSettingsService.getFormSettings('address').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.addressFields = res?.result?.fields;
          // Dynamically set the address form values based on the address items
          if (this.addressFields?.length > 0) {
            this.addressFields.forEach((field: ImportedFieldMap) => {
              const isRequired: ValidatorFn[] = field.isRequired == true ? [Validators.required] : [];
              this.addressFieldsMap[field.fieldMap] = field;
              let defaultValue: string | undefined = ""
              if (field.fieldMap == "countryCode") {
                defaultValue = this.settings?.countryCode || "+971"
              } else if (field.fieldMap == "type") {
                defaultValue = "Home"
              }
              this.addressForm.addControl(field.fieldMap, new FormControl(defaultValue, isRequired));
            });
          }
          this.addressForm.addControl("isDefault", new FormControl(false));
          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err: any) => { }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
        }
      }
    );
  }

  fetchCountries() {
    this.LocationService.findCountries().subscribe({
      next: (response: any) => {
        if (response?.errorCode == 0) {
          this.countries = response?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(response.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    });
  }

  loadStates(countryId?: string, actionType?: string) {
    if (actionType == 'add') {
      // Clear existing states and cities when country changes
      this.states = [];
      this.cities = [];

      // Reset state and city form controls
      this.addressForm.patchValue({ state: '', city: '' });
    }

    let country: string | undefined = ''
    if (countryId == '') {
      let countryItem: any = this.countries.find((country: any) => country?.name == this.addressForm.get('country')?.value)
      country = countryItem?._id
    } else {
      country = countryId
    }

    this.LocationService.findStates(country).subscribe({
      next: (response: any) => {
        if (response?.errorCode == 0) {
          this.states = response.result;

          if (actionType === 'update') {
            const stateDoc: any = response.result.find((state: any) => state.name === this.addressForm.get('state')?.value);
            this.loadCities(stateDoc?._id, 'update');
          }

          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(response.message);
        }
      },
      error: (err) => console.error('Error loading states:', err)
    });
  }

  loadCities(stateId?: string, actionType?: string) {
    const countryDoc: any = this.countries.find((country: any) => country?.name == this.addressForm.get('country')?.value);
    const stateDoc: any = this.states.find((state: any) => state?.name == this.addressForm.get('state')?.value);
    this.LocationService.findCities(countryDoc?._id, stateDoc?._id).subscribe({
      next: (response: any) => {
        if (response?.errorCode == 0) {
          this.cities = response.result;

          if (actionType == 'add') {
            this.addressForm.patchValue({ city: this.cities[0].name });
          }

          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err) => console.error('Error loading cities:', err)
    });
  }

  addressValidationFunction(fieldMap: string): boolean {
    const field = this.addressFieldsMap[fieldMap];
    if (!field) return false;

    const control = this.addressForm.get(fieldMap);
    if (!control) return false;

    const isRequired = field.isRequired;
    const isTouched = control.touched;
    const isSubmitted = this.isAddressSubmitted;
    const hasError = control.errors;

    // If field is not required, only show validation if it has errors
    if (!isRequired) {
      return (isTouched || isSubmitted) && !!hasError;
    }

    // For required fields, show validation if touched/submitted and has errors
    return (isTouched || isSubmitted) && !!hasError;
  }

  getFieldErrorMessage(fieldMap: string): string {
    const control = this.addressForm.get(fieldMap);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['pattern']) return 'Please enter a valid value';
    if (errors['email']) return 'Please enter a valid email';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    return 'Invalid input';
  }

  isFieldRequired(fieldMap: string): boolean {
    return this.addressFieldsMap[fieldMap]?.isRequired || false;
  }

  getFieldLabel(fieldMap: string): string {
    return this.addressFieldsMap[fieldMap]?.label || fieldMap;
  }

  getFieldTitle(fieldMap: string): string {
    return this.addressFieldsMap[fieldMap]?.title || fieldMap;
  }

  getFieldPlaceholder(fieldMap: string): string {
    return this.addressFieldsMap[fieldMap]?.placeholder || `Enter ${this.getFieldLabel(fieldMap).toLowerCase()}`;
  }

  getFieldType(fieldMap: string): string {
    return this.addressFieldsMap[fieldMap]?.type || 'text';
  }

  getFieldOptions(fieldMap: string): any[] {
    return this.addressFieldsMap[fieldMap]?.options || [];
  }

  checkRequiredField(fieldMap: string): boolean {
    return this.addressFieldsMap[fieldMap]?.isRequired || false;
  }

  checkVisibleField(fieldMap: string): boolean {
    return this.addressFieldsMap[fieldMap]?.isVisible || false;
  }

  getFieldValidationPattern(fieldMap: string): string {
    return this.addressFieldsMap[fieldMap]?.validationPattern || '';
  }

  deleteCustomer() {
    this.CustomersService.deleteCustomer(this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get('countryCode')?.value) {
      case '+91':
        this.updateMobilePattern(`^[0-9]{${validators.india.validation.maximum}}$`);
        break;
      case '+971':
        this.updateMobilePattern(`^[0-9]{${validators.uae.validation.maximum}}$`);
        break;
      case '+964':
        this.updateMobilePattern(`^[0-9]{${validators.iraq.validation.maximum}}$`);
        break;
    }
  }

  updateAddressMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.addressForm.get('mobile')?.setValidators(newValidators);
    this.addressForm.get('mobile')?.updateValueAndValidity();
  }

  handleAddressMobilePattern() {
    switch (this.addressForm.get('countryCode')?.value) {
      case '+91':
        this.updateAddressMobilePattern(`^[0-9]{${validators.india.validation.maximum}}$`);
        break;
      case '+971':
        this.updateAddressMobilePattern(`^[0-9]{${validators.uae.validation.maximum}}$`);
        break;
      case '+964':
        this.updateAddressMobilePattern(`^[0-9]{${validators.iraq.validation.maximum}}$`);
        break;
    }
  }

  openLoginActivities(template: TemplateRef<any>) {
    this.loginRef = this.BsModalService.show(template, { class: 'modal-dialog-centered modal-lg', ignoreBackdropClick: true, });
  }

  openCustomerOrders(template: TemplateRef<any>) {
    this.ordersRef = this.BsModalService.show(template, { class: 'modal-dialog-centered modal-lg', ignoreBackdropClick: true, });
    this.getCustomerOrders();
  }

  getCustomerOrders() {
    this.OrdersService.getCustomerOrders(
      this.customerDetails?._id,
      this.page
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.customerOrderDetails = res?.result;
          this.orders = res?.result?.orders;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  onPageTriggered(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getCustomerOrders();
  }

  formatOrderDate(orderDate: string) {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let date = new Date(orderDate);
    let day = days[date.getDay()];
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return `${date.getDate()} ${day} ${month} ${year}`;
  }

  formatOrderStatus(orderStatus: string) {
    return `${orderStatus.charAt(0).toUpperCase()}${orderStatus
      .slice(1)
      .toLowerCase()}`;
  }

  formatOrderPayment(payment: string) {
    return payment == 'COD' ? 'Cash' : 'Online';
  }

  formatOrderTime(orderDate: string) {
    let date = new Date(orderDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let newMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${newMinutes} ${ampm}`;
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")],),
      countryCode: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),
      isActive: new FormControl('true', Validators.required),
    })
  }

  get formControls() {
    return this.form.controls;
  }

  get addressControls() {
    return this.addressForm.controls;
  }

  openWallet(template: TemplateRef<any>) {
    this.walletRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, });
    this.getTransactions();
  }

  closeWallet() {
    this.walletRef?.hide();
    this.amount?.reset();
    this.description?.setValue('Transaction successful! Your wallet has been updated.');
    this.isWalletSubmitted = false;
  }

  openLoyalty(template: TemplateRef<any>) {
    this.loyaltyRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true, });
    this.getHistory();
  }

  closeLoyalty() {
    this.loyaltyRef?.hide();
    this.points?.reset();
    this.loyaltyDescription?.reset();
    this.isLoyaltySubmitted = false;
  }

  getHistory() {
    this.CustomersService.getLoyaltyTransactions(
      this.customerDetails?.slug,
      this.loyalityType?.value
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.historyItems = res?.result;
        } else { }
      }, error: (err: any) => { }
    });
  }

  onWalletPageChange(event: { pageIndex: number; pageSize: number }) {
    this.walletPageIndex = event.pageIndex;
    this.walletPageSize = event.pageSize;
    this.getTransactions();
  }

  getTransactions() {
    this.CustomersService.getTransactions({
      customerId: this.customerDetails?._id,
      type: this.transactionType.value,
      pageIndex: this.walletPageIndex,
      pageSize: this.walletPageSize,
      keyword: this.walletKeyword.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.transactions = res?.result?.transactions;
          this.walletTotalPages = res?.result?.totalPages;
          this.walletTotalResults = res?.result?.totalResults;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  addToWallet(type: string) {
    if (!this.amount.valid) {
      this.isWalletSubmitted = true;
      return;
    }

    this.CustomersService.createTransaction({
      amount: this.amount.value,
      user: this.customerDetails?._id,
      description: this.description.value,
      type: type,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.amount?.reset();
          this.description?.setValue('Transaction successful! Your wallet has been updated.');
          this.getTransactions();
          this.getCustomerDetails();
          this.closeManageWallet();
          this.isWalletSubmitted = false;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  open(template: TemplateRef<any>, address: any) {
    if (address) {
      this.isEditAddress = true;
      this.CustomersService.getAddressDetails(address).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.addressDetails = res?.result;
          for (let _key of Object.keys(res?.result)) {
            this.addressForm.get(_key)?.setValue(res?.result[_key]);
            this.addressForm.get('lat')?.setValue(res?.result?.coordinates?.lat);
            this.addressForm.get('lng')?.setValue(res?.result?.coordinates?.lng);
          }
          this.loadStates('', 'update');
          this.ChangeDetectorRef.markForCheck();
        }
      });
    }
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  close() {
    this.modalRef?.hide();
    this.addressForm.reset();
    this.fetchCountries()
    this.states = [];
    this.cities = [];
    this.addressForm.patchValue({ country: '', state: '', city: '', countryCode: '+971', isDefault: false, type: 'Home' });
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

  //Function to check whether the email address exists
  emailExists(emailString: any) {
    this.CustomersService
      .customerDetails({
        _id: { $eq: this.customerDetails?._id },
        email: emailString.value,
      })
      .subscribe((res: any) => {
        if (res?.errorCode == 0) {
          if (res?.result) {
            this.isEmailExists = true;
            this.HotToastService.error('Email address already exists');
          } else {
            this.isEmailExists = false;
          }
        } else {
          this.HotToastService.error(res?.message);
        }
      });
  }
  //Function to check whether the email address exists

  //Function to check whether the phone exists
  phoneExists(phoneString: any) {
    this.CustomersService
      .customerDetails({
        _id: { $eq: this.customerDetails?._id },
        countryCode: this.form.get('countryCode')?.value,
        mobile: phoneString.value,
      })
      .subscribe((res: any) => {
        if (res?.errorCode == 0) {
          if (res?.result) {
            this.isPhoneExists = true;
            this.HotToastService.error('Email address already exists');
          } else {
            this.isPhoneExists = false;
          }
        } else {
          this.HotToastService.error(res?.message);
        }
      });
  }
  //Function to check whether the phone exists

  addAddress() {
    if (!this.addressForm.valid) {
      this.HotToastService.error('Please fill all required fields before saving the address.');
      this.isAddressSubmitted = true;
      return;
    }

    let payload = {
      ...this.addressForm?.value,
      customer: this.customerDetails?._id,
    };

    if (!this.isEditAddress) {
      this.CustomersService.addAddress(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.getAddress();
          this.addressForm.reset();
          this.addressForm.patchValue({ countryCode: '+971', isDefault: false, type: 'Home' });
          this.HotToastService.success(res?.message);
          this.isAddressSubmitted = false;
          this.isEditAddress = false;
          this.fetchCountries()
          this.states = [];
          this.cities = [];
          this.modalRef?.hide();
        } else {
          this.HotToastService.error(res?.message);
        }
      });
    } else {
      payload['refid'] = this.addressDetails?.refid;
      this.CustomersService
        .updateCustomerAddress(payload)
        .subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.getAddress();
            this.addressForm.reset();
            this.addressForm.patchValue({ country: '', state: '', city: '', countryCode: '+971', isDefault: false, type: 'Home' });
            this.fetchCountries()
            this.states = [];
            this.cities = [];
            this.HotToastService.success(res?.message);
            this.modalRef?.hide();
            this.isEditAddress = false;
            this.isAddressSubmitted = false;
          } else {
            this.HotToastService.error(res?.message);
          }
        });
    }
  }

  getAddress() {
    this.CustomersService
      .getAddress({ userid: this.slug })
      .subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.addresses = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      });
  }

  editAddress(refid: any) {
    this.isEditAddress = true;
    this.CustomersService.getAddressDetails(refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.addressDetails = res?.result;
        for (let _key of Object.keys(res?.result)) {
          this.addressForm.get(_key)?.setValue(res?.result[_key]);
          this.addressForm.get('lat')?.setValue(res?.result?.coordinates?.lat);
          this.addressForm.get('lng')?.setValue(res?.result?.coordinates?.lng);
        }
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  setDefaultAddress(refid: any) {
    this.CustomersService.updateDefaultAddress(refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getAddress();
        this.HotToastService.success(res?.message);
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  selectAddress(refid: any) {
    this.selectedAddress = refid;
  }

  confirm() {
    this.CustomersService
      .deleteAddress(this.selectedAddress)
      .subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.getAddress();
          this.HotToastService.success(res?.message);
          this.ChangeDetectorRef.markForCheck();
        }
      });
    this.deleteModalRef?.hide();
  }

  decline() {
    this.deleteModalRef?.hide();
  }

  openModal(template: TemplateRef<any>, address: any) {
    this.deleteModalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
    this.selectedAddress = address;
  }

  openManageWallet(template: TemplateRef<any>) {
    this.manageWalletRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeManageWallet() {
    this.manageWalletRef?.hide();
    this.amount?.reset();
    this.description?.setValue('Transaction successful! Your wallet has been updated.');
    this.isWalletSubmitted = false;
  }

  getCustomerDetails() {
    this.CustomersService.getCustomerDetails(this.slug).subscribe((res: any) => {
      this.customerDetails = res?.result;
      this.savedCards = res?.result?.savedCards || [];
      this.referralCode.setValue(res?.result?.referralCode);
      this.addressForm.patchValue({
        name: res?.result?.name,
        countryCode: res?.result?.countryCode,
        mobile: res?.result?.mobile
      })
      this.loginActivities = res?.result?.loginActivities || [];
      // Reverse the login activities array
      this.loginActivities.reverse();
      this.handleAddressMobilePattern()
      this.referralCode.disable();
      this.form.patchValue(res?.result);
      this.handleMobilePattern();
      this.ChangeDetectorRef.markForCheck();
    });
  }

  formatDate(date: string): string {
    const dt = new Date(date);

    return dt.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's system timezone
      timeZoneName: 'short'
    });
  }

  deleteCard(cardNo: any) {
    this.savedCards = this.savedCards.filter(
      (item: any) => item?.cardNo !== cardNo
    );
    this.HotToastService.success('Card deleted successfully');
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    let emailId: string = this.form.get('email')?.value;
    emailId = emailId.toLowerCase()
    this.form.patchValue({ email: emailId })

    this.CustomersService
      .updateCustomer(this.slug, {
        savedCards: this.savedCards,
        ...this.form.value,
      })
      .subscribe({
        next: (res: any) => {
          if (res.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
          } else if (res.errorCode == 0) {
            this.HotToastService.error(res?.message);
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        },
      });
  }
}
