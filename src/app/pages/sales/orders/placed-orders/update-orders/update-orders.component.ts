
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { InvoiceSettingsService } from 'src/app/includes/services/invoice.settings.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { SwiperOptions } from 'swiper';

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
  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 50,
    navigation: { nextEl: "#next", prevEl: '#prev' },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: true,
    breakpoints: {
      320: {
        slidesPerView: 'auto',
        spaceBetween: 35
      }, 480: {
        slidesPerView: 'auto',
        spaceBetween: 35
      }, 640: {
        slidesPerView: 'auto',
        spaceBetween: 35
      }
    }
  }
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
  isPackingSlipAvailable: boolean = false
  modalRef?: BsModalRef;
  isCancelled: boolean = false
  bulkOrderStatus: FormControl = new FormControl('')
  productOrderStatus: FormControl = new FormControl('')
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
  orderNote: FormControl = new FormControl('')
  reason: FormControl = new FormControl('')
  isNoteDetected: boolean = false
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  domainUrl: string = ''

  constructor(
    private OrdersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private invoiceService: InvoiceSettingsService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private Toast: HotToastService
  ) { }

  getLocaleDateString(date: string) {
    return new Date(date).toLocaleString()
  }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.order || ''
    this.getOrderDetails()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.domainUrl = res?.result?.domainUrl + '/api/v1/w/admin/auth/generate-invoice/'
          this.ChangeDetectorRef.markForCheck()
        }else{

        }
      }, error: (err: any) => {

      }
    })
  }

  formdateDate(date: any) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return `${days[new Date(date).getDay()]}, ${this.months[new Date(date).getMonth()]} ${new Date(date).getDate()} ${new Date(date).getFullYear()}`
  }

  acceptOrderPayment() {
    this.OrdersService.orderPaymentAcceptance(this.order?.orderNo.split('#')[1]).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails()
          this.Toast.success(res?.message)
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      paymentStatus: [''],
      orderId: [''],
      paymentMessage: [''],
      transactionTime: [''],
      paymentId: ['']
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

  saveNote() {
    if (this.orderNote.value) {
      this.OrdersService.updateOrder({ order: this.orderNumber, orderNote: this.orderNote.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.getOrderDetails()
            this.isNoteDetected = false
            this.Toast.success(res?.message)
          } else {
            this.Toast.error(res?.message)
          }
        }, error: (err: any) => {
          this.Toast.error(err?.error?.message)
        }
      })
    }
  }

  detechNoteChanges() {
    this.orderNote.value ? this.isNoteDetected = true : this.isNoteDetected = false
  }

  getLocalDate(date: any) {
    return `${new Date(date).toLocaleString()}`
  }

  getLocaleDateFormat(data: any) {
    return new Date(data).toLocaleDateString()
  }

  getLocaleTimeFormat(data: any) {
    return new Date(data).toLocaleTimeString()
  }


  getOrderDetails() {
    this.OrdersService.getOrderDetails({ order: this.slug }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.order = res?.result
        this.orderNumber = res?.result?.orderNo
        this.productCount = this.order.products.length
        this.form.get("paymentStatus")?.setValue(this.order?.paymentStatus)
        this.orderNote?.setValue(this.order?.orderNote)
        this.form.get("orderId")?.setValue(this.order?.payment?.reference?.payment || this.order?.payment?.authorizationId)
        this.form.get("paymentMessage")?.setValue(this.order?.paymentMessage)
        this.form.get("transactionTime")?.setValue(this.order?.transactionTime)
        this.form.get("paymentId")?.setValue(this.order?.payment?.referenceId)
        this.orderStatus = res.result.orderStatus.charAt(0).toUpperCase() + res.result.orderStatus.slice(1).toLowerCase();
        this.orderStatusList.includes(res.result.orderStatus) ? this.isCancelEligible = false : this.isCancelEligible = true
        this.invoiceStatusList.includes(res.result.orderStatus) ? this.isInvoiceAvailable = false : this.isInvoiceAvailable = true
        this.invoiceStatusList.includes(res.result.orderStatus) ? this.isPackingSlipAvailable = false : this.isPackingSlipAvailable = true

        if (this.order.orderStatus == 'CANCELLED') {
          this.isCancelled = true
          if (this.order?.cancel?.date) {
            this.order.cancel.date = new Date(this.order?.cancel?.date).toLocaleString()
          }
        }

        for (let product of this.order?.products) {
          for (let history of product?.history) {
            history.status = history.status.charAt(0).toUpperCase() + history.status.slice(1).toLowerCase();
          }
          let history = [...product?.history]
          if (product?.dateExpected) product.dateExpected = new Date(product?.dateExpected).toLocaleString()
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
        this.Toast.error("Couldn't fetch order status list")
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
          this.productOrderStatus.setValue('')
          this.Toast.success(res.message)
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
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
              this.Toast.success(res.message)
            } else {
              this.Toast.error(res.message)
            }
          }, error: (err: any) => {
            this.Toast.error(err.message)
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
              this.Toast.success(res.message)
            } else {
              this.Toast.error(res.message)
            }
          }, error: (err: any) => {
            this.Toast.error(err.message)
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
          this.Toast.success(res.message)
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  openOrderAcceptance(template: TemplateRef<any>, productDetails: any) {
    this.expectedModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' })
    productDetails?.dateExpected ? this.dateExpected.setValue(new Date(productDetails?.dateExpected).toISOString().split('T')[0]) : null
    this.trackingURL.setValue(productDetails?.trackingURL)
    this.trackingNo.setValue(productDetails?.trackingNo)
    this.productReference = productDetails?.productId?._id
  }

  openOrderForDelivery(template: TemplateRef<any>, productDetails: any) {
    this.deliveryModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' })
    this.deliveryPerson.setValue(productDetails?.deliveryPerson)
    this.productReference = productDetails?.productId?._id
  }

  bulkProducts: Array<any> = []
  bulkStatus: Array<any> = []

  toggleBulkProduct(product?: any) {
    if (product) {
      const index = this.bulkProducts.indexOf(product)
      if (index > -1) {
        this.bulkProducts.splice(index, 1)
      } else {
        this.bulkProducts.push(product)
      }
    }else{

    }
    
    product ? null : this.bulkProducts.length == this.order?.products.length ? this.bulkProducts = [] : this.bulkProducts = [...this.order?.products]
    //Check the last status of the product, if cancelled then don't allow to change the status

    this.bulkProducts.length > 0 ? this.toggleBulkStatus() : null
  }

  toggleBulkStatus() {
    this.OrdersService.getStatusList(this.order?.orderStatus, this.order?.deliveryType == '0' ? 'normal' : 'collect').subscribe({
      next: (res: any) => {
        this.bulkStatus = res?.result
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.Toast.error("Couldn't fetch order status list")
      }
    })
  }

  updateBulkProduct(event: any) {
    this.OrdersService.updateBulkProduct({
      order: this.order?.orderNo,
      status: event?.target?.value,
      products: this.bulkProducts
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.bulkProducts = []
          this.bulkStatus = []
          this.bulkOrderStatus.setValue('')
          this.getOrderDetails()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
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
    this.OrdersService.updateOrder({ ...this.form.value, order: this.orderNumber }).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.Toast.error(res?.message);
      } else if (res.errorCode == 0) {
        this.Toast.success(res?.message);
        this.router.navigate([this.appRoute.orders.ORDERS_LIST]);
      }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
  }

  confirm() {
    this.OrdersService.cancelOrderDetails({ order: this.orderNumber, reason: this.reason.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrderDetails()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.modalRef?.hide()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.message)
      }
    })
  }

  decline() {
    this.reason.setValue('')
    this.modalRef?.hide()
  }
}
