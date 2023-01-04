import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import { CartService } from 'src/app/includes/services/cart.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { ProductService } from 'src/app/includes/services/product.service';

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

  carts: any = []
  isTable: Boolean = false

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private customerService: CustomersService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.productService.getActiveProduct().subscribe((res: any) => {
      this.products = res?.result
      this.cdr.markForCheck()
    })

    this.customerService.getActiveCustomers().subscribe((res: any) => {
      this.customers = res?.result
      this.cdr.markForCheck()
    })

    this.cartService.getCarts().subscribe((res: any) => {
      this.carts = res?.result
      for (let cart of this.carts) {
        cart.date = new Date(cart?.date).toLocaleString()
        cart.purchasedDate = new Date(cart?.purchasedDate).toLocaleString()
      }
      this.cdr.markForCheck()
      this.dtTrigger.next();
    })
  }

  reloadPage() {
    window.location.reload()
  }

  seachCart() {
    const body = {
      customer: this.customer ? this.customer : '',
      product: this.product ? this.product : '',
      status: this.status?.value ? this.status?.value : ''
    }

    this.cartService.searchCart(body).subscribe((res: any) => {
      this.carts = res?.result
      this.cdr.markForCheck()
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
