import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { validators } from 'src/app/config/constants/mobile-validators';
import { appRoutes } from 'src/app/config/routes';
import { StoresService } from 'src/app/includes/services/stores.service';
import { TimeslotsService } from 'src/app/includes/services/timeslots.service';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss']
})
export class AddStoreComponent implements OnInit {
  timeslots: Array<any> = []
  form: FormGroup
  slots: Array<any> = []
  appRoute = appRoutes
  isValid: Boolean = true
  storeImg: string = ''

  constructor(
    private StoresService: StoresService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private TimeslotsService: TimeslotsService,
    private Router: Router,
    private Toast: HotToastService
  ) { }

  get fc() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.initForm()
    this.TimeslotsService.getActiveSlots().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.timeslots = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      tel: new FormControl('', [Validators.pattern("^[0-9]{6,15}$")]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6,15}$")]),
      firstlane: new FormControl('', Validators.required),
      secondlane: new FormControl(''),
      area: new FormControl(''),
      landmark: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl(''),
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      city: new FormControl('', Validators.required),
      state:new FormControl('',Validators.required),
      pincode:new FormControl(''),
      map: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      isClickPoint: new FormControl(false),
      countryCode: new FormControl('+971', Validators.required),
      isFeatured: new FormControl(false)
    })
    this.handleMobilePattern()
  }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleStoreImage(event: any) {
    this.storeImg = event.path
    this.ChangeDetectorRef.markForCheck()
  }

  onRemove(mediaType: string) {
    if (mediaType === 'storeImg') {
      this.storeImg = ''
    }
    this.ChangeDetectorRef.markForCheck()
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

  selectSlot(id: any) {
    if (this.slots.includes(id)) {
      this.slots = this.slots.filter(item => item != id)
    } else {
      this.slots.push(id)
    }
  }

  addDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }

    this.StoresService.add({
      storeImg: this.storeImg,
      name: this.form.get('name')?.value,
      contact: {
        email: this.form.get('email')?.value,
        mobile: this.form.get('mobile')?.value,
        countryCode: this.form.get('countryCode')?.value,
        tel: this.form.get('tel')?.value,
      },
      address: {
        firstlane: this.form.get('firstlane')?.value,
        secondlane: this.form.get('secondlane')?.value,
        city: this.form.get('city')?.value,
        state:this.form.get('state')?.value,
        pincode:this.form.get('pincode')?.value,
        area: this.form.get('area')?.value,
        landmark: this.form.get('landmark')?.value,
      },
      openingHours: {
        startTime: this.form.get('startTime')?.value,
        endTime: this.form.get('endTime')?.value,
      },
      lat: this.form.get('lat')?.value,
      lng: this.form.get('lng')?.value,
      map: this.form.get('map')?.value,
      isActive: this.form.get('isActive')?.value,
      isClickPoint: this.form.get('isClickPoint')?.value,
      isFeatured: this.form.get('isFeatured')?.value,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.Toast.success(res?.message)
        this.Router.navigate([appRoutes.stores.STORE_LIST])
      } else {
        this.Toast.error(res?.message)
      }
    })
  }
}
