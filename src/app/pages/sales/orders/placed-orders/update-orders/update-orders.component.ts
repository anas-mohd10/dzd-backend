
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { environment } from 'src/environments/environment.prod';

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

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.order || ''
    this.getOrderDetails()
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
      dateExpected: ['']
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
    this.orderService.getOrdersByRefid(this.slug, {}).subscribe((res: any) => {
      this.order = res?.result?.orders[0]
      this.orderNumber = res?.result?.orders[0].orderNo
      this.productCount = this.order.product.length
      this.order.orderDate = new Date(this.order.orderDate).toDateString()
      this.orderForm.get("orderStatus")?.setValue(this.order?.orderStatus)
      this.orderForm.get("trackingURL")?.setValue(this.order?.trackingURL)
      this.orderForm.get("orderNote")?.setValue(this.order?.orderNote)
      this.orderForm.get("paymentStatus")?.setValue(this.order?.paymentStatus)

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

      this.cdr.markForCheck()
    })
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
    this.orderService.updateOrder(this.slug, this.orderForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
      }
    })
  }
}
