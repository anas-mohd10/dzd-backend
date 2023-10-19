import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private StoresService: StoresService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private TimeslotsService: TimeslotsService,
    private Router: Router,
    private ToastrService: ToastrService,
    private ActivatedRoute: ActivatedRoute
  ) { }

  get fc() {
    return this.form.controls
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
          this.form.get('name')?.patchValue(res?.result?.name)
          this.form.get('email')?.patchValue(res?.result?.contact?.email)
          this.form.get('mobile')?.patchValue(res?.result?.contact?.mobile)
          this.form.get('map')?.patchValue(res?.result?.map)
          this.form.get('firstlane')?.patchValue(res?.result?.address?.firstlane)
          this.form.get('secondlane')?.patchValue(res?.result?.address?.secondlane)
          this.form.get('area')?.patchValue(res?.result?.address?.area)
          this.form.get('city')?.patchValue(res?.result?.address?.city)
          this.form.get('landmark')?.patchValue(res?.result?.address?.landmark)
          this.form.get('isActive')?.patchValue(res?.result?.isActive)
          this.form.get('isFeatured')?.patchValue(res?.result?.isFeatured)
          this.form.get('isClickPoint')?.patchValue(res?.result?.isClickPoint)
          this.form.get('isDelete')?.patchValue(res?.result?.isDelete)
          this.form.get('countryCode')?.patchValue(res?.result?.contact?.countryCode)
          this.slots = res?.result?.slots
          this.ChangeDetectorRef.markForCheck()
        }
      })
    }
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6,15}$")]),
      firstlane: new FormControl(''),
      secondlane: new FormControl(''),
      area: new FormControl(''),
      landmark: new FormControl(''),
      city: new FormControl(''),
      map: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required),
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
      this.ToastrService.error('Invalid form')
      return
    }

    const payload = this.createPayload()
    console.log("payload")
    if (payload && this.slots.length > 0) {
      console.log(payload)
      this.StoresService.update(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          this.Router.navigate([appRoutes.stores.STORE_LIST])
        } else {
          this.ToastrService.error(res?.message)
        }
      })
    }
  }

  createPayload() {
    let data = {
      name: this.form.get('name')?.value,
      contact: {
        email: this.form.get('email')?.value,
        mobile: this.form.get('mobile')?.value,
        countryCode: this.form.get('countryCode')?.value,
      },
      address: {
        firstlane: this.form.get('firstlane')?.value,
        secondlane: this.form.get('secondlane')?.value,
        city: this.form.get('city')?.value,
        area: this.form.get('area')?.value,
        landmark: this.form.get('landmark')?.value,
      },
      map: this.form.get('map')?.value,
      isActive: this.form.get('isActive')?.value,
      isFeatured: this.form.get('isFeatured')?.value,
      isClickPoint: this.form.get('isClickPoint')?.value,
      isDelete: this.form.get('isDelete')?.value,
      slots: this.slots,
      refid: this.refid
    }

    return data
  }
}
