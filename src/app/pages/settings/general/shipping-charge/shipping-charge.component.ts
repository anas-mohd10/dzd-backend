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
  countries: Array<any> = ["India", "UAE"]
  isCountryEditable: boolean = false
  selectedCountries: Array<any> = []
  methodForm: FormGroup = new FormGroup({})
  countrySelected: FormControl = new FormControl("")
  defaultCountryAndState: FormControl = new FormControl("UAE,Dubai")

  constructor(
    private BsModalService: BsModalService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ShippingService: ShippingService,
    private DeliveryMethodService: DeliveryMethodService,
    private AppSettingsService: AppSettingsService
  ) { }

  toggleCountry() {
    if (this.selectedCountries.includes(this.countrySelected.value)) {
      this.selectedCountries = this.selectedCountries.filter((item: string) => item != this.countrySelected.value)
      this.HotToastService.success(`Country removed successfully`)
    } else {
      this.selectedCountries.push(this.countrySelected.value)
      this.HotToastService.success(`Country added successfully`)
    }
    this.countrySelected.setValue('')
  }

  removeCountry(country: string) {
    this.selectedCountries = this.selectedCountries.filter((item: string) => item != country)
  }

  countryEditable() {
    this.isCountryEditable = true
    this.selectedCountries = [...this.shippingDetails.country]
    this.defaultCountryAndState.setValue(`${this.shippingDetails.defaultCountry},${this.shippingDetails.defaultState}`)
  }

  onSaveChanges() {
    if (!this.selectedCountries.includes(this.defaultCountryAndState.value.split(',')[0])) {
      this.HotToastService.error('Default country is not selected')
      return
    }

    this.ShippingService.manageShipping({
      country: this.selectedCountries,
      defaultCountry: this.defaultCountryAndState.value.split(',')[0],
      defaultState: this.defaultCountryAndState.value.split(',')[1]
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.isCountryEditable = false
          this.selectedCountries = []
          this.countrySelected.setValue('')
          this.defaultCountryAndState.setValue('')
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

  deleteMethod(methodId: string) {
    this.DeliveryMethodService.deleteMethod(methodId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMethods()
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

  getMethods() {
    this.DeliveryMethodService.getMethods("").subscribe({
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
    this.methodForm.reset()
    this.methodForm.patchValue({ amountType: "flat", applyOn: "total", isActive: "true" })
  }
  //Delivery methods

  getDetails() {
    this.ShippingService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingDetails = res?.result
          this.getBlacklistedDetails()
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
    this.ShippingService.getShippingCharges("true").subscribe({
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
}