import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ShippingService } from 'src/app/includes/services/shipping.service';


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

  constructor(
    private BsModalService: BsModalService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ShippingService: ShippingService,
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

    this.getDetails()
  }

  get formControls() {
    return this.form.controls
  }

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
          this.form.patchValue({ country: this.shippingDetails.country, city: this.cityItems[0].city, charge: 30 })
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