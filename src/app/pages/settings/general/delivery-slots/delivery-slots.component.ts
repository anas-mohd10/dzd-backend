import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
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
  isSubmitted: boolean = false

  constructor(
    private DeliveryService: DeliverySlotsService,
    private BsModalService: BsModalService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
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

    this.getSlots()
  }

  getSlots() {
    this.DeliveryService.getSlots().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.slots = res?.result
          this.slots.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.from}`);
            const timeB = new Date(`1970-01-01T${b.from}`);
            if (timeA < timeB) {
              return -1;
            } else if (timeA > timeB) {
              return 1;
            } else {
              return 0;
            }
          });
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err) => { }
    })
  }

  open(template: TemplateRef<any>, delivery?: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    if (delivery) {
      this.isEditMode = true
      this.DeliveryService.getSlotDetails(delivery).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.slotDetails = res?.result
            for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
            this.ChangeDetectorRef.markForCheck()
          }
        }, error: (err) => { }
      })
    }
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
