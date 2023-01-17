import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { ProductService } from 'src/app/includes/services/product.service';
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

  //Cart
  product: any;
  quantity: any = new FormControl(1, Validators.required);
  coupon: any
  productids: any = []

  cart: any = []
  base: string;
  showTransactionId: boolean = false;

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
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.getActiveCustomers()
    this.getActiveProducts()
    this.getActiveCoupons()
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      paymentMethod: ['', Validators.required],
      firstline: ['', Validators.required],
      secondline: [''],
      area: [''],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      state: ['', Validators.required],
      gst: [''],
      landmark: ['', Validators.required],
      lat: [''],
      lng: [''],
      coupon: [''],
      transactionId: [''],
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
    this.customerService.getCustomerBySlug(this.selectedCustomer).subscribe((res: any) => {
      this.customerId = res?.result[0]._id
      this.orderForm.get("firstline")?.setValue(res?.result[0].address.firstline)
      this.orderForm.get("secondline")?.setValue(res?.result[0].address.secondline)
      this.orderForm.get("city")?.setValue(res?.result[0].address.city)
      this.orderForm.get("area")?.setValue(res?.result[0].address.area)
      this.orderForm.get("pincode")?.setValue(res?.result[0].address.pincode)
      this.orderForm.get("lat")?.setValue(res?.result[0].address.lat)
      this.orderForm.get("lng")?.setValue(res?.result[0].address.lng)
      this.orderForm.get("state")?.setValue(res?.result[0].address.state)
      this.orderForm.get("landmark")?.setValue(res?.result[0].address.landmark)
    })
  }

  checkPaymentmethod(event: any) {
    console.log(this.orderForm.get('paymentMethod')?.value);

    const method = this.orderForm.get('paymentMethod')?.value
    if (method == 'ONLINE') {
      this.showTransactionId = true
    } else {
      this.showTransactionId = false
    }
  }

  add() {
    if (this.product) {
      let productData: any
      let cartLength = this.cart.length
      this.productService.getProductById({ id: this.product }).subscribe((res: any) => {
        productData = res?.result[0]
        this.cart.push({
          productId: this.product,
          quantity: this.quantity?.value,
          name: productData?.name,
          refid: productData?.prodid,
          id: this.cart.length,
          image: productData?.thumbnail,
          brand: productData?.product?.id?.brand?.name,
          price: {
            mrp: productData?.price?.mrp,
            offer: productData?.price?.offer
          }
        })

        if (!this.productids.includes(this.product)) {
          this.productids.push(this.product)
        }

        if (this.productids.length > 0) {
          this.getCoupons(this.productids)
        }

        this.isProducts = true

        document.querySelector('.added-to-cart')?.classList.add('show-added')
        let newCartLength = this.cart.length
        if (newCartLength > cartLength) {
          this.product = null
        }

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
    this.couponsService.getCouponsByProduct({ products: data }).subscribe((res: any) => {
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
    if (this.cart[i]['quantity'] == 0) {
      this.cart.splice(i, 1)
    }

    let products = []
    for (let item of this.cart) {
      products.push(item?.productId)
    }

    if (this.cart.length == 0) {
      this.isProducts = false
    }
    this.getCoupons(products)
  }

  removeProduct(i: number) {
    this.cart.splice(i, 1)
    if (this.cart.length == 0) {
      this.isProducts = false
    }
  }

  addOty(i: number) {
    this.cart[i]['quantity'] = this.cart[i]['quantity'] + 1
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateOrder();
    } else {
      this.addOrder();
    }
  }

  updateOrder() { }

  addOrder() {
    if (!this.orderForm.valid) {
      this.toastr.error('Kindly fill required fields');
      return;
    }

    let data = this.orderForm.value
    let payload = {
      customerId: this.customerId,
      address: {
        firstline: data.firstline,
        secondline: data.secondline,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        lat: data.lat,
        lng: data.lng,
        landmark: data.landmark,
      },
      couponId: this.coupon ? this.coupon : '',
      product: this.cart,
      gst: data.gst,
      paymentMethod: data.paymentMethod,
      transactionId: data?.transactionId
    }
    if (this.cart.length != 0) {
      this.orderService.addOrder(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
        }
      })
    } else {
      this.toastr.error('Add atleast one product to place the order');
    }
  }
}
