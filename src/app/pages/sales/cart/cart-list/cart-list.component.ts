import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CartService } from 'src/app/includes/services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
})
export class CartListComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup;
  keyword: FormControl = new FormControl('');
  type: FormControl = new FormControl('');
  fromDate: FormControl = new FormControl('');
  toDate: FormControl = new FormControl('');
  page: number = 1;
  limit: number = 40;
  totalResults: number = 0;
  totalPages: number = 1;

  carts: Array<any> = [];
  isSubmitted: Boolean = false;
  cart: any = {};
  couponModalRef?: BsModalRef;
  notifyModalRef?: BsModalRef;
  couponForm!: FormGroup;
  isInvalid: boolean = false;
  @ViewChild('notification') notificationModal: TemplateRef<any>;
  productsModalRef?: BsModalRef;
  cartDetails: any = {};
  base: string = environment.base;
  settings: any = {};
  cartQuery: any;
  @ViewChild('cartProducts') productsModal: TemplateRef<any>;
  notificationRef?: BsModalRef;
   customer: string = ''

  constructor(
    private cartService: CartService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private BsModalService: BsModalService,
    private CouponsService: CouponsService,
    private AppSettingsService: AppSettingsService,
    private ActivatedRoute: ActivatedRoute,
    private toast: HotToastService,

  ) { }

  get formControls() {
    return this.form.controls;
  }

  get couponControls() {
    return this.couponForm.controls;
  }

  onNotificationTriggered() {
    this.getCarts();
  }
  exportCart(): void {
    const requestBody = { userId: this.customer };    

    this.cartService.exportCart(requestBody).subscribe({
      next: () => {
        this.toast.success('Cart export initiated successfully!');
      },
      error: (err:any) => {
        console.error('Error exporting cart:', err);
        this.toast.error('Failed to export cart. Please try again.');
      }
    });
  }


  ngOnInit(): void {
    this.getCarts();
    this.initForm();
    this.cartQuery = this.ActivatedRoute.snapshot.queryParams.query || '';

    this.couponForm = new FormGroup({
      title: new FormControl('', Validators.required),
      couponType: new FormControl('complete'),
      code: new FormControl('', Validators.required),
      type: new FormControl('percent'),
      value: new FormControl('10', Validators.required),
      minPurchase: new FormControl(0),
      isVisibility: new FormControl(false),
      forUser: new FormControl('', Validators.required),
    });

    this.AppSettingsService.getGeneralSettingsbyId({ refid: '1' }).subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message);
        }
      }
    );
  }

  getTotal(qty: number, price: number) {
    return Math.round(qty * price);
  }

  clearFilter() {
    this.keyword.setValue('');
    this.type.setValue('');
    this.fromDate.setValue('');
    this.toDate.setValue('');
    this.page = 1;
    this.limit = 40;
    this.getCarts();
  }

  getPreviousPage() {
    this.page -= 1;
    this.getCarts();
  }

  getNextPage() {
    this.page += 1;
    this.getCarts();
  }

  onPageTriggered(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getCarts();
  }

  //Notification handler starts here
  openNotification(template: TemplateRef<any>, cart: any) {
    this.cart = cart;
    this.notifyModalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  //Notiication handler ends here

  getCarts() {
    setTimeout(() => {
      this.cartService
        .getCarts({
          page: this.page,
          limit: this.limit,
          keyword: this.keyword.value,
          type: this.type.value,
          fromDate: this.fromDate.value,
          toDate: this.toDate.value,
        })
        .subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.carts = res?.result?.data;
            this.totalResults = res?.result?.totalResults;
            this.totalPages = res?.result?.totalPages;
            this.page = res?.result?.page;
            this.ChangeDetectorRef.markForCheck();
          }
        });
    }, 800);
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      couponCode: new FormControl(''),
    });
  }

  closeModal() {
    this.form.reset();
    this.cart = {};
    this.isSubmitted = true;
  }

  openNotify(template: TemplateRef<any>, cart: any) {
    this.cart = cart;
    this.notifyModalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeNotify() {
    this.notifyModalRef?.hide();
    this.form.reset();
    this.isSubmitted = false;
    this.cart = {};
  }

  openCoupon(template: TemplateRef<any>) {
    this.couponForm.get('forUser')?.setValue(this.cart?.customer?._id);
    this.notifyModalRef?.hide();
    this.couponModalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeCoupon() {
    this.couponModalRef?.hide();
    this.couponForm.reset();
    this.isInvalid = false;
    this.notifyModalRef = this.BsModalService.show(this.notificationModal, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  addCoupon() {
    if (!this.couponForm.valid) {
      this.isInvalid = true;
      return;
    }

    this.CouponsService.addCoupon(this.couponForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.couponModalRef?.hide();
          this.couponForm.reset();
          this.ToastrService.success(res?.message);
          this.form.get('couponCode')?.setValue(res?.result?.code);
          this.notifyModalRef = this.BsModalService.show(
            this.notificationModal,
            { class: 'modal-lg modal-dialog-centered' }
          );
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err?.message);
      },
    });
  }

  sendPush() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    let payload = {
      ...this.form.value,
      refid: this.cart?.refid,
    };

    this.cartService.sendCartNotification(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message);
          this.closeNotify();
          this.getCarts();
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err?.message);
      },
    });
  }

  openProducts(template: TemplateRef<any>, cart: any, cartQuery: string) {
    let cartId = cart ? cart?.refid : cartQuery;
    this.cartService.getCartProducts({ cart: cartId }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.cartDetails = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.ToastrService.error(err?.error?.message);
      },
    });
    this.productsModalRef = this.BsModalService.show(template, {
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeProducts() {
    this.productsModalRef?.hide();
    this.cartDetails = null;
  }
}
