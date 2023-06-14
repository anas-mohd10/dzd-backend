
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { InvoiceSettingsService } from 'src/app/includes/services/invoice.settings.service';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { environment } from 'src/environments/environment.prod';
import { saveAs } from 'file-saver';

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

  @ViewChild("productDetails", { static: true }) productDetails: ElementRef;
  @ViewChild("shippingAddress", { static: true }) shippingAddress: ElementRef;

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private invoiceService: InvoiceSettingsService
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
    this.orderService.getOrdersByRefid(this.slug, {}).subscribe((res: any) => {
      this.order = res?.result?.orders[0]
      this.orderNumber = res?.result?.orders[0].orderNo
      this.productCount = this.order.product.length
      this.order.orderDate = new Date(this.order.orderDate).toDateString()
      this.orderForm.get("orderStatus")?.setValue(this.order?.orderStatus)
      this.orderForm.get("trackingURL")?.setValue(this.order?.trackingURL)
      this.orderForm.get("orderNote")?.setValue(this.order?.orderNote)
      this.orderForm.get("paymentStatus")?.setValue(this.order?.paymentStatus)
      this.orderForm.get("orderId")?.setValue(this.order?.payment?.orderId)
      this.orderForm.get("paymentId")?.setValue(this.order?.payment?.transactionId)

      for (let history of this.order.history) {
        history['status'] = history?.status[0] + history?.status.slice(1).toLowerCase();
        history['created']['type'] = history?.created?.type[0] + history?.created?.type.slice(1).toLowerCase();
        history['date'] = new Date(history?.date).toDateString() + " " + new Date(history?.date).toLocaleTimeString()
      }

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

  generateInvoice() {
    this.invoiceService.generateInvoice({ order: this.orderNumber }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.downloadPDF(res?.result?.pdf, this.orderNumber)
      }
    })
  }

  generateShippingDetails() {
    this.invoiceService.generateShippingDetails({ order: this.orderNumber }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.downloadPDF(res?.result?.pdf, this.orderNumber)
      }
    })
  }

  generateProducts() {
    this.invoiceService.generateProducts({ order: this.orderNumber }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        const filename = "Products" + this.orderNumber
        this.downloadPDF(res?.result?.pdf, filename)
      }
    })
  }

  downloadPDF(base64String: string, pdfname: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    saveAs(blob, `${pdfname}.pdf`);
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
