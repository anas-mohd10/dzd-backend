import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DeliverySlotsService } from 'src/app/includes/services/delivery-slots.service';

@Component({
  selector: 'app-delivery-slots',
  templateUrl: './delivery-slots.component.html',
  styleUrls: ['./delivery-slots.component.scss']
})
export class DeliverySlotsComponent implements OnInit {
  appRoute = appRoutes
  modalRef?: BsModalRef
  confirmRef?: BsModalRef
  form: FormGroup
  slots: Array<any> = []
  slotDetails: any
  isEditMode: boolean = false
  deliveryQuery: string
  days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  isSubmitted: boolean = false
  activeDay: string = 'Sunday';
  settings: any;
  futureDays: FormControl = new FormControl(7)

  constructor(
    private DeliveryService: DeliverySlotsService,
    private BsModalService: BsModalService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  get formControls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required),
      isActive: new FormControl('true')
    })

    this.getSettings()
    this.getSlots()
  }

  toggleDelivery() {
    this.AppSettingsService.updateSettings({ isDeliverySlots: !this.settings.isDeliverySlots }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings()
          this.Toast.success(res?.message || "Delivery slot updated")
        } else {
          this.Toast.error(res?.message || "Something went wrong")
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message || 'Something went wrong')
      }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getSlots() {
    this.DeliveryService.getDeliverySlots().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.slots = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err) => { }
    })
  }

  toggleSlot(slotId: string, slotStatus: boolean) {
    this.DeliveryService.updateSlot({ refid: slotId, isActive: !slotStatus }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSlots()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  open(template: TemplateRef<any>, deliveryDay?: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
    
  }

  close() {
    this.isEditMode = false
    this.form.reset()
    this.form.get('isActive')?.setValue('true')
    this.modalRef?.hide()
    this.isSubmitted = false
  }

  confirmation(template: TemplateRef<any>, delivery: string) {
    this.confirmRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
    this.deliveryQuery = delivery
  }

  confirm() {
    this.DeliveryService.deleteSlot(this.deliveryQuery).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.confirmRef?.hide()
          this.getSlots()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  decline() {
    this.deliveryQuery = ''
    this.confirmRef?.hide()
  }

  submit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    if (this.isEditMode) {
      this.DeliveryService.updateSlot({ refid: this.slotDetails.refid, ...this.form.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message)
            this.slotDetails = null
            this.modalRef?.hide()
            this.form.reset()
            this.form.get('isActive')?.setValue('true')
            this.getSlots()
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.Toast.error(res?.message)
          }
        }, error: (err) => {
          this.Toast.error(err?.error?.message)
        }
      })
    } else {
      this.DeliveryService.addSlot(this.form.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message)
            this.modalRef?.hide()
            this.form.reset()
            this.form.get('isActive')?.setValue('true')
            this.getSlots()
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.Toast.error(res?.message)
          }
        }, error: (err) => {
          this.Toast.error(err?.error?.message)
        }
      })
    }
  }
}
