import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import { CartService } from 'src/app/includes/services/cart.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})

export class CartListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  cartsData: any
  cartForm: FormGroup;

  customers: any = [];
  customer: any

  products: any = [];
  product: any

  status = new FormControl('')
  isErrors: any = false
  carts: any = []
  isTable: Boolean = false
  user: any = ''
  form: any
  message: any = new FormControl('', Validators.required)
  couponCode: any = new FormControl('')
  mobile: any

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private customerService: CustomersService,
    private cdr: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.customerService.getActiveCustomers().subscribe((res: any) => {
      this.customers = res?.result
      this.cdr.markForCheck()
    })

    this.cartService.getCarts({}).subscribe((res: any) => {
      this.carts = res?.result
      for (let cart of this.carts) {
        cart.date.added = new Date(cart?.date?.added).toDateString()
      }
      this.cdr.markForCheck()
      this.dtTrigger.next();
    })

    this.form = new FormGroup({
      message: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      couponCode: new FormControl('', Validators.required)
    })
  }

  clearFilter() {
    this.customer = null
    this.customerService.getActiveCustomers().subscribe((res: any) => {
      if (res?.errorCode == 0) { }
      this.customers = res?.result
      this.cdr.markForCheck()
    })

    this.cartService.getCarts({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.carts = res?.result
        for (let cart of this.carts) {
          cart.date.added = new Date(cart?.date?.added).toDateString()
        }
        this.cdr.markForCheck()
      }
    })
  }

  seachCart() {
    let body = { customer: this.customer }
    this.cartService.getCarts(body).subscribe((res: any) => {
      this.carts = res?.result
      this.cdr.markForCheck()
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getUser(user: any, mobile: any) {
    this.user = user
    this.mobile = mobile
  }

  closeModal() {
    this.form.reset()
  }

  sendPush() {
    if (!this.form.valid) {
      this.isErrors = true
      return
    }

    let payload = { title: this.form.get('title')?.value, message: this.form.get('message')?.value, couponCode: this.form.get('couponCode')?.value, mobile: this.mobile, countryCode: "+91" }
    this.cartService.sendCartNotification(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.form.reset()
      } else {
        this.ToastrService.error('Coupon unavailable. Kindly add coupon')
      }
    })
  }
}
