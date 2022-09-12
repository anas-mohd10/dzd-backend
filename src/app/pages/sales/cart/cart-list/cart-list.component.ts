import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import { CartService } from 'src/app/includes/services/cart.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  cartsData: any
  cartForm: FormGroup;
  customersData: any;
  productsData: any;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getProducts()
    this.getCustomers()
    this.getCartItems()
  }

  initForm() {
    this.cartForm = this.formBuilder.group({
      product: [''],
      orderStatus: [''],
      customer: [''],
    });
  }

  getCustomers() {
    this.customersService.getCustomers().subscribe((res: any) => {
      this.customersData = res?.ṛesult
    })
  }

  getProducts() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.ṛesult
    })
  }

  checkToDate() { }

  reloadPage() { }

  onSubmit() { }

  getCartItems() {
  }
}
