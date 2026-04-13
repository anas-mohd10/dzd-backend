import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
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
  styleUrls: ['./shipping-charge.component.scss'],
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
  base: string = environment.base;
  methodIcon: string = '';
  isMethodSubmitted: boolean = false;
  isMethodUpdate: boolean = false;
  methodDetails: any;
  countries: Array<any> = ['India', 'UAE', 'Iraq', 'Qatar', 'Bahrain', 'KSA', 'Oman', 'Kuwait'];
  isCountryEditable: boolean = false;
  selectedCountries: Array<any> = [];
  methodForm: FormGroup = new FormGroup({});
  countrySelected: FormControl = new FormControl('');
  defaultCountryAndState: FormControl = new FormControl('UAE,Dubai');
      // Add new properties for charge ranges
      chargeRanges: Array<any> = [];
      newChargeRange: any = {
        minAmount: null,
        maxAmount: null,
        charge: null
      };

  // Weight-based pricing ranges (kg)
  weightRanges: Array<any> = [];
  newWeightRange: any = { minWeight: null, maxWeight: null, charge: null };

  // Volume-based pricing ranges (effective kg after dimensional weight factor)
  volumeRanges: Array<any> = [];
  newVolumeRange: any = { minVolume: null, maxVolume: null, charge: null };

  constructor(
    private BsModalService: BsModalService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ShippingService: ShippingService,
    private DeliveryMethodService: DeliveryMethodService,
    private AppSettingsService: AppSettingsService
  ) {}

  toggleCountry() {
    if (this.selectedCountries.includes(this.countrySelected.value)) {
      this.selectedCountries = this.selectedCountries.filter(
        (item: string) => item != this.countrySelected.value
      );
      this.HotToastService.success(`Country removed successfully`);
    } else {
      this.selectedCountries.push(this.countrySelected.value);
      this.HotToastService.success(`Country added successfully`);
    }
    this.countrySelected.setValue('');
  }

  removeCountry(country: string) {
    this.selectedCountries = this.selectedCountries.filter(
      (item: string) => item != country
    );
  }

  countryEditable() {
    this.isCountryEditable = true;
    this.selectedCountries = [...this.shippingDetails.country];
    this.defaultCountryAndState.setValue(
      `${this.shippingDetails.defaultCountry},${this.shippingDetails.defaultState}`
    );
  }

  onSaveChanges() {
    if (
      !this.selectedCountries.includes(
        this.defaultCountryAndState.value.split(',')[0]
      )
    ) {
      this.HotToastService.error('Default country is not selected');
      return;
    }

    this.ShippingService.manageShipping({
      country: this.selectedCountries,
      defaultCountry: this.defaultCountryAndState.value.split(',')[0],
      defaultState: this.defaultCountryAndState.value.split(',')[1],
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getDetails();
          this.isCountryEditable = false;
          this.selectedCountries = [];
          this.countrySelected.setValue('');
          this.defaultCountryAndState.setValue('');
          this.ChangeDetectorRef.markForCheck();
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      country: new FormControl('UAE', Validators.required),
      city: new FormControl('', Validators.required),
      charge: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),

    });

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });

    this.methodForm = new FormGroup({
      name: new FormControl('', Validators.required),
      amountType: new FormControl('flat'),
      amount: new FormControl('', [
        Validators.pattern(/^\d+$/),
      ]),
      icon: new FormControl(''),
      freeAbove: new FormControl('', [
        Validators.pattern(/^\d+$/),
      ]),
      orderAmount: new FormControl('', [
        Validators.pattern(/^\d+$/),
      ]),
      isActive: new FormControl('true', Validators.required),
      applyOn: new FormControl('total'),
      // Add new form controls for shipping types
      shippingType: new FormControl('standard'),
      freeShippingThreshold: new FormControl('499', [
        Validators.pattern(/^\d+$/),
      ]),
      weightFlatCharge: new FormControl('0', [Validators.pattern(/^\d+\.?\d*$/)]),
      volumeFlatCharge: new FormControl('0', [Validators.pattern(/^\d+\.?\d*$/)]),
      // Remove these fields as we'll use freeAbove and orderAmount instead
      // minimumOrderAmount: new FormControl('', [
      //   Validators.pattern(/^\d+$/),
      // ]),
      // fixedCharge: new FormControl('', [
      //   Validators.pattern(/^\d+$/),
      // ]),
    });

    this.getMethods();
    this.getDetails();
  }

  get formControls() {
    return this.form.controls;
  }

  //Delivery methods
  // openMethod(template: TemplateRef<any>, mode?: string, methodId?: string) {
  //   this.methodRef = this.BsModalService.show(template, {
  //     class: 'modal-lg modal-dialog-centered',
  //   });
  //   if (mode == 'update') {
  //     this.isMethodUpdate = true;
  //     this.DeliveryMethodService.getMethod(methodId || '').subscribe({
  //       next: (res: any) => {
  //         if (res?.errorCode == 0) {
  //           this.methodDetails = res?.result;
  //           this.methodIcon = res?.result?.icon;

  //           // Set charge ranges if available
  //           if (res?.result?.chargeRanges && res?.result?.chargeRanges.length > 0) {
  //             this.chargeRanges = [...res?.result?.chargeRanges];
  //           } else {
  //             this.chargeRanges = [];
  //           }

  //           this.methodForm.patchValue(res?.result);
  //           this.ChangeDetectorRef.markForCheck();
  //         }
  //       },
  //     });
  //   }
  // }

  handleMethodIcon(event: any) {
    this.methodForm.patchValue({ icon: event.path });
  }

  get methodFormControls() {
    return this.methodForm.controls;
  }

  // Update the addMethod function to handle the new shipping types
  addMethod() {
    if (!this.methodForm.valid) {
      this.isMethodSubmitted = true;

      // Show specific validation errors
      const controls = this.methodForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          let errorMessage = 'Please fill in all required fields';

          if (controls[name].errors?.required) {
            errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
          } else if (controls[name].errors?.pattern) {
            errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} has an invalid format`;
          }

          this.HotToastService.error(errorMessage);
          break;
        }
      }
      return;
    }

    // Validate based on shipping type
    const shippingType = this.methodForm.get('shippingType')?.value;

    if (shippingType === 'tiered' && this.chargeRanges.length === 0) {
      this.HotToastService.error('At least one charge range is required for tiered pricing');
      return;
    }

    // Prepare the data to send to the API
    const methodData = {...this.methodForm.value};

    // Add charge ranges for tiered pricing
    if (shippingType === 'tiered') {
      methodData.chargeRanges = this.chargeRanges;
    }

    // Always include weight/volume ranges (empty arrays are safe defaults)
    methodData.weightRanges = this.weightRanges;
    methodData.volumeRanges = this.volumeRanges;

    // For threshold shipping, map the fields for API compatibility
    if (shippingType === 'threshold') {
      // We're using orderAmount as minimumOrderAmount and freeAbove as fixedCharge
      methodData.minimumOrderAmount = methodData.orderAmount;
      methodData.fixedCharge = methodData.freeAbove;
    }

    if(shippingType === 'free'){
      // We're using orderAmount as minimumOrderAmount and freeAbove as 0
      methodData.freeAbove = '0';
      methodData.amount = '0';
      methodData.minimumOrderAmount = '0';
      methodData.orderAmount = '0';
    }

    // Additional validation based on shipping type
    if (shippingType === 'standard' && Number(methodData.amount) <= 0) {
      this.HotToastService.error('Amount must be greater than zero for standard shipping');
      return;
    }

    if (this.isMethodUpdate) {
      this.DeliveryMethodService.updateMethod({
        _id: this.methodDetails?._id,
        ...methodData,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.getMethods();
            this.closeMethod();
            this.ChangeDetectorRef.markForCheck();
            this.HotToastService.success(res?.message);
          } else {
            this.HotToastService.error(res?.message || 'Failed to update shipping method');
          }
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'An error occurred while updating the shipping method';
          this.HotToastService.error(errorMessage);
        },
      });
    } else {
      this.DeliveryMethodService.addMethod(methodData).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.getMethods();
            this.closeMethod();
            this.ChangeDetectorRef.markForCheck();
            this.HotToastService.success(res?.message);
          } else {
            this.HotToastService.error(res?.message || 'Failed to add shipping method');
          }
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'An error occurred while adding the shipping method';
          this.HotToastService.error(errorMessage);
        },
      });
    }
  }

  // Update the openMethod function to handle existing charge ranges
  openMethod(template: TemplateRef<any>, mode?: string, methodId?: string) {
    this.methodRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
    if (mode == 'update') {
      this.isMethodUpdate = true;
      this.DeliveryMethodService.getMethod(methodId || '').subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.methodDetails = res?.result;
            this.methodIcon = res?.result?.icon;

            // Set charge ranges if available
            if (res?.result?.chargeRanges && res?.result?.chargeRanges.length > 0) {
              this.chargeRanges = [...res?.result?.chargeRanges];
            } else {
              this.chargeRanges = [];
            }

            // Set weight ranges if available
            this.weightRanges = res?.result?.weightRanges?.length > 0 ? [...res.result.weightRanges] : [];
            // Set volume ranges if available
            this.volumeRanges = res?.result?.volumeRanges?.length > 0 ? [...res.result.volumeRanges] : [];

            this.methodForm.patchValue(res?.result);
            this.ChangeDetectorRef.markForCheck();
          }
        },
      });
    }
  }

  // Update the closeMethod function to reset charge ranges
  closeMethod() {
    this.methodIcon = '';
    this.isMethodUpdate = false;
    this.chargeRanges = [];
    this.newChargeRange = { minAmount: null, maxAmount: null, charge: null };
    this.weightRanges = [];
    this.newWeightRange = { minWeight: null, maxWeight: null, charge: null };
    this.volumeRanges = [];
    this.newVolumeRange = { minVolume: null, maxVolume: null, charge: null };
    this.methodRef?.hide();
    this.methodForm.reset();
    this.methodForm.patchValue({
      amountType: 'flat',
      applyOn: 'total',
      isActive: 'true',
      shippingType: 'standard',
      weightFlatCharge: '0',
      volumeFlatCharge: '0',
    });
  }
  deleteMethod(methodId: string) {
    this.DeliveryMethodService.deleteMethod(methodId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMethods();
          this.ChangeDetectorRef.markForCheck();
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }

  getMethods() {
    this.DeliveryMethodService.getMethods('').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.deliveryMethods = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }

  // Add new methods for handling charge ranges
  onShippingTypeChange() {
    const shippingType = this.methodForm.get('shippingType')?.value;

    // Reset charge ranges when switching away from tiered pricing
    if (shippingType !== 'tiered') {
      this.chargeRanges = [];
    }

    // Set default values based on shipping type
    if (shippingType === 'free') {
      this.methodForm.patchValue({
        freeAbove: '499',  // Only need freeAbove for free shipping
        amount: '0',       // Set amount to 0 for free shipping
        amountType: 'flat' // Default amount type
      });
    } else if (shippingType === 'standard') {
      this.methodForm.patchValue({
        freeAbove: '499',   // Free above this amount
        orderAmount: '0',   // Minimum order amount
        amount: '50',       // Default shipping amount
        amountType: 'flat'  // Default amount type
      });
    } else if (shippingType === 'threshold') {
      this.methodForm.patchValue({
        orderAmount: '100',  // Minimum order amount
        freeAbove: '10',     // Fixed charge amount
        amount: '0',         // Not used for threshold
        amountType: 'flat'   // Default amount type
      });
    }

    this.ChangeDetectorRef.markForCheck();
  }

  // Utility function to validate charge range values
  validateChargeRange(range: any): { isValid: boolean; errorMessage?: string } {
  // Check if any field is null or undefined (allows zero values)
  if (range.minAmount === null || range.minAmount === undefined ||
  range.maxAmount === null || range.maxAmount === undefined ||
  range.charge === null || range.charge === undefined) {
  return { isValid: false, errorMessage: 'All fields are required for charge range' };
  }

  // Check if min amount is less than max amount
  if (Number(range.minAmount) >= Number(range.maxAmount)) {
  return { isValid: false, errorMessage: 'Min amount must be less than max amount' };
  }

  return { isValid: true };
  }

  addChargeRange() {
  // Use the utility function to validate
  const validation = this.validateChargeRange(this.newChargeRange);

  if (!validation.isValid) {
  this.HotToastService.error(validation.errorMessage || 'Invalid charge range');
  return;
  }

  // Add the new charge range
  this.chargeRanges.push({...this.newChargeRange});

  // Reset the form
  this.newChargeRange = {
  minAmount: null,
  maxAmount: null,
  charge: null
  };

  this.ChangeDetectorRef.markForCheck();
  }

  removeChargeRange(index: number) {
    this.chargeRanges.splice(index, 1);
    this.ChangeDetectorRef.markForCheck();
  }

  addWeightRange() {
    if (this.newWeightRange.minWeight === null || this.newWeightRange.maxWeight === null || this.newWeightRange.charge === null) {
      this.HotToastService.error('All weight range fields are required');
      return;
    }
    if (Number(this.newWeightRange.minWeight) >= Number(this.newWeightRange.maxWeight)) {
      this.HotToastService.error('Min weight must be less than max weight');
      return;
    }
    this.weightRanges.push({ ...this.newWeightRange });
    this.newWeightRange = { minWeight: null, maxWeight: null, charge: null };
    this.ChangeDetectorRef.markForCheck();
  }

  removeWeightRange(index: number) {
    this.weightRanges.splice(index, 1);
    this.ChangeDetectorRef.markForCheck();
  }

  addVolumeRange() {
    if (this.newVolumeRange.minVolume === null || this.newVolumeRange.maxVolume === null || this.newVolumeRange.charge === null) {
      this.HotToastService.error('All volume range fields are required');
      return;
    }
    if (Number(this.newVolumeRange.minVolume) >= Number(this.newVolumeRange.maxVolume)) {
      this.HotToastService.error('Min volume must be less than max volume');
      return;
    }
    this.volumeRanges.push({ ...this.newVolumeRange });
    this.newVolumeRange = { minVolume: null, maxVolume: null, charge: null };
    this.ChangeDetectorRef.markForCheck();
  }

  removeVolumeRange(index: number) {
    this.volumeRanges.splice(index, 1);
    this.ChangeDetectorRef.markForCheck();
  }

  getDetails() {
    this.ShippingService.shippingDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.shippingDetails = res?.result;
          this.getBlacklistedDetails();
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }

  getBlacklistedDetails() {
    this.ShippingService.getShippingCharges('true').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blacklistedCities = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }
}
