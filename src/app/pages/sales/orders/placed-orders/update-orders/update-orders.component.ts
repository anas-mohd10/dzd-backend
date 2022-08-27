
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';

@Component({
  selector: 'app-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.scss']
})
export class UpdateOrdersComponent implements OnInit {
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
    this.orderService.getOrdersByNumber(this.orderNumber).subscribe((res: any) => {
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
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }
  addProduct() {
  }

  updateProduct() {
    console.log("Button clicked");
    console.log(this.orderForm.value);
    this.orderService.updateOrder(this.orderNumber, this.orderForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong', '', {
          progressBar: true,
          easing: 'ease-in'
        });
      } else if (res.errorCode == 0) {
        this.toastr.success('Order updated successfully', '', {
          progressBar: true,
          easing: 'ease-in'
        });
        this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
      }
    })
  }
}
