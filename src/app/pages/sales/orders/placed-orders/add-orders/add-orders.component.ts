import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { DeliverySlotsService } from 'src/app/includes/services/delivery-slots.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { StoresService } from 'src/app/includes/services/stores.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-add-orders',
  templateUrl: './add-orders.component.html',
  styleUrls: ['./add-orders.component.scss']
})

export class AddOrdersComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes
  orderForm: FormGroup
  task = PageTasks.ADD
  isSubmitted = false;
  activeCustomersData: any;
  activeProducts: any
  custAddress: any
  activeCoupons: any
  selectedCustomer: any
  customerId: any;
  isProducts: boolean = false
  isCartAdded: boolean = false
  deliveryType: String = '0'
  stores: Array<any> = []
  timeslots: Array<any> = []
  dates: Array<any> = []
  isCustomer: boolean = true

  //Cart
  product: any;
  quantity: any = new FormControl(1, Validators.required);
  coupon: any = ''
  productids: any = []

  customer: FormControl = new FormControl('')
  customers: Array<any> = []
  addressModalRef?: BsModalRef
  manageAddressModalRef?: BsModalRef
  addressDetails: Array<any> = []
  address: any
  customerDetails: any = {}
  addressForm!: FormGroup
  @ViewChild('addressRef') addressModal!: TemplateRef<any>;
  productsModalRef?: BsModalRef
  keyword: FormControl = new FormControl('')
  products: Array<any> = []
  base: string = environment.base
  cartItems: any = []
  addressMode: string = 'add'
  cartSubtotal: number = 0
  cartTotal: number = 0
  cartDiscount: number = 0
  cart: any = []
  subTotal: any = 0
  showTransactionId: boolean = false;
  store: FormControl = new FormControl('')
  deliveryTime: any = null;
  deliveryDate: any = null;
  settings: any = {}
  deliverySlots: Array<any> = []
  deliverySlot: any;
  emirates: Array<any> = [
    { title: "Dubai" },
    { title: "Abu Dhabi" },
    { title: "Sharjah" },
    { title: "Ajman" },
    { title: "Fujairah" },
    { title: "Ras Al Khaimah" },
    { title: "Umm Al Quwain" },
  ]

  constructor(
    private OrderService: OrdersService,
    private customerService: CustomersService,
    private Router: Router,
    private ToastrService: HotToastService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private couponsService: CouponsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private StoresService: StoresService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private DeliverySlotsService: DeliverySlotsService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.getActiveCustomers()
    this.getActiveProducts()
    this.getActiveCoupons()

    this.StoresService.getClickPoints().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.stores = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.dates = this.getNextSevenDays();
    this.deliveryDate = this.dates[0]
    this.orderForm.get('deliveryDate')?.setValue(this.deliveryDate)

    this.addressForm = new FormGroup({
      type: new FormControl('Home'),
      firstlane: new FormControl('', Validators.required),
      secondlane: new FormControl(''),
      area: new FormControl(''),
      city: new FormControl('', Validators.required),
      pincode: new FormControl(''),
      state: new FormControl('', Validators.required),
      landmark: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    })

    this.selectDeliveryDate(this.deliveryDate)
  }

  get addressControls() {
    return this.addressForm.controls
  }

  getNextSevenDays() {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i).toLocaleString();
      dates.push(date);
    }

    return dates;
  }

  formatDate(date: Date, type: string) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = daysOfWeek[date.getDay()];
    const dateNumber = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = new Date().getFullYear();

    switch (type) {
      case 'month':
        return month
        break;
      case 'day':
        return day
        break;
      case 'dateNumber':
        return dateNumber
        break
    }
  }

  getTimeSlots(e: any) {
    this.timeslots = []
    for (let store of this.stores) {
      if (store?.refid == e.value) this.timeslots.push(...store?.slots)
    }
    const providedDate = new Date(this.orderForm.get('deliveryDate')?.value);
    const currentDate = new Date();

    if (providedDate.getDate() === currentDate.getDate() &&
      providedDate.getMonth() === currentDate.getMonth() && providedDate.getFullYear() === currentDate.getFullYear()
    ) {
      const filteredTimeSlots = this.filterPassedTimeSlots(this.timeslots);
      this.timeslots = [...filteredTimeSlots]
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

    this.deliveryTime = this.timeslots[0]['refid']
    this.orderForm.get('deliveryTime')?.setValue(this.timeslots[0]['refid'])
  }

  filterPassedTimeSlots(timeslots: any = []) {
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.getHours() + ':' + currentTime.getMinutes();
    const filteredTimeSlots = timeslots.filter((slot: any) => {
      const slotEndTime = slot.to;
      const slotStartTime = slot.from;
      return slotEndTime > formattedCurrentTime || slotStartTime > formattedCurrentTime;
    });

    return filteredTimeSlots;
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      paymentMethod: ['', Validators.required],
      gst: [''],
      customerId: ['', Validators.required],
      transactionId: [''],
      additionalCharge: [''],
      products: [[], Validators.required],
      clickPoint: ['', Validators.required],
      deliveryTime: [''],
      deliveryDate: ['', Validators.required],
      deliveryType: ['0'],
      deliverySlot: ['', Validators.required]
    });
  }

  get of() {
    return this.orderForm.controls;
  }

  toggleSlot(slot: any) {
    this.deliverySlot == slot?._id ? this.deliverySlot = null : this.deliverySlot = slot?._id
    this.orderForm.get('deliverySlot')?.setValue(this.deliverySlot)
  }

  getActiveCustomers() {
    this.customerService.getActiveCustomers().subscribe((res: any) => {
      this.activeCustomersData = res?.result
      for (let customer of this.activeCustomersData) customer.name = (customer?.name ? customer?.name : ' ') + " ( " + customer?.mobile + " )"
      this.ChangeDetectorRef.markForCheck()
    })
  }

  getActiveProducts() {
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.activeProducts = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  getActiveCoupons() {
    this.couponsService.getActiveCoupons().subscribe((res: any) => {
      this.activeCoupons = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  checkPaymentmethod(event: any) {
    const method = this.orderForm.get('paymentMethod')?.value
    if (method == 'ONLINE') {
      this.showTransactionId = true
    } else {
      this.showTransactionId = false
    }
  }

  getCoupons(data: any) {
    this.couponsService.getProductCoupons({ products: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.activeCoupons = res?.result
      }
    })
  }

  selectDeliveryType(type: any) {
    if (type == '0') {
      this.orderForm.get('clickPoint')?.setValue('')
      this.orderForm.get('deliveryTime')?.setValue('')
      this.orderForm.get('deliveryDate')?.setValue('')
      this.timeslots = []
    }
    this.deliveryType = type
    this.orderForm.get('deliveryType')?.setValue(type)
  }

  selectDeliveryTime(time: any) {
    this.deliveryTime = time
    this.orderForm.get('deliverySlot')?.setValue(time?.refid)
  }

  selectDeliveryDate(date: any) {
    this.deliveryDate = date
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let deliveryDay = daysOfWeek[date.getDay()]

    let bufferHours: any = null
    let bufferMinutes: any = null

    if (date.getDate() == new Date().getDate()) {
      bufferHours = new Date().getHours()
      bufferMinutes = new Date().getMinutes()
      if (bufferHours >= 23 && bufferHours <= 0) {
        deliveryDay = daysOfWeek[date.getDay() + 1]
        bufferHours = null
        bufferMinutes = null
      } else {
        bufferHours = bufferHours + 1
      }
    }

    this.DeliverySlotsService.getSlotDetailsPerDay(deliveryDay, bufferHours, bufferMinutes).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.timeslots = res?.result
          this.timeslots.sort((a, b) => {
            // Convert time strings to Date objects for comparison
            const timeA = this.convertTo24Hour(a.from);
            const timeB = this.convertTo24Hour(b.from);
            return timeA.localeCompare(timeB);
          });

          this.deliveryTime = this.timeslots[0]['refid']
          this.orderForm.get('deliverySlot')?.setValue(this.timeslots[0]['refid'])
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })

    this.orderForm.get('deliveryDate')?.setValue(date)
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

  //Products management
  openProducts(template: TemplateRef<any>) {
    this.productsModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' })
  }

  getProducts() {
    if (this.keyword.value) {
      this.productService.searchProducts({
        page: 1, limit: 100,
        name: this.keyword.value, 'isActive': 'true', isArchive: 'false'
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.products = res?.result?.data
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.ToastrService.error(res.message)
          }
        }, error: (err: any) => {
          this.ToastrService.error(err.message)
        }
      })
    } else {
      this.products = []
    }
  }

  addToCart(product: any) {
    let isExists: boolean = this.cartItems.some((item: any) => item?._id == product?._id)
    if (isExists) {
      this.ToastrService.error('Product already exists in the cart')
    } else {
      this.cartItems.push({ ...product, quantity: product?.moq })
      this.cartSubtotal = this.cartSubtotal + product?.price?.selling * product?.moq
      this.cartTotal = this.cartSubtotal - this.cartDiscount
      this.productsModalRef?.hide()
    }
  }

  updateQuantity(type: any, product: any) {
    switch (type) {
      case 'increment':
        this.cartItems = this.cartItems.map((item: any) => {
          if (item._id == product._id) {
            if (product?.maxOrderQuantity < item.quantity + 1) {
              this.ToastrService.error(`Maximum order quantity (${product?.maxOrderQuantity}) has been reached`)
              return item
            } else {
              this.cartSubtotal = this.cartSubtotal + product?.price?.selling
              this.cartTotal = this.cartSubtotal - this.cartDiscount
              this.ToastrService.success('Product quantity updated')
              return { ...item, quantity: item.quantity + 1 }
            }
          } else {
            return item
          }
        })
        break
      case 'decrement':
        this.cartItems = this.cartItems.map((item: any) => {
          if (item._id == product._id && item.quantity > 1) {
            if (product?.moq > item.quantity - 1) {
              this.ToastrService.error(`Minimum required quantity (${product?.moq}) has been reached`)
              return item
            } else {
              this.cartSubtotal = this.cartSubtotal - product?.price?.selling
              this.cartTotal = this.cartSubtotal - this.cartDiscount
              this.ToastrService.success('Product quantity updated')
              return { ...item, quantity: item.quantity - 1 }
            }
          } else {
            return item
          }
        })
        break
    }
  }

  deleteProduct(product: any) {
    this.cartItems = this.cartItems.filter((item: any) => item._id != product._id)
    this.cartSubtotal = this.cartSubtotal - (product?.price?.selling * product?.quantity)
  }
  //Products managament

  //Customer and address management
  getCustomers() {
    if (this.customer.value) {
      this.customerService.searchCustomers({ keyword: this.customer.value, page: 1, limit: 100 }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.customers = res?.result?.data
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.ToastrService.error(res.message)
          }
        }, error: (err: any) => {
          this.ToastrService.error(err.message)
        }
      })
    } else {
      this.customers = []
    }
  }

  getAddress(template: TemplateRef<any>, customer: any) {
    this.customerDetails = customer
    this.customer.setValue(customer?.name)
    this.addressModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.customerService.getAddress({ userid: customer?.userid }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.addressDetails = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  selectAddress(address: any) {
    this.address = address
    this.orderForm.get('customerId')?.setValue(this.customerDetails?._id)
    this.addressModalRef?.hide()
    for (let _key of Object.keys(address)) {
      this.addressForm.get(_key)?.setValue(address[_key])
      this.orderForm.get('latitude')?.setValue(address?.coordinates?.latitude)
      this.orderForm.get('longitude')?.setValue(address?.coordinates?.longitude)
    }
  }

  openManage(template: TemplateRef<any>) {
    this.manageAddressModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' })
    this.addressModalRef?.hide()
    this.address ? this.addressMode = 'update' : this.addressMode = 'add'
    if (this.address) {
      for (let _key of Object.keys(this.address)) this.addressForm.get(_key)?.setValue(this.address[_key])
    }
  }

  manageAddress() {
    switch (this.addressMode) {
      case 'add':
        this.customerService.addAddress({
          ...this.addressForm.value,
          customer: this.customerDetails?._id,
          coordinates: {
            latitude: this.addressForm.get('latitude')?.value,
            longitude: this.addressForm.get('longitude')?.value
          }
        }).subscribe({
          next: (res: any) => {
            if (res?.errorCode == 0) {
              this.address = res?.result
              this.ToastrService.success(res?.message)
              this.manageAddressModalRef?.hide()
              this.BsModalService.show(this.addressModal, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
              this.customerService.getAddress({ userid: this.customerDetails?.userid }).subscribe({
                next: (res: any) => {
                  if (res?.errorCode == 0) {
                    this.addressDetails = res?.result
                    this.ChangeDetectorRef.markForCheck()
                  } else {
                    this.ToastrService.error(res.message)
                  }
                }, error: (err: any) => {
                  this.ToastrService.error(err.message)
                }
              })
            } else {
              this.ToastrService.error(res.message)
            }
          }, error: (err: any) => {
            this.ToastrService.error(err.message)
          }
        })
        break
      case 'update':
        this.customerService.updateCustomerAddress({
          refid: this.address?.refid,
          ...this.addressForm.value,
          coordinates: {
            latitude: this.addressForm.get('latitude')?.value,
            longitude: this.addressForm.get('longitude')?.value
          }
        }).subscribe({
          next: (res: any) => {
            if (res?.errorCode == 0) {
              this.address = res?.result
              this.ChangeDetectorRef.markForCheck()
              this.manageAddressModalRef?.hide()
              this.ToastrService.success(res?.message)
            } else {
              this.ToastrService.error(res.message)
            }
          }, error: (err: any) => {
            this.ToastrService.error(err.message)
          }
        })
        break
    }
  }
  //Customer and address management

  createOrder() {
    this.orderForm.get('customerId')?.setValue(this.customerDetails?._id)
    this.orderForm.get('products')?.setValue(this.cartItems)

    if (!this.orderForm.valid) {
      this.isSubmitted = true
      return;
    }

    let payload = {
      address: this.addressForm.value,
      ...this.orderForm.value
    }

    payload.address['coords'] = {
      latitude: this.addressForm.get('latitude')?.value,
      longitude: this.addressForm.get('longitude')?.value
    }

    this.OrderService.addOrder(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.orders.ORDERS_LIST])
          this.ToastrService.success(res.message)
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }
}
