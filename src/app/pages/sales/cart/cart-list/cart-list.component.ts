import { Component, OnInit, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CartService } from 'src/app/includes/services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { CouponsService } from 'src/app/includes/services/coupons.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})

export class CartListComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  keyword: FormControl = new FormControl('')
  type: FormControl = new FormControl('')
  fromDate: FormControl = new FormControl('')
  toDate: FormControl = new FormControl('')
  page: number = 1
  limit: FormControl = new FormControl(20)
  lastPage: Boolean = false
  carts: Array<any> = []
  isSubmitted: Boolean = false
  cart: any = {}
  couponModalRef?: BsModalRef
  notifyModalRef?: BsModalRef
  couponForm!: FormGroup
  isInvalid: boolean = false
  @ViewChild('notification') notificationModal: TemplateRef<any>
  totalResults: string = ''

  constructor(
    private cartService: CartService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService,
    private CouponsService: CouponsService
  ) { }

  get formControls() {
    return this.form.controls
  }

  get couponControls() {
    return this.couponForm.controls
  }

  ngOnInit(): void {
    this.seachCart()
    this.initForm()

    this.couponForm = new FormGroup({
      title: new FormControl('', Validators.required),
      couponType: new FormControl('complete'),
      code: new FormControl('', Validators.required),
      type: new FormControl('percent'),
      value: new FormControl('10', Validators.required),
      minPurchase: new FormControl(0),
      isVisibility: new FormControl(false),
      forUser: new FormControl('', Validators.required)
    })
  }

  clearFilter() {
    this.keyword.setValue('')
    this.type.setValue('')
    this.fromDate.setValue('')
    this.toDate.setValue('')
    this.page = 1
    this.limit.setValue(20)
    this.seachCart()
  }

  getPreviousPage() {
    this.page -= 1
    this.seachCart()
  }

  getNextPage() {
    this.page += 1
    this.seachCart()
  }

  seachCart() {
    let payload = {
      page: this.page,
      limit: this.limit.value,
      keyword: this.keyword.value,
      type: this.type.value,
      fromDate: this.fromDate.value,
      toDate: this.toDate.value,
    }

    this.cartService.getCarts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.carts = res?.result?.data
        this.totalResults = res?.result?.totalItems
        this.lastPage = res?.result?.lastPage
        this.page = res?.result?.page
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      couponCode: new FormControl('')
    })
  }

  closeModal() {
    this.form.reset()
    this.cart = {}
    this.isSubmitted = true
  }

  openNotify(template: TemplateRef<any>, cart: any) {
    this.cart = cart
    this.notifyModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeNotify() {
    this.notifyModalRef?.hide()
    this.form.reset()
    this.isSubmitted = false
    this.cart = {}
  }

  openCoupon(template: TemplateRef<any>) {
    this.couponForm.get('forUser')?.setValue(this.cart?.customer?._id)
    this.notifyModalRef?.hide()
    this.couponModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeCoupon() {
    this.couponModalRef?.hide()
    this.couponForm.reset()
    this.isInvalid = false
    this.notifyModalRef = this.BsModalService.show(this.notificationModal, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  addCoupon() {
    if (!this.couponForm.valid) {
      this.isInvalid = true
      return
    }

    this.CouponsService.addCoupon(this.couponForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.couponModalRef?.hide()
          this.couponForm.reset()
          this.ToastrService.success(res?.message)
          this.form.get('couponCode')?.setValue(res?.result?.code)
          this.notifyModalRef = this.BsModalService.show(this.notificationModal, { class: 'modal-lg modal-dialog-centered' })
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })

  }

  sendPush() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    let payload = {
      ...this.form.value,
      refid: this.cart?.refid
    }

    this.cartService.sendCartNotification(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          this.closeNotify()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }
}
