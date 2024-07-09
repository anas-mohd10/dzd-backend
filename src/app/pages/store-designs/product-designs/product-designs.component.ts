import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ProductDesignsService } from 'src/app/includes/services/product.designs.service';

@Component({
  selector: 'app-product-designs',
  templateUrl: './product-designs.component.html',
  styleUrls: ['./product-designs.component.scss']
})
export class ProductDesignsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  days: Array<string> = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  holidays: Array<string> = ['Sunday']
  isSubmitted: boolean = false

  constructor(
    private ProductDesignsService: ProductDesignsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService
  ) { }

  get formControls() {
    return this.form.controls
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
    if(!this.form.valid){
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
      cutOffTime: new FormControl('', [Validators.required]),
      holidays: new FormControl(this.holidays, [Validators.required]),
      deliveryGap: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
      isEnabled: new FormControl(true),
      note: new FormControl(''),
      gridEnabled: new FormControl(true),
    })

    this.getProductDesigns()
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
