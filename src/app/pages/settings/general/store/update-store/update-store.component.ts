import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { validators } from 'src/app/config/constants/mobile-validators';
import { appRoutes } from 'src/app/config/routes';
import { StoresService } from 'src/app/includes/services/stores.service';
import { TimeslotsService } from 'src/app/includes/services/timeslots.service';

@Component({
  selector: 'app-update-store',
  templateUrl: './update-store.component.html',
  styleUrls: ['./update-store.component.scss']
})
export class UpdateStoreComponent implements OnInit {
  timeslots: Array<any> = []
  form: FormGroup
  slots: Array<any> = []
  appRoute = appRoutes
  isValid: Boolean = true
  refid: any = null
  storeDetails: any = null

  constructor(
    private StoresService: StoresService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private TimeslotsService: TimeslotsService,
    private Router: Router,
    private ToastrService: HotToastService,
    private ActivatedRoute: ActivatedRoute
  ) { }

  get fc() {
    return this.form.controls
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

  deleteStore() {
    this.StoresService.delete(this.storeDetails?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          this.Router.navigate([appRoutes.stores.STORE_LIST])
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  ngOnInit(): void {
    this.refid = this.ActivatedRoute.snapshot.queryParams.store || ''
    this.initForm()
    this.TimeslotsService.getActiveSlots().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.timeslots = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    if (this.refid) {
      this.StoresService.getStoreDetails({ refid: this.refid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.storeDetails = res?.result
          this.form.get('name')?.setValue(res?.result?.name)
          this.form.get('email')?.setValue(res?.result?.contact?.email)
          this.form.get('tel')?.setValue(res?.result?.contact?.tel)
          this.form.get('mobile')?.setValue(res?.result?.contact?.mobile)
          this.form.get('countryCode')?.setValue(res?.result?.contact?.countryCode)

          this.form.get('map')?.setValue(res?.result?.map)
          this.form.get('firstlane')?.setValue(res?.result?.address?.firstlane)
          this.form.get('secondlane')?.setValue(res?.result?.address?.secondlane)
          this.form.get('area')?.setValue(res?.result?.address?.area)
          this.form.get('city')?.setValue(res?.result?.address?.city)
          this.form.get('landmark')?.setValue(res?.result?.address?.landmark)
          this.form.get('isActive')?.setValue(res?.result?.isActive)

          this.form.get('lat')?.setValue(res?.result?.lat)
          this.form.get('lng')?.setValue(res?.result?.lng)
          this.form.get('startTime')?.setValue(res?.result?.openingHours?.startTime)
          this.form.get('endTime')?.setValue(res?.result?.openingHours?.endTime)

          this.form.get('isFeatured')?.setValue(res?.result?.isFeatured)
          this.form.get('isClickPoint')?.setValue(res?.result?.isClickPoint)
          this.form.get('isDelete')?.setValue(res?.result?.isDelete)
          this.slots = res?.result?.slots

          this.ChangeDetectorRef.markForCheck()
        }
      })
    }
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      tel: new FormControl('', [Validators.pattern("^[+0-9]{6,15}$")]),
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
      map: new FormControl('', Validators.required),
      countryCode: new FormControl('+971', Validators.required),
      isActive: new FormControl(true),
      isDelete: new FormControl(false),
      isClickPoint: new FormControl(false),
      isFeatured: new FormControl(false)
    })
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

    const payload = this.createPayload()
    this.StoresService.update(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        this.Router.navigate([appRoutes.stores.STORE_LIST])
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }

  createPayload() {
    let data = {
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
      isFeatured: this.form.get('isFeatured')?.value,
      isClickPoint: this.form.get('isClickPoint')?.value,
      isDelete: this.form.get('isDelete')?.value,
      refid: this.refid
    }

    return data
  }
}
