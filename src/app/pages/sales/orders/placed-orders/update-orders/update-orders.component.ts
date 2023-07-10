
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { InvoiceSettingsService } from 'src/app/includes/services/invoice.settings.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { environment } from 'src/environments/environment.prod';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.scss']
})
export class UpdateOrdersComponent implements OnInit {
  appRoute = appRoutes
  order: any;
  productCount: any
  orderNumber: any;
  orderForm: FormGroup
  task = PageTasks.UPDATE
  editMode = false;
  totalProductCost: number;
  orderNo: any;
  isSubmitted: boolean;
  price: any = 0
  slug: any
  base: string;
  settings: any
  processedProducts: Array<any> = []
  processProduct: FormControl = new FormControl('')

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private invoiceService: InvoiceSettingsService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.order || ''
    this.getOrderDetails()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      orderStatus: [''],
      trackingURL: [''],
      orderNote: [''],
      paymentStatus: [''],
      deliveryPerson: [''],
      deliveryDate: [''],
      outForDelivery: [''],
      dateExpected: [''],
      orderId: [''],
      paymentId: [''],
    });
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

  getOrderDetails() {

    this.orderService.getOrderDetails({ order: this.slug }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.order = res?.result
        this.orderNumber = res?.result?.orderNo
        this.productCount = this.order.products.length
        this.order.orderDate = new Date(this.order.orderDate).toDateString()
        this.orderForm.get("orderStatus")?.setValue(this.order?.orderStatus)
        this.orderForm.get("trackingURL")?.setValue(this.order?.trackingURL)
        this.orderForm.get("orderNote")?.setValue(this.order?.orderNote)
        this.orderForm.get("paymentStatus")?.setValue(this.order?.paymentStatus)
        this.orderForm.get("orderId")?.setValue(this.order?.payment?.orderId)
        this.orderForm.get("paymentId")?.setValue(this.order?.payment?.transactionId)

        let dateExpected = ''
        let outForDelivery = ''
        let deliveryDate = ''
        if (this.order?.delivery?.dateExpected) dateExpected = new Date(this.order?.delivery?.dateExpected).toISOString().split('T')[0];
        if (this.order?.delivery?.outForDelivery) outForDelivery = new Date(this.order?.delivery?.outForDelivery).toISOString().split('T')[0];
        if (this.order?.delivery?.deliveryDate) deliveryDate = new Date(this.order?.delivery?.deliveryDate).toISOString().split('T')[0];

        this.orderForm.get("deliveryPerson")?.setValue(this.order?.delivery?.deliveryPerson)
        this.orderForm.get("dateExpected")?.setValue(dateExpected)
        this.orderForm.get("outForDelivery")?.setValue(outForDelivery)
        this.orderForm.get("deliveryDate")?.setValue(deliveryDate)

        for (let product of this.order?.products) {
          for (let history of product?.history) history.date = new Date(history.date).toLocaleString()
        }

        this.cdr.markForCheck()
      }
    })
  }

  processProducts(type: any, product: any) {
    switch (type) {
      case 'all':
        if (this.order?.products.length == this.processedProducts.length) {
          this.processedProducts = []
          this.processProduct.setValue('')
        } else {
          for (let product of this.order.products) {
            this.processProduct.setValue(product?._id)
            this.processedProducts.push(product?._id)
          }
        }
        break
      case 'select':
        if (this.processedProducts.includes(product)) {
          this.processedProducts = this.processedProducts.filter(item => item !== product)
        } else {
          this.processedProducts.push(product)
        }
        break
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateOrder();
    } else {
      this.addOrder();
    }
  }

  addOrder() {
  }

  updateOrder() {
    if (this.processedProducts.length > 0) {
      this.orderService.updateOrder({ ...this.orderForm.value, products: this.processedProducts, order: this.orderNumber }).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
        }
      })
    } else {
      this.toastr.error('Please select at least one product');
    }
  }
}
