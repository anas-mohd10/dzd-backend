import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { debounce, debounceTime } from 'rxjs/operators';
import { PageTasks } from 'src/app/config/constants';
import { validators } from 'src/app/config/constants/mobile-validators';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { DeliverySlotsService } from 'src/app/includes/services/delivery-slots.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { PickupService } from 'src/app/includes/services/pickup.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { StoresService } from 'src/app/includes/services/stores.service';
import { environment } from 'src/environments/environment';
import { LocationService } from 'src/app/includes/services/location.service';
import { CartService } from 'src/app/includes/services/cart.service';

interface Coupon {
  _id: string,
  title: string,
  code: string,
  fromDate: string,
  lastDate: string,
  type: string,
  value: string,
}

interface ProductDoc {
  _id: string,
  quantity: number,
  maxOrderQuantity?: number,
  moq?: number,
  stock: number,
  price: { selling: number }
}

interface CartDoc {
  _id: string,
  quantity: number,
  categories: Array<{ name: string }>,
  maxOrderQuantity: number,
  moq: number,
  isDelete: boolean,
  isActive: boolean,
  stock: number,
  price: { mrp: number, selling: number }
}

interface Customer {
  name: string,
  email: string,
  countryCode: string,
  mobile: string,
  userid: string,
  _id: string,
}

