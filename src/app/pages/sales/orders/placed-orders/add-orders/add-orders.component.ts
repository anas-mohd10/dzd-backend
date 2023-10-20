import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
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


  constructor(
    private orderService: OrdersService,
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
    private ToastrService: ToastrService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private couponsService: CouponsService,
    private cdr: ChangeDetectorRef,
    private StoresService: StoresService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.getActiveCustomers()
    this.getActiveProducts()
    this.getActiveCoupons()

    this.StoresService.getClickPoints().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.stores = res?.result
        this.cdr.markForCheck()
      }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.dates = this.getNextSevenDays();
    this.deliveryDate = this.dates[0]

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
      const formattedDate = this.formatDate(date)
      dates.push(formattedDate);
    }

    return dates;
  }

  formatDate(date: Date): string {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = daysOfWeek[date.getDay()];
    const dateNumber = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = new Date().getFullYear();
    return `${day} ${dateNumber} ${month} ${year}`;
  }

  getTimeSlots(e: any) {
    this.timeslots = []
    for (let store of this.stores) {
      if (store?.refid == e.value) this.timeslots.push(...store?.slots)
    }
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      paymentMethod: ['', Validators.required],
      gst: [''],
      transactionId: [''],
      additionalCharge: [''],
      products: this.formBuilder.array([]),
    });
  }

  get of() {
    return this.orderForm.controls;
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

  getActiveCustomers() {
    this.customerService.getActiveCustomers().subscribe((res: any) => {
      this.activeCustomersData = res?.result
      for (let customer of this.activeCustomersData) customer.name = (customer?.name ? customer?.name : ' ') + " ( " + customer?.mobile + " )"
      this.cdr.markForCheck()
    })
  }

  getActiveProducts() {
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.activeProducts = res?.result
      this.cdr.markForCheck()
    })
  }

  getActiveCoupons() {
    this.couponsService.getActiveCoupons().subscribe((res: any) => {
      this.activeCoupons = res?.result
      this.cdr.markForCheck()
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

  add() {

  }

  getCoupons(data: any) {
    this.couponsService.getProductCoupons({ products: data }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.activeCoupons = res?.result
      }
    })
  }

  removeQuantity(i: number) {
    this.cart().removeAt(i);
  }

  removeQty(i: number) {
    this.cart[i]['quantity'] = this.cart[i]['quantity'] - 1
    this.cart[i]['total'] = this.cart[i]['total'] - (this.cart[i]?.price?.mrp > this.cart[i]?.price?.offer ? this.cart[i]?.price?.offer : this.cart[i]?.price?.mrp)
    this.subTotal = this.subTotal - (this.cart[i]?.price?.mrp > this.cart[i]?.price?.offer ? this.cart[i]?.price?.offer : this.cart[i]?.price?.mrp)
    if (this.cart[i]['quantity'] == 0) this.cart.splice(i, 1)
    let products = []
    for (let item of this.cart) products.push(item?.productId)
    if (this.cart.length == 0) this.isProducts = false
    this.getCoupons(products)
  }

  removeProduct(i: number) {
    this.cart.splice(i, 1)
    if (this.cart.length == 0) this.isProducts = false
  }

  addOty(i: number) {
    this.cart[i]['quantity'] = this.cart[i]['quantity'] + 1
    this.cart[i]['total'] = this.cart[i]['total'] + (this.cart[i]?.price?.mrp > this.cart[i]?.price?.offer ? this.cart[i]?.price?.offer : this.cart[i]?.price?.mrp)
    this.subTotal = this.subTotal + (this.cart[i]?.price?.mrp > this.cart[i]?.price?.offer ? this.cart[i]?.price?.offer : this.cart[i]?.price?.mrp)
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateOrder();
    } else {
      this.addOrder();
    }
  }

  selectDeliveryType(type: any) {
    this.store?.setValue(null)
    this.deliveryType = type
    this.deliveryTime = null
    this.deliveryDate = null
    this.timeslots = []
  }

  selectDeliveryTime(time: any) {
    this.deliveryTime = time
  }

  selectDeliveryDate(date: any) {
    this.deliveryDate = date
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
            this.cdr.markForCheck()
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
      this.cartItems.push({ ...product, quantity: 1 })
      this.cartSubtotal = this.cartSubtotal + product?.price?.selling
      this.cartTotal = this.cartSubtotal - this.cartDiscount
      this.productsModalRef?.hide()
    }
  }

  updateQuantity(type: any, product: any) {
    switch (type) {
      case 'increment':
        this.cartItems = this.cartItems.map((item: any) => {
          if (item._id == product._id) {
            this.cartSubtotal = this.cartSubtotal + product?.price?.selling
            this.cartTotal = this.cartSubtotal - this.cartDiscount
            this.ToastrService.success('Product quantity updated')
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
        break
      case 'decrement':
        this.cartItems = this.cartItems.map((item: any) => {
          if (item._id == product._id && item.quantity > 1) {
            this.cartSubtotal = this.cartSubtotal - product?.price?.selling
            this.cartTotal = this.cartSubtotal - this.cartDiscount
            this.ToastrService.success('Product quantity updated')
            return { ...item, quantity: item.quantity - 1 }
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
            this.cdr.markForCheck()
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
          this.cdr.markForCheck()
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
    this.addressModalRef?.hide()
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
                    this.cdr.markForCheck()
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
              this.cdr.markForCheck()
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

  updateOrder() { }

  addOrder() {
    if (!this.orderForm.valid) {
      this.ToastrService.error('Kindly fill required fields');
      this.selectedCustomer ? this.isCustomer = true : this.isCustomer = false
      return;
    }

    let data = this.orderForm.value
    let payload = {
      customerId: this.selectedCustomer,
      address: {
        type: this.orderForm.get,
        firstlane: data.firstlane,
        secondlane: data.secondlane,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        coordinates: {
          lat: data.lat,
          lng: data.lng,
        },
        landmark: data.landmark,
      },
      couponId: this.coupon ? this.coupon : '',
      products: this.cart,
      gst: data.gst,
      paymentMethod: data.paymentMethod,
      payment: {
        transactionId: data?.transactionId
      },
      deliveryType: this.deliveryType,
      deliveryTime: this.deliveryTime,
      deliveryDate: this.deliveryDate,
      additionalCharge: data.additionalCharge
    }

    if (this.cart.length != 0) {
      if (this.deliveryType == '1') {
        if (this.deliveryTime && this.deliveryDate) {
          this.orderService.addOrder(payload).subscribe((res: any) => {
            if (res.errorCode != 0) {
              this.ToastrService.error(res?.message);
            } else if (res.errorCode == 0) {
              this.ToastrService.success(res?.message);
              this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
            }
          })
        } else {
          this.ToastrService.error('Choose a time to collect');
        }
      } else {
        this.orderService.addOrder(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.ToastrService.error(res?.message);
          } else if (res.errorCode == 0) {
            this.ToastrService.success(res?.message);
            this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
          }
        })
      }
    } else {
      this.ToastrService.error('Add atleast one product to place the order');
    }
  }
}
