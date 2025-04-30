import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { indiaStates } from 'src/app/config/constants/country/india';
import { uaeStates } from 'src/app/config/constants/country/uae';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DeliverySlotsService } from 'src/app/includes/services/delivery-slots.service';

interface DeliverySlotInputs {
  from: string,
  to: string,
  refid: boolean,
  ordersPerSlot: number,
  state: string
}

type CountryProps = {
  key: string,
  value: string
}

@Component({
  selector: 'app-delivery-slots',
  templateUrl: './delivery-slots.component.html',
  styleUrls: ['./delivery-slots.component.scss']
})

export class DeliverySlotsComponent implements OnInit {
  appRoute = appRoutes
  modalRef?: BsModalRef
  confirmRef?: BsModalRef
  form: FormGroup = new FormGroup({})
  slots: Array<any> = []
  slotDetails: any
  isEditMode: boolean = false
  deliveryQuery: string
  days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  isSubmitted: boolean = false
  activeDay: string = 'Sunday';
  settings: any;
  isEmirateDeliverySlots: FormControl = new FormControl(false)
  isDeliverySlots: FormControl = new FormControl(false)
  futureDays: FormControl = new FormControl(7)
  slotItems: Array<DeliverySlotInputs> = [];
  addModalRef?: BsModalRef
  @ViewChild('template') template: any;
  countryItems: CountryProps[] = [
    { key: 'United Arab Emirates', value: 'uae' },
    { key: 'India', value: 'india' }
  ];
  toggleConfirmRef?: BsModalRef;
  isToggleConfirmation: boolean = false;
  stateItems: Array<any> = uaeStates
  selectedDays: Array<any> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  constructor(
    private DeliveryService: DeliverySlotsService,
    private BsModalService: BsModalService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private FormBuilder: FormBuilder
  ) { }

  get formControls() {
    return this.form.controls
  }

  updateSlotItems() {

  }

  onCountryChange() {
    switch (this.form.get('country')?.value) {
      case 'uae':
        this.stateItems = uaeStates
        break;
      case 'india':
        this.stateItems = indiaStates
    }
  }

  openToggleConfirm(template: TemplateRef<any>) {
    this.isToggleConfirmation = true
    this.toggleConfirmRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
  }

  closeToggleConfirm() {
    this.isToggleConfirmation = false
    this.toggleConfirmRef?.hide()
  }

  confirmEmirate() {
    this.AppSettingsService.updateSettings({
      isEmirateDeliverySlots: this.isEmirateDeliverySlots.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings()
          this.Toast.success(res?.message || "Emirate delivery slot updated")
        } else {
          this.Toast.error(res?.message || "Something went wrong")
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message || 'Something went wrong')
      }
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      from: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern(/^[\d:]+$/)]),
      to: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern(/^[\d:]+$/)]),
      ordersPerSlot: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]),
      country: new FormControl('uae'),
      state: new FormControl('Dubai')
    });

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

  enableSettings(event: { toggleState: any, switchId: any }) {
    this.AppSettingsService.updateSettings({ [event.switchId]: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings()
          this.Toast.success(res?.message)
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  toggleDays(day: string) {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(item => item != day)
    } else {
      this.selectedDays.push(day)
    }
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.futureDays.setValue(this.settings?.futureDays)
          this.isDeliverySlots.setValue(res?.result?.isDeliverySlots)
          this.isEmirateDeliverySlots.setValue(res?.result?.isEmirateDeliverySlots)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
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

  toggleSlot(event: { switchId: string, toggleState: boolean }) {
    this.DeliveryService.updateSlot({
      refid: event.switchId,
      isActive: event.toggleState
    }).subscribe({
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

  open(template: TemplateRef<any>, deliveryDay: string) {
    this.activeDay = deliveryDay
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    this.DeliveryService.getSlotDetailsPerDay(deliveryDay).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.slotItems = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  toggleFutureDays() {
    this.AppSettingsService.updateSettings({ futureDays: this.futureDays.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSettings()
          this.Toast.success(res?.message || "Delivery future days updated")
        } else {
          this.Toast.error(res?.message || "Something went wrong")
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message || 'Something went wrong')
      }
    })
  }

  openAdd(template: TemplateRef<any>) {
    this.addModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
    this.modalRef?.hide()
  }


  closeAdd() {
    this.addModalRef?.hide()
    this.isSubmitted = false
    this.form.reset()
    this.form.patchValue({ country: 'uae', state: 'Dubai' })
    this.selectedDays = this.days
  }

  saveDeliverySlot() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.DeliveryService.addSlot({ days: this.selectedDays, ...this.form.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getSlots()
          this.form.reset()
          this.form.patchValue({ country: 'uae', state: 'Dubai' })
          this.Toast.success(res?.message)
          this.addModalRef?.hide()
          this.selectedDays = this.days
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  deleteSlot(slotId: any) {
    this.DeliveryService.deleteSlot(slotId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getSlots()
          this.modalRef?.hide()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  updateSlots() {
    this.DeliveryService.updateSlots({ slots: this.slotItems }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getSlots()
          this.modalRef?.hide()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  close() {
    this.isEditMode = false
    this.form.reset()
    this.form.patchValue({ country: 'uae', state: 'Dubai' })
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

    if (this.isEmirateDeliverySlots.value == false) {
      this.form.patchValue({ state: '', country: '' })
    }

    if (this.isEditMode) {
      this.DeliveryService.updateSlot({ refid: this.slotDetails.refid, ...this.form.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message)
            this.slotDetails = null
            this.modalRef?.hide()
            this.form.reset()
            this.form.patchValue({ country: 'uae', state: 'Dubai' })
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
