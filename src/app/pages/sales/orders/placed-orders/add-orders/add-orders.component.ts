import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  cart: any = []
  base: string;
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
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private couponsService: CouponsService,
    private cdr: ChangeDetectorRef,
    private StoresService: StoresService,
    private AppSettingsService: AppSettingsService
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
      type: ['', Validators.required],
      firstlane: ['', Validators.required],
      secondlane: [''],
      area: [''],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      state: ['', Validators.required],
      gst: [''],
      landmark: ['', Validators.required],
      lat: [''],
      lng: [''],
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

  getAddress() {
    this.selectedCustomer ? this.isCustomer = true : this.isCustomer = false
    this.customerService.getAddressDetails({ customer: this.selectedCustomer }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orderForm.get('firstlane')?.setValue(res?.result?.firstlane)
        this.orderForm.get('secondlane')?.setValue(res?.result?.secondlane)
        this.orderForm.get('type')?.setValue(res?.result?.type)
        this.orderForm.get('area')?.setValue(res?.result?.area)
        this.orderForm.get('city')?.setValue(res?.result?.city)
        this.orderForm.get('landmark')?.setValue(res?.result?.landmark)
        this.orderForm.get('pincode')?.setValue(res?.result?.pincode)
        this.orderForm.get('state')?.setValue(res?.result?.state)
        this.orderForm.get('lat')?.setValue(res?.result?.coordinates?.lat)
        this.orderForm.get('lng')?.setValue(res?.result?.coordinates?.lng)
        this.cdr.markForCheck()
      }
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
    if (this.product) {
      let cartLength = this.cart.length
      this.productService.getProductById({ id: this.product }).subscribe((res: any) => {
        let productData = res?.result[0]
        let price = productData?.price
        let total = (price?.mrp > price?.offer ? price?.offer : price?.mrp) * Number(this.quantity?.value)
        this.cart.push({
          productId: this.product,
          quantity: this.quantity?.value,
          name: productData?.name,
          total: total,
          refid: productData?.prodid,
          id: this.cart.length,
          image: productData?.thumbnail,
          brand: productData?.product?.id?.brand?.name,
          price: { mrp: productData?.price?.mrp, offer: productData?.price?.offer }
        })

        this.subTotal = this.subTotal + total
        if (!this.productids.includes(this.product)) this.productids.push(this.product)
        if (this.productids.length > 0) this.getCoupons(this.productids)
        this.isProducts = true
        document.querySelector('.added-to-cart')?.classList.add('show-added')
        let newCartLength = this.cart.length
        if (newCartLength > cartLength) this.product = null
        setTimeout(() => {
          document.querySelector('.added-to-cart')?.classList.remove('show-added')
        }, 2000)
        this.cdr.markForCheck()
      })
    } else {
      this.toastr.error('Add atleast one product to cart')
    }
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

  updateOrder() { }

  addOrder() {
    if (!this.orderForm.valid || !this.selectedCustomer) {
      this.toastr.error('Kindly fill required fields');
      this.selectedCustomer ? this.isCustomer = true : this.isCustomer = false
      return;
    }

    let data = this.orderForm.value
    let payload = {
      customerId: this.selectedCustomer,
      address: {
        type: data?.type,
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
              this.toastr.error(res?.message);
            } else if (res.errorCode == 0) {
              this.toastr.success(res?.message);
              this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
            }
          })
        } else {
          this.toastr.error('Choose a time to collect');
        }
      } else {
        this.orderService.addOrder(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
          }
        })
      }
    } else {
      this.toastr.error('Add atleast one product to place the order');
    }
  }
}