@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.scss'],
})
export class AddOrdersComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes;
  orderForm: FormGroup;
  task = PageTasks.ADD;
  isSubmitted = false;
  activeCustomersData: any;
  activeProducts: any;
  custAddress: any;
  activeCoupons: any;
  selectedCustomer: any;
  customerId: any;
  isProducts: boolean = false;
  isCartAdded: boolean = false;
  deliveryType: String = '0';
  stores: Array<any> = [];
  timeslots: Array<any> = [];
  dates: Array<any> = [];
  isCustomer: boolean = true;

  isCustomerSelected: boolean = false;
  customerQuery: FormControl = new FormControl('');
  customerItems: Array<any> = [];
  customerPageIndex: number = 1;
  customerPageSize: number = 10;
  totalCustomers: number = 10
  totalCustomerPages: number = 1
  tabIndex: number = 0;
  wishlistItems: Array<any> = [];
  productQuery: FormControl = new FormControl('');
  totalProducts: number = 10;
  totalProductPages: number = 1;
  productPageIndex: number = 1;
  productPageSize: number = 10;
  cartItemsValues: Array<{ label: string, value: string }> = [];
  emailConfirmation: FormControl = new FormControl(false);
  isWalletUsed: boolean = false;
  couponCode: FormControl = new FormControl('');
  isCouponApplied: boolean = false;
  isCustomerSubmitted: boolean = false;
  isAddressSubmitted: boolean = false;
  userForm: FormGroup = new FormGroup({});
  countries: Array<any> = [];
  states: Array<any> = [];
  cities: Array<any> = [];
  cartDoc: { products: Array<any> } = { products: [] };

  //Cart
  product: any;
  quantity: any = new FormControl(1, Validators.required);
  coupon: any = '';
  productids: any = [];

  customer: FormControl = new FormControl('');
  customers: Customer[] = [];
  addressModalRef?: BsModalRef;
  manageAddressModalRef?: BsModalRef;
  addressItems: Array<any> = [];
  address: any;
  customerDetails: any;
  addressForm!: FormGroup;
  @ViewChild('addressRef') addressModal!: TemplateRef<any>;
  productsModalRef?: BsModalRef;
  keyword: FormControl = new FormControl('');
  products: Array<any> = [];
  base: string = environment.base;
  cartItems: Array<any> = [];
  addressMode: string = 'add';
  cartSubtotal: number = 0;
  cartTotal: number = 0;
  cartDiscount: number = 0;
  cart: any = [];
  subTotal: any = 0;
  showTransactionId: boolean = false;
  store: FormControl = new FormControl('');
  deliveryTime: any = null;
  deliveryDate: any = new Date();
  settings: any = {};
  deliverySlots: Array<any> = [];
  deliverySlot: any;

  pickupLocations: Array<any> = [];
  addCustomerRef?: BsModalRef;


  applicableCoupons: Array<Coupon> = [];
  couponsModalRef?: BsModalRef;

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const element = document.querySelector('.sticky-card');
    if (element) {
      const rect = element.getBoundingClientRect();
      this.isSticky = rect.top <= 110;
      this.ChangeDetectorRef.markForCheck();
    }
  }

  constructor(
    private OrderService: OrdersService,
    private customerService: CustomersService,
    private Router: Router,
    private ToastrService: HotToastService,
    private formBuilder: FormBuilder,
    private CartService: CartService,
    private PickupService: PickupService,
    private productService: ProductService,
    private CouponsService: CouponsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private StoresService: StoresService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private DeliverySlotsService: DeliverySlotsService,
    private LocationService: LocationService
  ) {
    this.customerQuery.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.fetchCustomers();
    });

    this.productQuery.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.getProducts();
    });
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }, type: 'customer' | 'product') {
    if (type == 'customer') {
      this.customerPageIndex = event.pageIndex;
      this.customerPageSize = event.pageSize;
      this.fetchCustomers();
    } else {
      this.productPageIndex = event.pageIndex;
      this.productPageSize = event.pageSize;
      this.getProducts();
    }
  }

  removeCustomer() {
    this.isCustomerSelected = false;
    this.tabIndex = 0;
    this.orderForm.get('customerId')?.setValue('');
    this.customerDetails = null;
    this.ChangeDetectorRef.markForCheck();
  }

  selectCustomer(customerDoc: any) {
    this.isCustomerSelected = true;
    this.customerDetails = customerDoc;
    this.tabIndex = 1;
    this.wishlistItems = []
    this.cartDoc = { products: [] }
    this.orderForm.get('customerId')?.setValue(this.customerDetails?._id);
    this.customerService.getAddress({ userid: this.customerDetails?.userid }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.addressItems = res?.result;
          if (this.addressItems?.length > 0) {
            this.addressItems.forEach((addressItem: any) => {
              if (addressItem?.isDefault == true) {
                this.addressForm.patchValue(addressItem)
                const countryDoc: any = this.countries.find((country: any) => country?.name == addressItem?.country);
                this.loadStates(countryDoc?._id, 'update')
                this.handleAddressMobilePattern()
              }
            })
          }
          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err: any) => { },
    });

    if (this.customerDetails && this.customerDetails?.wishlist?.length > 0) {
      this.productService.getBulkProducts({ productIds: this.customerDetails?.wishlist?.map((item: any) => item?._id) }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.wishlistItems = res?.result;
            this.ChangeDetectorRef.markForCheck();
          } else { }
        }, error: (err: any) => { }
      })
    }

    this.getCartDetails()
    this.handleAddressMobilePattern()
  }

  getCartDetails() {
    this.CartService.getCartDetails(this.customerDetails?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.cartDoc = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err: any) => { }
    })
  }

  ngOnInit(): void {
    this.base = environment.base;

    this.orderForm = new FormGroup({
      paymentMethod: new FormControl('COD'),
      customerId: new FormControl('', Validators.required),
      transactionId: new FormControl(''),
      paymentStatus: new FormControl('Paid', Validators.required),
      additionalCharge: new FormControl(0, Validators.pattern(/^[0-9]+$/)),
      products: new FormControl([], Validators.required),
      clickPoint: new FormControl(null),
      pickUpLocation: new FormControl(''),
      deliveryDate: new FormControl(''),
      deliveryType: new FormControl('0'),
      shippingCost: new FormControl(0, Validators.pattern(/^[0-9]+$/)),
      deliverySlot: new FormControl(null),
      orderNote: new FormControl(''),
      shippingNote: new FormControl(''),
    })

    this.getActiveProducts();

    this.fetchCustomers()

    this.PickupService.list().subscribe({
      next: (response: any) => {
        if (response?.errorCode == 0) {
          this.pickupLocations = response?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (error: any) => { },
    });

    this.StoresService.getClickPoints().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.stores = res?.result;
        this.ChangeDetectorRef.markForCheck();
      }
    });

    this.fetchCountries();

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (response: any) => {
        if (response?.errorCode == 0) {
          this.settings = response?.result;
          this.dates = this.getNextSevenDays();
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (error: any) => { },
    });

    this.addressForm = new FormGroup({
      name: new FormControl('', Validators.required),
      countryCode: new FormControl('+971', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      firstlane: new FormControl('', Validators.required),
      secondlane: new FormControl(''),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      area: new FormControl(''),
      landmark: new FormControl('', Validators.required),
      type: new FormControl('Home'),
      pincode: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl(''),
      isDefault: new FormControl(false),
    });

    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      countryCode: new FormControl('+971', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      isActive: new FormControl(true),
    });

    this.handleUserMobilePattern();

    this.selectDeliveryDate(this.deliveryDate);
  }

  get userControls() {
    return this.userForm.controls;
  }

  get addressControls() {
    return this.addressForm.controls;
  }

  updateAddressMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.addressForm.get('mobile')?.setValidators(newValidators);
    this.addressForm.get('mobile')?.updateValueAndValidity();
  }

  /**
   *
   * @param template
   * Open create customer modal and set the modal reference to addCustomerRef
   * Update the mobile pattern based on the country code
   * Close the modal on close button click
   */
  openCreateCustomer(template: TemplateRef<any>) {
    this.addCustomerRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  updateUserMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.userForm.get('mobile')?.setValidators(newValidators);
    this.userForm.get('mobile')?.updateValueAndValidity();
  }

  handleUserMobilePattern() {
    switch (this.userForm.get('countryCode')?.value) {
      case '+91':
        this.updateUserMobilePattern(
          `^[0-9]{${validators.india.validation.maximum}}$`
        );
        break;
      case '+971':
        this.updateUserMobilePattern(
          `^[0-9]{${validators.uae.validation.maximum}}$`
        );
        break;
    }
  }

  createCustomer() {
    if (!this.userForm.valid) {
      this.isCustomerSubmitted = true;
      this.ToastrService.error('Please fill all the required fields');
      return;
    }

    this.customerService.addCustomer(this.userForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res.message);
          this.userForm.patchValue({ name: '', mobile: '', email: '', isActive: true, countryCode: '+971', });
          this.addCustomerRef?.hide();
          this.selectCustomer(res?.result);
          this.isCustomerSubmitted = false;
        } else {
          this.ToastrService.error(res.message);
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err.error.message);
      },
    });
  }

  closeCreateCustomer() {
    this.addCustomerRef?.hide();
  }

  handleAddressMobilePattern() {
    switch (this.addressForm.get('countryCode')?.value) {
      case '+91':
        this.updateAddressMobilePattern(
          `^[0-9]{${validators.india.validation.maximum}}$`
        );
        break;
      case '+971':
        this.updateAddressMobilePattern(
          `^[0-9]{${validators.uae.validation.maximum}}$`
        );
        break;
    }

    this.ChangeDetectorRef.markForCheck();
  }

  getNextSevenDays() {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < this.settings?.futureDays; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i).toLocaleString();
      dates.push(date);
    }
    return dates;
  }

  formatDate(date: Date, type: string) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = [
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
    const day = daysOfWeek[date.getDay()];
    const dateNumber = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = new Date().getFullYear();

    switch (type) {
      case 'month':
        return month;
        break;
      case 'day':
        return day;
        break;
      case 'dateNumber':
        return dateNumber;
        break;
    }
  }

  getTimeSlots(e: any) {
    this.timeslots = [];
    for (let store of this.stores) {
      if (store?.refid == e.value) this.timeslots.push(...store?.slots);
    }
    const providedDate = new Date(this.orderForm.get('deliveryDate')?.value);
    const currentDate = new Date();

    if (
      providedDate.getDate() === currentDate.getDate() &&
      providedDate.getMonth() === currentDate.getMonth() &&
      providedDate.getFullYear() === currentDate.getFullYear()
    ) {
      const filteredTimeSlots = this.filterPassedTimeSlots(this.timeslots);
      this.timeslots = [...filteredTimeSlots];
    }

    this.timeslots.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.from}`);
      const timeB = new Date(`1970-01-01T${b.from}`);
      if (timeA < timeB) {
        return -1;
      } else if (timeA > timeB) {
        return 1;
      } else {
        return 0;
      }
    });

    this.deliveryTime = this.timeslots[0]['refid'];
    this.orderForm.get('deliveryTime')?.setValue(this.timeslots[0]['refid']);
  }

  filterPassedTimeSlots(timeslots: any = []) {
    const currentTime = new Date();
    const formattedCurrentTime =
      currentTime.getHours() + ':' + currentTime.getMinutes();
    const filteredTimeSlots = timeslots.filter((slot: any) => {
      const slotEndTime = slot.to;
      const slotStartTime = slot.from;
      return (
        slotEndTime > formattedCurrentTime ||
        slotStartTime > formattedCurrentTime
      );
    });

    return filteredTimeSlots;
  }

  get formControls() {
    return this.orderForm.controls;
  }

  getActiveProducts() {
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.activeProducts = res?.result;
      this.ChangeDetectorRef.markForCheck();
    });
  }

  checkPaymentmethod(event: any) {
    const method = this.orderForm.get('paymentMethod')?.value;
    if (method == 'ONLINE') {
      this.showTransactionId = true;
    } else {
      this.showTransactionId = false;
    }
  }

  selectDeliveryType(type: any) {
    if (type == '0') {
      this.orderForm.get('clickPoint')?.setValue('');
      this.orderForm.get('deliveryTime')?.setValue('');
      this.orderForm.get('deliveryDate')?.setValue('');
      this.timeslots = [];
    }
    this.deliveryType = type;
    this.orderForm.get('deliveryType')?.setValue(type);
  }

  selectDeliveryTime(time: any) {
    this.deliveryTime = time;
    this.orderForm.get('deliverySlot')?.setValue(time);
  }

  selectDeliveryDate(date: any) {
    this.deliveryDate = date;
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    let deliveryDay = daysOfWeek[date.getDay()];

    let bufferHours: any = null;
    let bufferMinutes: any = null;

    if (date.getDate() == new Date().getDate()) {
      bufferHours = new Date().getHours();
      bufferMinutes = new Date().getMinutes();
      if (bufferHours >= 23 && bufferHours <= 0) {
        deliveryDay = daysOfWeek[date.getDay() + 1];
        bufferHours = null;
        bufferMinutes = null;
      } else {
        bufferHours = bufferHours + 1;
      }
    }

    this.DeliverySlotsService.getSlotDetailsPerDay(
      deliveryDay,
      bufferHours,
      bufferMinutes
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.timeslots = res?.result;
          this.timeslots.sort((a, b) => {
            // Convert time strings to Date objects for comparison
            const timeA = this.convertTo24Hour(a.from);
            const timeB = this.convertTo24Hour(b.from);
            return timeA.localeCompare(timeB);
          });
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });

    this.orderForm.get('deliveryDate')?.setValue(date);
  }

  convertTo24Hour(timeString: any) {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  openProducts(template: TemplateRef<any>) {
    this.productsModalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered' });
    this.getProducts();
  }

  getProducts() {
    this.productService.searchProducts({
      page: this.productPageIndex,
      limit: this.productPageSize,
      name: this.productQuery.value,
      isActive: 'true',
      isArchive: 'false',
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result?.data;
          this.totalProducts = res?.result?.totalResults;
          this.totalProductPages = res?.result?.totalPages;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res.message);
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err.message);
      },
    });
  }

  addToCart(product: any) {
    const isExists: boolean = this.cartItems.some((item: any) => item?._id === product?._id);
    if (isExists) {
      this.ToastrService.error('Product already exists in the cart');
    } else {
      this.products = [];
      this.productQuery.setValue('');
      const initialQuantity = Math.max(1, product?.moq || 1);
      this.cartItems.push({ ...product, quantity: initialQuantity });
      this.cartSubtotal += product?.price?.selling * initialQuantity;
      this.cartTotal = this.cartSubtotal - this.cartDiscount;
      this.productsModalRef?.hide();

      // Get applicable coupons
      this.getApplicableCoupons();

      this.getCartCalculation();
    }
  }

  updateQuantityWithInput(event: Event, product: any): void {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    const newValue = parseInt(target.value, 10);

    if (isNaN(newValue)) {
      target.value = product.quantity.toString();
      return;
    }

    let finalQuantity = Math.max(1, newValue);

    // Check both max order quantity and stock limits
    const maxAllowedQuantity = Math.min(
      product.maxOrderQuantity,
      product.stock || 0
    );

    if (finalQuantity > maxAllowedQuantity) {
      if (product.stock === 0) {
        this.ToastrService.error('Product is out of stock');
        finalQuantity = product.quantity;
      } else if (product.stock < product.maxOrderQuantity) {
        this.ToastrService.error(`Only ${product.stock} items available in stock`);
        finalQuantity = product.stock;
      } else {
        this.ToastrService.error(`Maximum order quantity is ${product.maxOrderQuantity}`);
        finalQuantity = product.maxOrderQuantity;
      }
      target.value = finalQuantity.toString();
    }

    const currentQuantity = product.quantity || 1;
    const quantityDifference = finalQuantity - currentQuantity;
    const priceDifference = quantityDifference * product.price.selling;

    this.cartItems = this.cartItems.map((item: any) => {
      if (item._id === product._id) {
        return { ...item, quantity: finalQuantity };
      }
      return item;
    });

    this.cartSubtotal += priceDifference;
    this.cartTotal = this.cartSubtotal - this.cartDiscount;

    if (quantityDifference !== 0) {
      this.ToastrService.success('Product quantity updated');
    }
  }

  updateQuantity(type: 'increment' | 'decrement', product: any) {
    switch (type) {
      case 'increment': {
        const newQuantity = product.quantity + 1;

        // Check both stock and max order quantity
        if (product.stock === 0) {
          this.ToastrService.error('Product is out of stock');
          return;
        }

        if (newQuantity > product.stock) {
          this.ToastrService.error(`Only ${product.stock} items available in stock`);
          return;
        }

        if (newQuantity > product.maxOrderQuantity) {
          this.ToastrService.error(`Maximum order quantity (${product.maxOrderQuantity}) has been reached`);
          return;
        }

        this.cartItems = this.cartItems.map((item: any) => {
          if (item._id === product._id) {
            this.cartSubtotal += product.price.selling;
            this.cartTotal = this.cartSubtotal - this.cartDiscount;
            this.ToastrService.success('Product quantity updated');
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        break;
      }

      case 'decrement': {
        const newQuantity = product.quantity - 1;

        if (newQuantity < product.moq) {
          this.ToastrService.error(`Minimum required quantity (${product.moq}) has been reached`);
          return;
        }

        this.cartItems = this.cartItems.map((item: any) => {
          if (item._id === product._id && item.quantity > 1) {
            this.cartSubtotal -= product.price.selling;
            this.cartTotal = this.cartSubtotal - this.cartDiscount;
            this.ToastrService.success('Product quantity updated');
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        break;
      }
    }

    this.getApplicableCoupons();
  }

  deleteProduct(product: any) {
    this.cartItems = this.cartItems.filter((item: any) => item?._id != product?._id);
    this.cartSubtotal = this.cartSubtotal - product?.price?.selling * product?.quantity;
    this.getApplicableCoupons();
  }

  fetchCustomers() {
    this.customerService.searchCustomers({
      keyword: this.customerQuery.value,
      page: this.customerPageIndex,
      limit: this.customerPageSize
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.customerItems = res?.result?.data;
          this.totalCustomers = res?.result?.totalResults;
          this.totalCustomerPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      },
    });
  }

  getAddress(customer: any) {
    this.customerDetails = customer;
    this.address = null;
    this.addressForm.reset();
    this.addressForm.patchValue({ countryCode: '', type: '' });
    this.customers = []
    this.orderForm.get('customerId')?.setValue(this.customerDetails?._id);
    // this.addressModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, });
    this.customerService.getAddress({ userid: customer?.userid }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.addressItems = res?.result;
          this.addressItems.forEach((addressItem: any) => {
            if (addressItem?.isDefault == true) {
              this.address = addressItem
            }
          })
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      },
    });

    this.ChangeDetectorRef.markForCheck()
  }

  selectAddress(address: any) {
    this.address = address;
    this.orderForm.get('customerId')?.setValue(this.customerDetails?._id);
    this.addressModalRef?.hide();
    for (let _key of Object.keys(address)) this.addressForm.get(_key)?.setValue(address[_key]);
    this.customers = [];
  }

  openManage(template: TemplateRef<any>, type?: string) {
    this.addressModalRef?.hide();

    this.manageAddressModalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

    this.address ? this.addressMode = 'update' : this.addressMode = 'add';

    if (this.address) {
      for (let _key of Object.keys(this.address)) this.addressForm.get(_key)?.setValue(this.address[_key]);

      this.handleAddressMobilePattern();
      const customerCountry: any = this.countries.filter(country => country.name === this.address?.country);
      this.loadStates(customerCountry[0]._id, 'update');
      this.addressForm.patchValue({
        country: customerCountry[0]._id,
      });
    }

    this.ChangeDetectorRef.markForCheck();
  }

  private getLocationName(collection: any[], id: string): string {
    return collection.find(item => item._id === id)?.name || '';
  }

  private handleAddressResponse(res: any) {
    if (res?.errorCode === 0) {
      this.address = res?.result;
      this.customers = [];
      this.ChangeDetectorRef.markForCheck();
      this.ToastrService.success(res?.message);
      return true;
    }
    this.ToastrService.error(res.message);
    return false;
  }

  private resetAddressForm() {
    this.addressForm.reset();
    this.addressForm.patchValue({ type: 'Home', countryCode: '+971' });
    this.manageAddressModalRef?.hide();
    this.addressModalRef?.hide();
  }

  private refreshAddressList() {
    this.customerService.getAddress({ userid: this.customerDetails?.userid }).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.addressItems = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res.message);
        }
      },
      error: (err: any) => this.ToastrService.error(err.message)
    });
  }

  manageAddress() {
    if (!this.addressForm.valid) {
      this.isAddressSubmitted = true;
      return;
    }

    const addressData = {
      ...this.addressForm.value,
      country: this.getLocationName(this.countries, this.addressForm.get('country')?.value),
      state: this.getLocationName(this.states, this.addressForm.get('state')?.value),
      city: this.getLocationName(this.cities, this.addressForm.get('city')?.value)
    };

    const request$ = this.addressMode === 'add'
      ? this.customerService.addAddress({ ...addressData, customer: this.customerDetails?._id })
      : this.customerService.updateCustomerAddress({ ...addressData, refid: this.address?.refid });

    request$.subscribe({
      next: (res: any) => {
        if (this.handleAddressResponse(res)) {
          this.resetAddressForm();
          this.refreshAddressList();
        }
      },
      error: (err: any) => this.ToastrService.error(err.message)
    });
  }

  getBrowserAndDevice() {
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    let browser = 'Others';

    if (
      userAgent.includes("Chrome") &&
      !userAgent.includes("Edg") && !userAgent.includes("OPR")
    ) {
      browser = "Chrome";
    }
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
    }
    if (userAgent.includes("Firefox")) {
      browser = "Firefox";
    }
    if (userAgent.includes("Edg")) {
      browser = "Edge";
    }
    if (userAgent.includes("Brave")) {
      browser = "Brave";
    }
    if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      browser = "Opera";
    }

    return { isMobile, browser }
  }

  createOrder() {
    this.orderForm.get('pickUpLocation')?.setValue(this.orderForm.get('pickUpLocation')?.value ? this.orderForm.get('pickUpLocation')?.value : null);
    this.orderForm.get('customerId')?.setValue(this.customerDetails?._id);
    this.orderForm.get('products')?.setValue(this.cartItems);

    if (!this.addressForm.valid) {
      this.ToastrService.error('Please fill all the address fields');
      this.isAddressSubmitted = true;
      return;
    }

    if (this.cartItems.length == 0) {
      this.ToastrService.error('Please add at least one product to the cart');
      this.isSubmitted = true;
      return;
    }

    if (!this.orderForm.valid) {
      this.ToastrService.error('Please fill all the required fields');
      this.isSubmitted = true;
      return;
    }

    const { isMobile, browser } = this.getBrowserAndDevice();

    this.OrderService.addOrder({
      address: this.addressForm.value,
      customerDetails: {
        name: this.customerDetails.name,
        countryCode: this.customerDetails.countryCode,
        mobile: this.customerDetails.mobile,
        email: this.customerDetails.email,
        tags: this.customerDetails.tags || []
      },
      isCouponApplied: this.isCouponApplied,
      couponCode: this.couponCode.value,
      emailConfirmation: this.emailConfirmation.value,
      isWalletUsed: this.isWalletUsed,
      walletBalance: this.customerDetails?.walletBalance || 0,
      coupon: this.couponCode.value ? this.couponCode.value : null,
      ...this.orderForm.value,
      cartValues: this.cartItemsValues,
      source: isMobile == true ? 'MOBILE' : 'WEB',
      sourceType: browser
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.orders.ORDERS_LIST]);
          this.ToastrService.success(res.message);
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message);
      },
    });
  }

  fetchCountries() {
    this.LocationService.findCountries().subscribe({
      next: (response: any) => {
        if (response?.errorCode == 0) {
          this.countries = response?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(response.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
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
      let countryItem = this.countries.find((country: any) => country?.name == this.addressForm.get('country')?.value)
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
          this.ToastrService.error(response.message);
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

  applyCoupon(coupon: string) {
    this.couponCode.setValue(coupon);
    this.isCouponApplied = true;
    this.getCartCalculation();
  }

  formatDateString(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  openCoupons(template: TemplateRef<any>) {
    this.couponsModalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  getApplicableCoupons() {
    const productDocs: ProductDoc[] = this.cartItems.map((item: any) => (
      {
        _id: item._id,
        quantity: item.quantity,
        price: { selling: item.price.selling },
        stock: item.stock
      }))
    this.CouponsService.getApplicableCoupons({ products: productDocs }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.applicableCoupons = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res.message);
        }
      },
      error: (err: any) => this.ToastrService.error(err.message)
    })
  }

  updateCartItemQuantity(cartItem: CartDoc, event: any) {
    const newQuantity = parseInt(event.target.value);
    const oldQuantity = cartItem.quantity;

    if (!cartItem) {
      return this.ToastrService.error('No item found')
    }

    if (newQuantity < cartItem.moq) {
      this.ToastrService.error(`Minimum quantity is ${cartItem.moq}`)
      event.target.value = oldQuantity;
      return
    }

    if (newQuantity > cartItem.maxOrderQuantity) {
      this.ToastrService.error(`Maximum quantity is ${cartItem.maxOrderQuantity}`)
      event.target.value = oldQuantity;
      return
    }

    if (newQuantity > cartItem.stock) {
      this.ToastrService.error(`Available stock is ${cartItem.stock}`)
      event.target.value = oldQuantity;
      return
    }

    const index = this.cartItems.findIndex(item => item._id === cartItem._id);
    if (index !== -1) {
      this.cartItems[index].quantity = newQuantity;
      this.calculateCartTotals();
      this.getCartCalculation();
      this.ChangeDetectorRef.markForCheck();
    }
  }

  updateCartItemPrice(cartItem: CartDoc, event: any) {
    const newPrice = parseFloat(event.target.value);
    const oldPrice = cartItem.price.selling;

    if (!cartItem) {
      return this.ToastrService.error('No item found')
    }

    if (newPrice > cartItem.price.mrp) {
      this.ToastrService.error('Selling price cannot be greater than MRP')
      event.target.value = oldPrice;
      return
    }

    if (newPrice >= 0) {
      const index = this.cartItems.findIndex(item => item._id === cartItem._id);
      if (index !== -1) {
        this.cartItems[index].price.selling = newPrice;
        this.calculateCartTotals();
        this.getCartCalculation();
        this.ChangeDetectorRef.markForCheck();
      }
    } else {
      event.target.value = oldPrice;
    }
  }

  private calculateCartTotals() {
    this.cartSubtotal = this.cartItems.reduce((total, item) => {
      return total + (item.price.selling * item.quantity);
    }, 0);
    this.cartTotal = this.cartSubtotal - this.cartDiscount;
  }

  switchTriggered(event: { toggleState: boolean, switchId: string }) {
    if (event.switchId == 'emailConfirmation') {
      this.emailConfirmation.setValue(event.toggleState);
    } else if (event.switchId == 'isWalletUsed') {
      this.isWalletUsed = event.toggleState;
      this.getCartCalculation();
    }
  }

  getCartCalculation() {
    const cartDocs: CartDoc[] = this.cartItems.map((item: any) => (
      {
        _id: item._id,
        maxOrderQuantity: item.maxOrderQuantity,
        moq: item.moq,
        stock: item.stock,
        isDelete: item.isDelete,
        categories: item.categories,
        isActive: item.isActive,
        quantity: item.quantity,
        price: { selling: item.price.selling, mrp: item.price.mrp },
        name: item.name
      }
    ))

    this.CartService.getCartCalculation({
      products: cartDocs,
      customerDetails: this.customerDetails,
      isCouponApplied: this.isCouponApplied,
      couponCode: this.couponCode.value,
      isWalletUsed: this.isWalletUsed,
      walletBalance: this.customerDetails?.walletBalance || 0,
      additionalCharge: Number(this.orderForm.get('additionalCharge')?.value),
      shippingCost: Number(this.orderForm.get('shippingCost')?.value)
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.cartItemsValues = res?.result?.cartItems;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res.message);
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message);
      }
    })
  }
}

