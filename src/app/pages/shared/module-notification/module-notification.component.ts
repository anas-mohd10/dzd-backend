import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

@Component({
  selector: 'app-module-notification',
  templateUrl: './module-notification.component.html',
  styleUrls: ['./module-notification.component.scss'],
})
export class ModuleNotificationComponent implements OnInit, OnChanges {
  modalRef?: BsModalRef;
  @ViewChild('template') template: TemplateRef<any>;
  @Input() type: string;
  @Input() query: string;
  @Input() customerId: string;
  channels: Array<any> = [
    { type: 'email', name: 'Email' },
    { type: 'sms', name: 'SMS' },
    { type: 'push', name: 'Push notification' },
  ];
  couponModalRef?: BsModalRef;
  couponForm: FormGroup;
  form: FormGroup;
  isInvalid: boolean;
  isLoading: boolean = false;
  isButtonDisabled: boolean = false;

  @Output() notificationTriggered = new EventEmitter<void>();
  primaryLanguage: string;

  triggerNotification() {
    // Logic to trigger the notification
    this.notificationTriggered.emit();
  }

  ngOnChanges(changes: SimpleChanges): void { }

  constructor(
    private BsModalService: BsModalService,
    private NotificationsService: NotificationsService,
    private Toast: HotToastService,
    private CouponsService: CouponsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private CustomersService: CustomersService
  ) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeModal() {
    this.modalRef?.hide();
    this.form.patchValue({
      channel: 'push',
      sms: '🛍️ Time to Complete Your Shopping! 🛒 Your items are patiently waiting in the cart. Finish your purchase now and enjoy your fabulous finds.',
      subject: 'Complete Your Shopping Today for Exclusive Deals!',
      title: 'Finish your shopping now',
      message:
        'Your cart is waiting for you. Complete your shopping now to secure your favorites before they are gone',
    });
    this.isButtonDisabled = false;
  }

  get couponControls() {
    return this.couponForm.controls;
  }

  ngOnInit(): void {
    this.primaryLanguage = localStorage.getItem('primaryLanguage') || 'en';
    console.log(this.primaryLanguage);

    // Set form values based on primary language
    if (this.primaryLanguage === 'ar') {
      this.form = new FormGroup({
        channel: new FormControl('push'),
        sms: new FormControl(
          '🛍️ حان الوقت لإكمال التسوق! 🛒 منتجاتك في انتظارك في سلة التسوق. أكمل عملية الشراء الآن واستمتع بمشترياتك الرائعة.'
        ),
        subject: new FormControl(
          'أكمل تسوقك اليوم للحصول على عروض حصرية!'
        ),
        title: new FormControl('🛒 سلة التسوق تنتظرج!'),
        message: new FormControl(
          'اختياراتج الرائعة كل الأمهات عينهم عليها، لا تخسريها! ارجعي هسه وكملي طلبج قبل نفاذ الكمية⌛'
        ),
      });
    } else {
      this.form = new FormGroup({
        channel: new FormControl('push'),
        sms: new FormControl(
          '🛍️ Time to Complete Your Shopping! 🛒 Your items are patiently waiting in the cart. Finish your purchase now and enjoy your fabulous finds. '
        ),
        subject: new FormControl(
          'Complete Your Shopping Today for Exclusive Deals!'
        ),
        title: new FormControl('Finish your shopping now'),
        message: new FormControl(
          'Your cart is waiting for you. Complete your shopping now to secure your favorites before they are gone'
        ),
      });
    }

    // Get today's date
    const today = new Date();

    // Set start time to current time
    const fromDate = today.toISOString();

    // Set end time to today at 23:59:59
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const lastDate = endOfDay.toISOString();

    this.couponForm = new FormGroup({
      title: new FormControl('', Validators.required),
      couponType: new FormControl('complete'),
      code: new FormControl('', Validators.required),
      type: new FormControl('percent'),
      value: new FormControl('10', Validators.required),
      minPurchase: new FormControl(0),
      isVisibility: new FormControl(false),
      forUser: new FormControl('', Validators.required),
      fromDate: new FormControl(fromDate),
      lastDate: new FormControl(lastDate),
      minimumType: new FormControl('cart'),
      countPerUser: new FormControl('1'),
      isActive: new FormControl('true'),
      platformType: new FormControl('both'),
      details: new FormControl({
        type: 'limited',
        value: 1
      }),
      maxRedemptionAmount: new FormControl({
        isEnabled: false,
        value: null
      }),
    });
  }

  toggleChannel(channel: string) {
    this.form.get('channel')?.setValue(channel);
  }

  send() {
    if (this.isButtonDisabled) return;
    this.isButtonDisabled = true;

    this.NotificationsService.moduleNotifications({
      type: this.type,
      query: this.query,
      ...this.form.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeModal();
          this.Toast.success(res?.message);
          this.notificationTriggered.emit();
        } else {
          this.Toast.error(res?.message);
          this.isButtonDisabled = false;
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
        this.isButtonDisabled = false;
      },
    });
  }

  openCoupon(template: TemplateRef<any>) {
    if (this.customerId) {
      this.couponForm.get('forUser')?.setValue(this.customerId);
      this.modalRef?.hide();
      this.couponModalRef = this.BsModalService.show(template, {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      });
      return;
    }

    let query = {};
    this.type == 'cart'
      ? (query = { userid: Number(this.query) })
      : (query = { slug: this.query });
    if (this.type) {
      this.CustomersService.customerDetails(query).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.couponForm.get('forUser')?.setValue(res?.result?._id);
          }
        },
      });
    }
    this.modalRef?.hide();
    this.couponModalRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeCoupon() {
    this.couponModalRef?.hide();
    this.couponForm.reset();
    this.isInvalid = false;
    this.modalRef = this.BsModalService.show(this.template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  addCoupon() {
    if (!this.couponForm.valid) {
      this.isInvalid = true;
      // return;
    }

    // Create a complete payload with all required fields
    const couponPayload = {
      ...this.couponForm.value,
      platformType: 'both',
      minimumType: 'cart',
      isActive: 'true',
      details: {
        type: 'limited',
        value: 1
      },
      isVisibility: true,
    };

    this.CouponsService.addCoupon(couponPayload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.couponModalRef?.hide();
          this.couponForm.reset();
          this.Toast.success(res?.message);

          // Get the coupon code from the result - checking both possible structures
          const couponCode = Array.isArray(res?.result)
            ? res?.result[0]?.code
            : res?.result?.code;

          if (couponCode) {
            // Set the coupon code to the form
            this.form.get('couponCode')?.setValue(couponCode);

            // Update SMS text
            const smsText = this.form.get('sms')?.value || '';
            this.form.get('sms')?.setValue(
              `${smsText}. Use ${couponCode} coupon code`
            );

            // Update subject text
            const subjectText = this.form.get('subject')?.value || '';
            this.form.get('subject')?.setValue(
              `${subjectText}. Use ${couponCode} coupon code`
            );

            // Update message text
            const messageText = this.form.get('message')?.value || '';
            this.form.get('message')?.setValue(
              `${messageText}. Use ${couponCode} coupon code`
            );
          }

          this.modalRef = this.BsModalService.show(this.template, {
            class: 'modal-lg modal-dialog-centered',
          });
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.message);
      },
    });
  }
}
