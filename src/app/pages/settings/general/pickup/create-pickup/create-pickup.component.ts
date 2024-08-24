import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { validators } from 'src/app/config/constants/mobile-validators';
import { appRoutes } from 'src/app/config/routes';
import { PickupService } from 'src/app/includes/services/pickup.service';

interface PlaceProps {
  key: string;
  value: string;
}

@Component({
  selector: 'app-create-pickup',
  templateUrl: './create-pickup.component.html',
  styleUrls: ['./create-pickup.component.scss']
})
export class CreatePickupComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  appRoute = appRoutes;
  isSubmitted: boolean = false
  uaeStates: PlaceProps[] = [
    { key: 'Dubai', value: 'Dubai' },
    { key: 'Abu Dhabi', value: 'Abu Dhabi' },
    { key: 'Sharjah', value: 'Sharjah' },
    { key: 'Ajman', value: 'Ajman' },
    { key: 'Ras Al Khaimah', value: 'Ras Al Kahimah' },
    { key: 'Fujairah', value: 'Fujairah' },
    { key: 'Umm Al Quwain', value: 'Umm Al Quwain' },
  ]
  indiaStates: PlaceProps[] = [
    { key: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { key: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { key: 'Assam', value: 'Assam' },
    { key: 'Bihar', value: 'Bihar' },
    { key: 'Kerala', value: 'kerala' },
    { key: 'Tamilnadu', value: 'Tamil Nadu' },
    { key: 'Karnataka', value: 'Karnataka' },
    { key: 'Telangana', value: 'Telangana' },
  ]
  countryItems: PlaceProps[] = [
    { key: 'UAE', value: 'UAE' },
    { key: 'India', value: 'India' },
  ]
  stateItems: PlaceProps[] = this.uaeStates

  constructor(
    private HotToastService: HotToastService,
    private Router: Router,
    private PickupService: PickupService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  onCountryChange() {
    switch (this.form.get('country')?.value) {
      case 'UAE':
        this.stateItems = this.uaeStates
        this.form.get('state')?.setValue('Dubai')
        break;
      case 'India':
        this.stateItems = this.indiaStates
        this.form.get('state')?.setValue('Kerala')
        break;
      default:
        this.stateItems = this.uaeStates
    }
    this.ChangeDetectorRef.markForCheck()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      country: new FormControl('UAE', Validators.required),
      state: new FormControl('Dubai', Validators.required),
      name: new FormControl('', Validators.required),
      countryCode: new FormControl('+971', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6,15}$")]),
      address: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      city: new FormControl('', Validators.required),
    });
    this.handleMobilePattern()
  }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get("countryCode")?.value) {
      case "+91":
        this.updateMobilePattern(`^[0-9]{${validators.india.validation.maximum}}$`);
        break;
      case "+971":
        this.updateMobilePattern(`^[0-9]{${validators.uae.validation.maximum}}$`);
        break;
    }
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.PickupService.create(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.pickupLocations.list])
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }
}
