import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from 'src/app/includes/services/notifications.service';

@Component({
  selector: 'app-module-notification',
  templateUrl: './module-notification.component.html',
  styleUrls: ['./module-notification.component.scss']
})
export class ModuleNotificationComponent implements OnInit {
  modalRef?: BsModalRef;
  @Input() type: string;
  @Input() query: any;
  channels: Array<any> = [
    { type: 'email', name: 'Email' },
    { type: 'sms', name: 'SMS' },
    { type: 'push', name: 'Push notification' }
  ]
  couponForm: FormGroup
  form: FormGroup

  constructor(
    private BsModalService: BsModalService,
    private NotificationsService: NotificationsService,
    private Toast: HotToastService
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
    this.NotificationsService.moduleNotifications({ query: this.query, ...this.form.value }).subscribe({
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
}
