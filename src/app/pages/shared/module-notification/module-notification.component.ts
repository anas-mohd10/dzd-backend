import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { NotificationsService } from 'src/app/includes/services/notifications.service';


@Component({
  selector: 'app-module-notification',
  templateUrl: './module-notification.component.html',
  styleUrls: ['./module-notification.component.scss']
})
export class ModuleNotificationComponent implements OnInit, OnChanges {
  modalRef?: BsModalRef;
  @ViewChild("template") template: TemplateRef<any>
  @Input() type: string;
  @Input() query: string;
  channels: Array<any> = [
    { type: 'email', name: 'Email' },
    { type: 'sms', name: 'SMS' },
    { type: 'push', name: 'Push notification' }
  ]
  couponModalRef?: BsModalRef
  couponForm: FormGroup
  form: FormGroup
  isInvalid: boolean;

  ngOnChanges(changes: SimpleChanges): void {

  }

  constructor(
    private BsModalService: BsModalService,
    private NotificationsService: NotificationsService,
    private Toast: HotToastService,
    private CouponsService: CouponsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private CustomersService: CustomersService,
  ) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  closeModal() {
    this.modalRef?.hide()
    this.form.patchValue({
      channel: 'push',
      sms: '🛍️ Time to Complete Your Shopping! 🛒 Your items are patiently waiting in the cart. Finish your purchase now and enjoy your fabulous finds.',
      subject: 'Complete Your Shopping Today for Exclusive Deals!',
      title: 'Finish your shopping now',
      message: 'Your cart is waiting for you. Complete your shopping now to secure your favorites before they are gone'
    })
  }

  get couponControls() {
    return this.couponForm.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      channel: new FormControl('push'),
      sms: new FormControl('🛍️ Time to Complete Your Shopping! 🛒 Your items are patiently waiting in the cart. Finish your purchase now and enjoy your fabulous finds. '),
      subject: new FormControl('Complete Your Shopping Today for Exclusive Deals!'),
      title: new FormControl('Finish your shopping now'),
      message: new FormControl('Your cart is waiting for you. Complete your shopping now to secure your favorites before they are gone')
    })



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

  toggleChannel(channel: string) {
    this.form.get('channel')?.setValue(channel)
  }

  send() {
    this.NotificationsService.moduleNotifications({ type: this.type, query: this.query, ...this.form.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeModal()
          this.Toast.success(res?.message)
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  openCoupon(template: TemplateRef<any>) {
    let query = {}
    this.type == 'cart' ? query = { userid: Number(this.query) } : query = { slug: this.query }
    if (this.type) {
      this.CustomersService.customerDetails(query).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.couponForm.get('forUser')?.setValue(res?.result?._id)
          }
        }
      })
    }
    this.modalRef?.hide()
    this.couponModalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeCoupon() {
    this.couponModalRef?.hide()
    this.couponForm.reset()
    this.isInvalid = false
    this.modalRef = this.BsModalService.show(this.template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
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
          this.Toast.success(res?.message)
          this.form.get('couponCode')?.setValue(res?.result?.code)
          this.form.get('sms')?.setValue(this.form.get('sms')?.value + `. Use ${res?.result?.code} coupon code`)
          this.form.get('subject')?.setValue(this.form.get('subject')?.value + `. Use ${res?.result?.code} coupon code`)
          this.form.get('message')?.setValue(this.form.get('message')?.value + `. Use ${res?.result?.code} coupon code`)
          this.modalRef = this.BsModalService.show(this.template, { class: 'modal-lg modal-dialog-centered' })
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.message)
      }
    })
  }
}
