import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';

@Component({
  selector: 'app-update-pending-orders',
  templateUrl: './update-pending-orders.component.html',
  styleUrls: ['./update-pending-orders.component.scss']
})
export class UpdatePendingOrdersComponent implements OnInit {
  appRoute = appRoutes
  orderData: any;
  productCount: any
  orderNumber: any;
  orderForm: FormGroup
  task = PageTasks.UPDATE
  editMode = false;
  totalProductCost: number;
  orderNo: any;
  isSubmitted: boolean;
  price: any = 0

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.orderNumber = this.route.snapshot.queryParams.order || ''
    this.getOrderDetails()
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      orderStatus: [''],
      trackingURL: [''],
      orderNote: [''],
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
    this.orderService.getPendingOrdersByNumber(this.orderNumber).subscribe((res: any) => {
      this.orderData = res?.result[0]
      this.productCount = this.orderData.product.length
      this.orderData.orderDate = new Date(this.orderData.orderDate).toDateString()
      this.orderForm.get("orderStatus")?.setValue(this.orderData?.orderStatus)
      this.orderForm.get("trackingURL")?.setValue(this.orderData?.trackingURL)
      this.orderForm.get("orderNote")?.setValue(this.orderData?.orderNote)
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
    this.orderService.updateOrder(this.orderNumber, this.orderForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Order updated successfully');
        this.router.navigate([this.appRoute.orders.PENDING_ORDERS_LIST]);
      }
    })
  }

}
