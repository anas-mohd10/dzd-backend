
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { InvoiceSettingsService } from 'src/app/includes/services/invoice.settings.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { environment } from 'src/environments/environment.prod';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  form: FormGroup
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
  allProduct: FormControl = new FormControl('')
  statusList: Array<any> = []
  orderStatus: string = ''
  orderStatusList: Array<any> = ['PLACED', 'DELIVERED', 'CANCELLED', 'COLLECTED']
  orderStatusCheck: Array<any> = ['Placed', 'Delivered', 'Cancelled', 'Collected']
  isCancelEligible: boolean = false
  invoiceStatusList: Array<any> = ['PENDING', 'PLACED']
  isInvoiceAvailable: boolean = false
  modalRef?: BsModalRef;
  isCancelled: boolean = false

  deliveryPerson: FormControl = new FormControl('', Validators.required)
  dateExpected: FormControl = new FormControl('', Validators.required)
  trackingURL: FormControl = new FormControl('')
  trackingNo: FormControl = new FormControl('')
  minimumDate: string = new Date().toISOString().split('T')[0]
  expectedModalRef?: BsModalRef
  @ViewChild('execptedDelivery') expectedDeliveryModal: TemplateRef<any>
  deliveryModalRef?: BsModalRef
  @ViewChild('deliveryStaff') deliveryModal: TemplateRef<any>
  isDateSubmitted: boolean = false
  productReference: string = ''
  reason: FormControl = new FormControl('')

  constructor(
    private OrdersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private ToastrService: ToastrService,
    private formBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private invoiceService: InvoiceSettingsService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService
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
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      paymentStatus: [''],
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
    this.OrdersService.getOrderDetails({ order: this.slug }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.order = res?.result
        this.orderNumber = res?.result?.orderNo
        this.productCount = this.order.products.length
        this.order.orderDate = new Date(this.order.orderDate).toDateString()
        this.form.get("paymentStatus")?.setValue(this.order?.paymentStatus)
        this.form.get("orderId")?.setValue(this.order?.payment?.reference?.payment)
        this.form.get("paymentId")?.setValue(this.order?.payment?.referenceId)
        this.orderStatus = res.result.orderStatus.charAt(0).toUpperCase() + res.result.orderStatus.slice(1).toLowerCase();
        this.orderStatusList.includes(res.result.orderStatus) ? this.isCancelEligible = false : this.isCancelEligible = true
        this.invoiceStatusList.includes(res.result.orderStatus) ? this.isInvoiceAvailable = false : this.isInvoiceAvailable = true
        res.result.orderStatus == 'CANCELLED' ? this.isCancelled = true : this.isCancelled = false
        if (this.order.orderStatus == 'CANCELLED') {
          if (this.order.cancel.date) this.order.cancel.date = new Date(this.order.cancel.date).toDateString()
        }

        for (let product of this.order?.products) {
          for (let history of product?.history) {
            history.status = history.status.charAt(0).toUpperCase() + history.status.slice(1).toLowerCase();
            history.date = new Date(history.date).toDateString() + ' ' + new Date(history.date).toLocaleTimeString()
          }
          let history = [...product?.history]
          if (product?.dateExpected) product.dateExpected = new Date(product?.dateExpected).toDateString()
          product.currentStatus = history.pop()
        }

        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  getStatusList(status: any) {
    this.OrdersService.getStatusList(status, this.order?.deliveryType == '0' ? 'normal' : 'collect').subscribe({
      next: (res: any) => {
        this.statusList = res?.result
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.ToastrService.error("Couldn't fetch order status list")
      }
    })
  }

  updateOrderStatus(event: any, product: any) {
    this.productReference = product
    this.OrdersService.updateOrderStatus({
      order: this.order.orderNo,
      product: product,
      status: event.target.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails()
          switch (event.target.value) {
            case 'ACCEPTED':
              this.expectedModalRef = this.BsModalService.show(this.expectedDeliveryModal,
                { class: 'modal-dialog-centered', ignoreBackdropClick: true })
              break
            case 'OUT FOR DELIVERY':
              this.deliveryModalRef = this.BsModalService.show(this.deliveryModal,
                { class: 'modal-dialog-centered', ignoreBackdropClick: true })
              break
          }
          this.ToastrService.success(res.message)
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  updateOrderDetails(type: any) {
    switch (type) {
      case 'accepted':
        if (!this.dateExpected.valid) {
          this.isDateSubmitted = true
          return
        }

        this.OrdersService.updateOrderProducts({
          order: this.order.orderNo, product: this.productReference,
          dateExpected: this.dateExpected.value, trackingURL: this.trackingURL.value,
          trackingNo: this.trackingNo.value
        }).subscribe({
          next: (res: any) => {
            if (res?.errorCode == 0) {
              this.getOrderDetails()
              this.expectedModalRef?.hide()
              this.ToastrService.success(res.message)
            } else {
              this.ToastrService.error(res.message)
            }
          }, error: (err: any) => {
            this.ToastrService.error(err.message)
          }
        })
        break
      case 'outForDelivery':
        this.OrdersService.updateOrderProducts({
          order: this.order.orderNo, product: this.productReference,
          deliveryPerson: this.deliveryPerson.value
        }).subscribe({
          next: (res: any) => {
            if (res?.errorCode == 0) {
              this.getOrderDetails()
              this.deliveryModalRef?.hide()
              this.ToastrService.success(res.message)
            } else {
              this.ToastrService.error(res.message)
            }
          }, error: (err: any) => {
            this.ToastrService.error(err.message)
          }
        })
        break
    }
  }

  updateProductPayment(event: any, product: any) {
    this.OrdersService.updateProductPayment({ order: this.order.orderNo, product: product.productId._id, status: event.target.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails()
          this.ToastrService.success(res.message)
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
      }
    })
  }

  openOrderAcceptance(template: TemplateRef<any>, productDetails: any) {
    this.expectedModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' })
    this.dateExpected.setValue(new Date(productDetails?.dateExpected).toISOString().split('T')[0])
    this.trackingURL.setValue(productDetails?.trackingURL)
    this.trackingNo.setValue(productDetails?.trackingNo)
    this.productReference = productDetails?.productId?._id
  }

  openOrderForDelivery(template: TemplateRef<any>, productDetails: any) {
    this.deliveryModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' })
    this.deliveryPerson.setValue(productDetails?.deliveryPerson)
    this.productReference = productDetails?.productId?._id
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
    this.OrdersService.updateOrder({ ...this.form.value, order: this.orderNumber }).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.ToastrService.error(res?.message);
      } else if (res.errorCode == 0) {
        this.ToastrService.success(res?.message);
        this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
      }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
  }

  confirm() {
    this.OrdersService.cancelOrderDetails({ order: this.orderNumber, reason: this.reason.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails()
          this.ToastrService.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.modalRef?.hide()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  decline() {
    this.modalRef?.hide()
  }
}
