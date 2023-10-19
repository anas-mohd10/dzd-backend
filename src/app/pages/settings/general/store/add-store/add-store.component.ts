import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private StoresService: StoresService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private TimeslotsService: TimeslotsService,
    private Router: Router,
    private ToastrService: ToastrService
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
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6,15}$")]),
      firstlane: new FormControl(''),
      secondlane: new FormControl(''),
      area: new FormControl(''),
      landmark: new FormControl(''),
      city: new FormControl(''),
      map: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      isClickPoint: new FormControl(false),
      countryCode: new FormControl('', Validators.required),
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
    console.log("clicked");

    if (!this.form.valid) {
      this.isValid = false

      return
    }

    const payload = this.createPayload()

    if (payload && this.slots.length > 0) {
      this.StoresService.add(payload).subscribe((res: any) => {
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
      isClickPoint: this.form.get('isClickPoint')?.value,
      isFeatured: this.form.get('isFeatured')?.value,
      slots: this.slots
    }

    return data
  }
}
