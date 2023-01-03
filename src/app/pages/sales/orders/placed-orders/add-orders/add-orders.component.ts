import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { ProductService } from 'src/app/includes/services/product.service';

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

  products(): FormArray {
    return this.orderForm.get("products") as FormArray
  }

  newProduct(): FormGroup {
    return this.formBuilder.group({
      productId: '',
      quantity: '',
    })
  }

  addQuantity() {
    this.products().push(this.newProduct());
  }

  removeQuantity(i: number) {
    this.products().removeAt(i);
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
      couponId: data.coupon,
      product: data.products,
      gst: data.gst,
      paymentMethod: data.paymentMethod
    }
    if (data.products.length != 0) {
      this.orderService.addOrder(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
        }
      })
    } else {
      this.toastr.error('Add atleast one product to place the order', 'Add product');
    }
  }
}
