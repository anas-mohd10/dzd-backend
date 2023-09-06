import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CartService } from 'src/app/includes/services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})

export class CartListComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  keyword: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  type: FormControl = new FormControl('')
  fromDate: FormControl = new FormControl('')
  toDate: FormControl = new FormControl('')
  page: number = 1
  limit: FormControl = new FormControl(20)
  lastPage: Boolean = false
  carts: Array<any> = []
  isSubmitted: Boolean = true
  cart: any = {}

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  get fc() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.seachCart()
    this.initForm()
  }

  clearFilter() {
    this.isActive.setValue('')
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
      isActive: this.isActive.value
    }

    this.cartService.getCarts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.carts = res?.result?.data
        this.lastPage = res?.result?.lastPage
        this.page = res?.result?.page
        this.cdr.markForCheck()
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

  openModal(cart: any) {
    this.cart = cart
  }

  sendPush() {
    if (!this.form.valid) {
      this.isSubmitted = false
      return
    }

    let payload = {
      ...this.form.value,
      refid: this.cart?.refid
    }

    this.cartService.sendCartNotification(payload).subscribe((res: any) => {
      res?.errorCode == 0 ? document.location.reload() : this.ToastrService.error(res?.message)
    })
  }
}
