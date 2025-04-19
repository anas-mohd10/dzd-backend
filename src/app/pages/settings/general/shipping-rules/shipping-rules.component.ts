import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { indiaStates } from 'src/app/config/constants/country/india';
import { iraqStates } from 'src/app/config/constants/country/iraq';
import { uaeStates } from 'src/app/config/constants/country/uae';
import { appRoutes } from 'src/app/config/routes';
import { DeliveryMethodService } from 'src/app/includes/services/delivery-method.service';
import { ShippingService } from 'src/app/includes/services/shipping.service';

@Component({
  selector: 'app-shipping-rules',
  templateUrl: './shipping-rules.component.html',
  styleUrls: ['./shipping-rules.component.scss'],
})
export class ShippingRulesComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  shippingCharges: Array<any> = [];
  shippingDetails: any;
  modalRef?: BsModalRef;
  countries: Array<string> = ['India', 'UAE', 'Iraq'];
  states: Array<any> = [];
  cities: Array<any> = [];
  holidays: Array<any> = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  selectedHolidays: Array<any> = [];
  deliveryMethods: Array<any> = [];
  isSubmitted: boolean = false;
  stateInput: FormControl = new FormControl('');
  cityInput: FormControl = new FormControl('');
  selectedStates: Array<any> = [];
  selectedCities: Array<any> = [];
  isEditMode: boolean = false;
  chargeDetails: any;
  chargeRanges: Array<any> = [];
  defaultChargeRange = {
    minAmount: 0,
    maxAmount: 0,
    charge: 0
  };

  constructor(
    private ShippingService: ShippingService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private DeliveryMethodService: DeliveryMethodService
  ) {}

  get formControls() {
    return this.form.controls;
  }

  onStateChange() {
    if (this.selectedStates.includes(this.stateInput.value)) {
      this.selectedStates = this.selectedStates.filter(
        (state: any) => state != this.stateInput.value
      );
      this.HotToastService.success('State removed successfully');
    } else {
      this.selectedStates.push(this.stateInput.value);
      this.HotToastService.success('State added successfully');
    }

    this.cities = []; //reset cities array
    for (let state of this.selectedStates) {
      let citiesInState = this.states.find(
        (s: any) => s?.state == state
      )?.cities;
      this.cities = [...this.cities, ...citiesInState];
    }
    this.stateInput.setValue('');
  }

  removeState(state: any) {
    this.selectedStates = this.selectedStates.filter((s: any) => s != state);
    this.HotToastService.success('State removed successfully');
  }

  toggleHoliday(holiday: any) {
    if (this.selectedHolidays.includes(holiday)) {
      this.selectedHolidays = this.selectedHolidays.filter(
        (h: any) => h != holiday
      );
      this.HotToastService.success('Holiday removed successfully');
    } else {
      this.selectedHolidays.push(holiday);
      this.HotToastService.success('Holiday added successfully');
    }
  }

  onCityChange() {
    if (this.selectedCities.includes(this.cityInput.value)) {
      this.selectedCities = this.selectedCities.filter(
        (city: any) => city != this.cityInput.value
      );
      this.HotToastService.success('City removed successfully');
    } else {
      this.selectedCities.push(this.cityInput.value);
      this.HotToastService.success('City added successfully');
    }
    this.cityInput.setValue('');
  }

  removeCity(city: any) {
    this.selectedCities = this.selectedCities.filter((c: any) => c != city);
    this.HotToastService.success('City removed successfully');
  }

  onCountryChange() {
    switch (this.form.get('country')?.value) {
      case 'India':
        this.states = indiaStates;
        break;
      case 'UAE':
        this.states = uaeStates;
        break;
      case 'Iraq':
        this.states = iraqStates;
        break;
    }
  }

  onShippingTypeChange() {
    const shippingType = this.form.get('shippingType')?.value;
    
    // Reset related fields when shipping type changes
    if (shippingType !== 'threshold') {
      this.form.patchValue({
        minimumOrderAmount: null,
        fixedCharge: null
      });
    }
    
    if (shippingType !== 'tiered') {
      this.chargeRanges = [];
    }
  }

  addChargeRange() {
    this.chargeRanges.push({...this.defaultChargeRange});
  }

  removeChargeRange(index: number) {
    this.chargeRanges.splice(index, 1);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      country: new FormControl('', Validators.required),
      states: new FormControl([]),
      holidays: new FormControl([]),
      cities: new FormControl([]),
      deliveryMethod: new FormControl('', Validators.required),
      isAreaWise: new FormControl(false),
      isBlacklisted: new FormControl(false),
      cutOffTime: new FormControl('12:00'),
      minimumDay: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      maximumDay: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      shippingType: new FormControl('standard'),
      minimumOrderAmount: new FormControl(null),
      fixedCharge: new FormControl(null),
    });

    this.ShippingService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingDetails = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });

    this.DeliveryMethodService.getMethods('true').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.deliveryMethods = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });

    this.getShippingCharges();
  }

  getShippingCharges() {
    this.ShippingService.getShippingCharges().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingCharges = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  onSwitchToggled(event: { switchId: string; toggleState: boolean }) {
    this.form.get(event.switchId)?.setValue(event.toggleState);
    if (this.form.get('isAreaWise')?.value == true) {
      this.onCountryChange();
    } else {
      this.selectedStates = [];
      this.selectedCities = [];
      this.selectedHolidays = [];
    }
  }

  open(template: TemplateRef<any>, mode?: string, chargeId?: string) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });
    if (mode == 'update') {
      this.isEditMode = true;
      this.ShippingService.getShippingChargeDetails(chargeId).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.chargeDetails = res?.result;
            this.form.patchValue(this.chargeDetails);
            this.form.patchValue({
              deliveryMethod: this.chargeDetails?.deliveryMethod?._id,
            });
            this.selectedStates = this.chargeDetails?.states;
            this.selectedCities = this.chargeDetails?.cities;
            this.selectedHolidays = this.chargeDetails?.holidays;
            
            // Handle new fields
            if (this.chargeDetails?.shippingType) {
              this.form.patchValue({
                shippingType: this.chargeDetails.shippingType
              });
              
              if (this.chargeDetails.shippingType === 'threshold') {
                this.form.patchValue({
                  minimumOrderAmount: this.chargeDetails.minimumOrderAmount,
                  fixedCharge: this.chargeDetails.fixedCharge
                });
              }
              
              if (this.chargeDetails.shippingType === 'tiered') {
                this.chargeRanges = this.chargeDetails.chargeRanges || [];
              }
            }
            
            this.ChangeDetectorRef.markForCheck();
          }
        },
      });
    }
  }

  close() {
    this.modalRef?.hide();
    this.isEditMode = false;
    this.form.reset();
    this.form.patchValue({
      isAreaWise: false,
      isBlacklisted: false,
      country: '',
      states: [],
      holidays: [],
      cities: [],
      cutOffTime: '12:00',
      deliveryMethod: '',
      shippingType: 'standard'
    });
    this.selectedCities = [];
    this.selectedStates = [];
    this.selectedHolidays = [];
    this.chargeRanges = [];
    this.isSubmitted = false;
  }

  onSubmit() {
    this.form.patchValue({
      states: this.selectedStates,
      cities: this.selectedCities,
      holidays: this.selectedHolidays,
    });

    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    const formData = {
      ...this.form.value,
      chargeRanges: this.chargeRanges
    };

    if (this.isEditMode) {
      this.ShippingService.updateShippingCharge({
        _id: this.chargeDetails?._id,
        ...formData,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.close();
            this.getShippingCharges();
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.HotToastService.error(res?.errorMessage);
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message);
        },
      });
    } else {
      this.ShippingService.createShippingCharge(formData).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.close();
            this.getShippingCharges();
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.HotToastService.error(res?.errorMessage);
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message);
        },
      });
    }
  }

  delete(chargeId: string) {
    this.ShippingService.deleteShippingCharge(chargeId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.close();
          this.getShippingCharges();
        } else {
          this.HotToastService.error(res?.errorMessage);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }
}
