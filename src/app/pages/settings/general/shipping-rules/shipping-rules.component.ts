import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { indiaStates } from 'src/app/config/constants/country/india';
import { iraqStates } from 'src/app/config/constants/country/iraq';
import { uaeStates } from 'src/app/config/constants/country/uae';
import { DeliveryMethodService } from 'src/app/includes/services/delivery-method.service';
import { LocationService } from 'src/app/includes/services/location.service';
import { ShippingService } from 'src/app/includes/services/shipping.service';

const staticCountries = ['India', 'UAE', 'Iraq', 'Qatar', 'Bahrain', 'KSA', 'Oman', 'Kuwait'];

const staticStatesFallback: Record<string, Array<{ name: string; cities: string[] }>> = {
  India: indiaStates.map(s => ({ name: s.state, cities: s.cities })),
  UAE: uaeStates.map(s => ({ name: s.state, cities: s.cities })),
  Iraq: iraqStates.map(s => ({ name: s.state, cities: s.cities })),
};

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
  countries: Array<any> = [];
  states: Array<any> = [];
  cities: Array<any> = [];
  selectedCountryId: string = '';
  staticCitiesMap: Record<string, string[]> = {};
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

  constructor(
    private ShippingService: ShippingService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private BsModalService: BsModalService,
    private DeliveryMethodService: DeliveryMethodService,
    private LocationService: LocationService
  ) {}

  get formControls() {
    return this.form.controls;
  }

  onStateChange() {
    const stateName = this.stateInput.value;
    if (this.selectedStates.includes(stateName)) {
      this.selectedStates = this.selectedStates.filter((s: any) => s !== stateName);
      this.HotToastService.success('State removed successfully');
    } else {
      this.selectedStates.push(stateName);
      this.HotToastService.success('State added successfully');
    }

    this.stateInput.setValue('');
    this.cities = [];

    if (this.selectedStates.length === 0) return;

    const apiStates = this.selectedStates.filter((sName: string) => {
      const stateDoc = this.states.find((s: any) => s.name === sName);
      return !!stateDoc?._id;
    });

    const staticCities = this.selectedStates
      .filter((sName: string) => !this.states.find((s: any) => s.name === sName)?._id)
      .reduce((acc: string[], sName: string) => [...acc, ...(this.staticCitiesMap[sName] ?? [])], []);

    this.cities = [...staticCities];

    if (apiStates.length === 0) {
      this.ChangeDetectorRef.markForCheck();
      return;
    }

    const cityRequests = apiStates.map((sName: string) => {
      const stateDoc = this.states.find((s: any) => s.name === sName);
      return this.LocationService.findCities(this.selectedCountryId, stateDoc?._id);
    });

    forkJoin(cityRequests).subscribe({
      next: (results: any[]) => {
        const apiCities = results
          .filter((res: any) => res?.errorCode == 0)
          .reduce((acc: string[], res: any) => [...acc, ...res.result.map((c: any) => c.name)], []);
        this.cities = [...this.cities, ...apiCities];
        this.ChangeDetectorRef.markForCheck();
      },
    });
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
    const countryName = this.form.get('country')?.value;
    const countryDoc = this.countries.find((c: any) => c.name === countryName);
    this.selectedCountryId = countryDoc?._id ?? '';
    this.states = [];
    this.cities = [];
    this.selectedStates = [];
    this.selectedCities = [];
    this.staticCitiesMap = {};

    if (!this.selectedCountryId) {
      this.useStaticFallback(countryName);
      return;
    }

    this.LocationService.findStates(this.selectedCountryId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0 && res.result?.length > 0) {
          this.states = res.result;
        } else {
          this.useStaticFallback(countryName);
        }
        this.ChangeDetectorRef.markForCheck();
      },
      error: () => {
        this.useStaticFallback(countryName);
        this.ChangeDetectorRef.markForCheck();
      },
    });
  }

  private useStaticFallback(countryName: string) {
    const fallback = staticStatesFallback[countryName] ?? [];
    this.states = fallback.map(s => ({ name: s.name }));
    this.staticCitiesMap = fallback.reduce((acc, s) => {
      acc[s.name] = s.cities;
      return acc;
    }, {} as Record<string, string[]>);
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
    });

    this.LocationService.findCountries().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          const apiCountryNames: string[] = res.result.map((c: any) => c.name);
          const missingStatic = staticCountries
            .filter(name => !apiCountryNames.includes(name))
            .map(name => ({ name }));
          this.countries = [...res.result, ...missingStatic];
          this.ChangeDetectorRef.markForCheck();
        }
      },
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
    });
    this.selectedCities = [];
    this.selectedStates = [];
    this.selectedHolidays = [];
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

    if (this.isEditMode) {
      this.ShippingService.updateShippingCharge({
        _id: this.chargeDetails?._id,
        ...this.form.value,
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
      this.ShippingService.createShippingCharge(this.form.value).subscribe({
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
