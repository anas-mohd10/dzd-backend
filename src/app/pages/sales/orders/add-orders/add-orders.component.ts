import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private orderService: OrdersService,
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private couponsService: CouponsService
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
      customer: ['', Validators.required],
      address: ['', Validators.required],
      gst: ['', Validators.required],
      coupon: ['', Validators.required],
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
    })
  }

  getActiveProducts() {
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.activeProducts = res?.result
    })
  }

  getActiveCoupons() {
    this.couponsService.getActiveCoupons().subscribe((res: any) => {
      this.activeCoupons = res?.result
    })
  }

  getAddress() {
    let data = this.orderForm.get("customer")?.value
    let slug = data.split(',')[1]
    this.customerService.getCustomerBySlug(slug).subscribe((res: any) => {
      this.custAddress = res?.result[0].address[0].firstline + ", " +
        res?.result[0].address[0].secondline + ", " +
        res?.result[0].address[0].city + ", " +
        res.result[0].address[0].pincode
      this.orderForm.get("address")?.setValue(this.custAddress)
    })
  }

  products(): FormArray {
    return this.orderForm.get("products") as FormArray
  }

  newProduct(): FormGroup {
    return this.formBuilder.group({
      product: '',
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
      this.toastr.error('Something wrong occured');
      return;
    }

    let data = this.orderForm.value
    data.customer = data.customer.split(",")[0]

    this.orderService.addOrder(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Order placed successfully');
        this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
      }
    })
  }
}
