import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { LocationService } from 'src/app/includes/services/location.service';
import { ShippingService } from 'src/app/includes/services/shipping.service';

type AddressField = {
  key: string,
  value: string,
  isRequired: boolean,
  placeholder: string
}

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  appRoute = appRoutes
  shippingDetails: any = {}
  modalRef?: BsModalRef
  items: Array<any> = [{
    title: 'Highest',
    description: 'The shipping cost will be determined by selecting the highest individual product shipping cost.',
    value: 'highest'
  }, {
    title: 'Lowest',
    description: 'The shipping cost will be determined by selecting the lowest individual product shipping cost.',
    value: 'lowest'
  }, {
    title: 'Total',
    description: 'The shipping cost will be the sum of individual product shipping cost.',
    value: 'total'
  }, {
    title: 'No charge',
    description: 'No shipping charge applicable for the orders',
    value: 'free'
  }, {
    title: 'Minimum',
    description: 'No shipping charges will be applied for orders exceeding the minimum cart amount.',
    value: 'minimum'
  }, {
    title: 'City',
    description: 'The shipping cost will be determined by user delivery address',
    value: 'city'
  }]
  isMinimum: boolean = false
  form: FormGroup
  addressForm: FormGroup = new FormGroup({})
  countries: Array<{ name: string, code: string }> = []
  addressFields: AddressField[] = [
    { key: 'firstlane', value: 'Firstlane', isRequired: true, placeholder: 'Enter firstlane' },
    { key: 'secondlane', value: 'Secondlane', isRequired: true, placeholder: 'Enter secondlane' },
    { key: 'personName', value: 'Person Name', isRequired: true, placeholder: 'Enter person name' },
    { key: 'companyName', value: 'Company Name', isRequired: true, placeholder: 'Enter company name' },
    { key: 'phoneNumber1', value: 'Phone Number', isRequired: true, placeholder: 'Enter phone number' },
    { key: 'phoneNumber2', value: 'Alternate Phone Number', isRequired: false, placeholder: 'Enter phone number' },
    { key: 'emailAddress', value: 'Email Address', isRequired: true, placeholder: 'Enter email address' },
    { key: 'city', value: 'City', isRequired: true, placeholder: 'Enter city' },
    { key: 'state', value: 'State', isRequired: true, placeholder: 'Enter state' },
    { key: 'pincode', value: 'Pincode', isRequired: false, placeholder: 'Enter pincode' },
  ]
  isShippingGateway: FormControl = new FormControl(false)

  calculationBasisOptions = [
    { label: 'Location Only (default)', value: 'location_only' },
    { label: 'Weight Only',             value: 'weight_only' },
    { label: 'Volume Only',             value: 'volume_only' },
    { label: 'Location + Weight',       value: 'location+weight' },
    { label: 'Location + Volume',       value: 'location+volume' },
    { label: 'Weight + Volume',         value: 'weight+volume' },
    { label: 'All Dimensions',          value: 'all' },
  ]

  resolutionRuleOptions = [
    { label: 'Highest charge (recommended)', value: 'highest' },
    { label: 'Lowest charge',               value: 'lowest' },
    { label: 'Average',                     value: 'average' },
  ]

  get showResolutionRule(): boolean {
    const v = this.form?.get('calculationBasis')?.value
    return v && v !== 'location_only' && v !== 'weight_only' && v !== 'volume_only'
  }

  get showDimFactor(): boolean {
    const v = this.form?.get('calculationBasis')?.value
    return ['volume_only', 'location+volume', 'weight+volume', 'all'].includes(v)
  }

  constructor(
    private ShippingService: ShippingService,
    private LocationService: LocationService,
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
  ) { }

  get formControls() {
    return this.form.controls
  }

  get addressFormControls() {
    return this.addressForm.controls
  }

  getSettings() {
    this.AppSettingsService.getSettings().subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.isShippingGateway.patchValue(res.result.isShippingGateway || false)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }

  toggleSwitch(event: { toggleState: boolean, switchId: string }) {
    const message: string =  `Are you sure you want to ${event.toggleState ? 'enable' : 'disable'} shipping gateways?`
    if (confirm(message)) {
      this.AppSettingsService.updateSettings({ isShippingGateway: event.toggleState }).subscribe({
        next: (res: any) => {
          if (res && res.errorCode == 0) {
            this.getSettings()
            this.HotToastService.success(res.message)
            this.ChangeDetectorRef.markForCheck()
          } else {
            this.HotToastService.error(res.message)
          }
        }, error: (err) => {
          this.HotToastService.error(`${(err as Error).message}`)
        }
      })
    } else {
      this.HotToastService.info('Action cancelled')
    }
  }

  saveAddressForm() {
    if (!this.addressForm.valid) {
      // this.HotToastService.error('Please fill all the required fields')
      return
    }

    this.ShippingService.manageShipping(this.addressForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.HotToastService.success(res.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }

  ngOnInit(): void {
    Promise.all([
      this.getDetails(),
      this.getSettings()
    ])

    this.form = new FormGroup({
      cost: new FormControl('', Validators.required),
      amount: new FormControl(499, Validators.pattern("^[0-9]*")),
      charge: new FormControl(10, Validators.pattern("^[0-9]*")),
      calculationBasis: new FormControl('location_only', Validators.required),
      resolutionRule: new FormControl('highest', Validators.required),
      dimensionalWeightFactor: new FormControl(5000, Validators.pattern("^[0-9]*")),
    })

    this.addressForm = new FormGroup({
      firstlane: new FormControl('', Validators.required),
      secondlane: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required),
      pincode: new FormControl(''),
      personName: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      phoneNumber1: new FormControl('', [Validators.minLength(7), Validators.maxLength(12), Validators.required]),
      phoneNumber2: new FormControl(''),
      emailAddress: new FormControl('', [Validators.email, Validators.required]),
    })

    this.LocationService.findCountries().subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.countries = res.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err) => {
        this.HotToastService.error(`${(err as Error).message}`)
      }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' })
  }

  checked(item: any) {
    this.form.get('cost')?.setValue(item.switchId)
    item.switchId == 'minimum' ? this.isMinimum = true : this.isMinimum = false
    this.ShippingService.manageShipping(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
    this.ChangeDetectorRef.markForCheck()
  }

  save() {
    if (!this.form.valid) {
      return
    }

    this.ShippingService.manageShipping(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
    this.ChangeDetectorRef.markForCheck()
  }

  getDetails() {
    this.ShippingService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.shippingDetails = res.result
          for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
          if (this.shippingDetails?.cost == 'minimum') this.isMinimum = true
          this.addressForm.patchValue(res.result)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }


}
