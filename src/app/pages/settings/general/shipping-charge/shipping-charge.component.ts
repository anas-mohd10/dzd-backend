import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DeliveryMethodService } from 'src/app/includes/services/delivery-method.service';
import { ShippingService } from 'src/app/includes/services/shipping.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shipping-charge',
  templateUrl: './shipping-charge.component.html',
  styleUrls: ['./shipping-charge.component.scss']
})
export class ShippingChargeComponent implements OnInit {
  appRoute = appRoutes;
  modalRef?: BsModalRef;
  shippingDetails: any = {};
  form: FormGroup = new FormGroup({});
  blacklistedCities: any = [];
  cityItems: Array<any> = [];
  cityCharges: Array<any> = [];
  isSubmitted: boolean = false;
  settings: any;
  deliveryMethods: Array<any> = [];
  methodRef?: BsModalRef;
  base: string = environment.base
  methodIcon: string = '';
  isMethodSubmitted: boolean = false
  isMethodUpdate: boolean = false
  methodDetails: any;
  methodForm: FormGroup = new FormGroup({})

  constructor(
    private BsModalService: BsModalService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ShippingService: ShippingService,
    private DeliveryMethodService: DeliveryMethodService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      country: new FormControl("UAE", Validators.required),
      city: new FormControl("", Validators.required),
      charge: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/)])
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.methodForm = new FormGroup({
      name: new FormControl("", Validators.required),
      amountType: new FormControl("flat"),
      amount: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/)]),
      icon: new FormControl(""),
      freeAbove: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/)]),
      orderAmount: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/)]),
      isActive: new FormControl("true", Validators.required),
      applyOn: new FormControl("total")
    })

    this.getMethods()

    this.getDetails()
  }

  get formControls() {
    return this.form.controls
  }

  //Delivery methods
  openMethod(template: TemplateRef<any>, mode?: string, methodId?: string) {
    this.methodRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' })
    if (mode == 'update') {
      this.isMethodUpdate = true
      this.DeliveryMethodService.getMethod(methodId || "").subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.methodDetails = res?.result
            this.methodIcon = res?.result?.icon
            this.methodForm.patchValue(res?.result)
            this.ChangeDetectorRef.markForCheck()
          }
        }
      })
    }
  }

  handleMethodIcon(event: any) {
    this.methodForm.patchValue({ icon: event.path })
  }

  get methodFormControls() {
    return this.methodForm.controls
  }

  addMethod() {
    if (!this.methodForm.valid) {
      this.isMethodSubmitted = true
      return
    }

    if (this.isMethodUpdate) {
      this.DeliveryMethodService.updateMethod({ _id: this.methodDetails?._id, ...this.methodForm.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.getMethods()
            this.closeMethod()
            this.ChangeDetectorRef.markForCheck()
            this.HotToastService.success(res?.message)
          } else {
            this.HotToastService.error(res?.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err.error.message)
        }
      })
    } else {
      this.DeliveryMethodService.addMethod(this.methodForm.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.getMethods()
            this.closeMethod()
            this.ChangeDetectorRef.markForCheck()
            this.HotToastService.success(res?.message)
          } else {
            this.HotToastService.error(res?.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err.error.message)
        }
      })
    }

  }

  getMethods() {
    this.DeliveryMethodService.getMethods().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.deliveryMethods = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  closeMethod() {
    this.methodIcon = ''
    this.isMethodUpdate = false
    this.methodRef?.hide()
  }
  //Delivery methods

  open(template: TemplateRef<any>, type?: string) {
    if (type == 'update') {
      this.isSubmitted = false
    }
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' })
  }

  close() {
    this.modalRef?.hide()
  }


  getDetails() {
    this.ShippingService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingDetails = res?.result
          this.getCityDetails()
          this.getBlacklistedDetails()
          this.getChargeDetails()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  getBlacklistedDetails() {
    this.ShippingService.getShippingCityCharges(this.shippingDetails.country, "true").subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blacklistedCities = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  switchToggled(event: any) {
    this.ShippingService.manageShippingCharge({ city: event.switchId, country: this.shippingDetails.country, isBlacklisted: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getBlacklistedDetails()
          this.getDetails()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  getChargeDetails() {
    this.ShippingService.getShippingCityCharges(this.shippingDetails.country).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.cityCharges = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  getCityDetails() {
    this.ShippingService.getShippingCity(this.shippingDetails.country).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.cityItems = res?.result[0]
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  saveCityCharge() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.ShippingService.manageShippingCharge(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.close()
          this.isSubmitted = false
          this.getDetails()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }
}