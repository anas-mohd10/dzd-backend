import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { TimeslotsService } from 'src/app/includes/services/timeslots.service';

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss']
})
export class TimeslotsComponent implements OnInit {
  appRoute = appRoutes
  data: Array<any> = []
  form: FormGroup;
  refid: any = null
  isValid: Boolean = true

  constructor(
    private TimeslotsService: TimeslotsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService
  ) { }

  get fc() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.initForm()

    this.TimeslotsService.getSlots().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required),
      isActive: new FormControl(true, Validators.required),
      isDelete: new FormControl(false)
    })
  }

  getDetails(id: any) {
    this.TimeslotsService.getSlotDetails({ refid: id }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.form.patchValue(res?.result)
        this.refid = res?.result?.refid
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  resetForm() {
    this.initForm()
    this.refid = null
  }

  addDetails() {
    if (!this.form.valid) {
      this.isValid = false
      return
    }

    if (!this.refid) {
      this.TimeslotsService.add(this.form.value).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          document.location.reload()
        } else {
          this.ToastrService.error(res?.message)
        }
      })
    } else {
      this.form.value['refid'] = this.refid

      this.TimeslotsService.update(this.form.value).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.refid = null
          this.ToastrService.success(res?.message)
          document.location.reload()
        } else {
          this.ToastrService.error(res?.message)
        }
      })
    }
  }
}
