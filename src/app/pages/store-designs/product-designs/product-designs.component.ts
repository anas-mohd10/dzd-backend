import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ProductDesignsService } from 'src/app/includes/services/product.designs.service';
import { StoretimerService } from 'src/app/includes/services/storetimer.service';


@Component({
  selector: 'app-product-designs',
  templateUrl: './product-designs.component.html',
  styleUrls: ['./product-designs.component.scss']
})
export class ProductDesignsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  holidays: Array<string> = ['Sunday']
  isSubmitted: boolean = false;
  isTimerSubmitted: boolean = false;
  timerForm: FormGroup = new FormGroup({})

  constructor(
    private ProductDesignsService: ProductDesignsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private StoretimerService: StoretimerService
  ) { }

  get formControls() {
    return this.form.controls
  }

  get timerFormControls() {
    return this.timerForm.controls
  }

  toggleHolidays(day: string) {
    if (this.holidays.includes(day)) {
      this.holidays = this.holidays.filter(d => d !== day)
    } else {
      this.holidays.push(day)
    }
  }

  holidaysExists(day: string) {
    return this.holidays.includes(day)
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.ProductDesignsService.manageProductDesigns(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getProductDesigns()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      cutoffTime: new FormControl('', [Validators.required]),
      holidays: new FormControl(this.holidays, [Validators.required]),
      isEnabled: new FormControl(true),
      note: new FormControl(''),
      gridEnabled: new FormControl(true),
    });

    this.timerForm = new FormGroup({
      day: new FormControl('Sunday', [Validators.required]),
      cutoffTime: new FormControl('', [Validators.required]),
      deliveryGap: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
    });

    this.getStoreTimer('Sunday')

    this.getProductDesigns()
  }

  addStoreTimer() {
    if (!this.timerForm.valid) {
      this.isSubmitted = true
      return
    }

    this.StoretimerService.manageStoreTimer(this.timerForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getProductDesigns()
          this.isSubmitted = false
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  getStoreTimer(day: string) {
    this.timerForm.patchValue({ day: day, cutoffTime: "", deliveryGap: "" })
    this.StoretimerService.storeTimer(day).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.timerForm.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  getProductDesigns() {
    this.ProductDesignsService.getProductDesigns().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  switchToggled(event: { switchId: string, toggleState: boolean }) {
    this.form.get('isEnabled')?.setValue(event.toggleState)
  }

}
