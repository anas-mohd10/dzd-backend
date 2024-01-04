import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { LoyaltyService } from 'src/app/includes/services/loyalty.service';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {
  appRoute = appRoutes
  loyaltyDetails: any = {}
  form: FormGroup
  modalRef?: BsModalRef
  isSubmitted: boolean = false;
  settings: any = {}

  constructor(
    private LoyaltyService: LoyaltyService,
    private Toast: HotToastService,
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      earningAmount: new FormControl('', Validators.required),
      earningPoints: new FormControl('', Validators.required),
      conversionPoints: new FormControl('', Validators.required),
      conversionWorth: new FormControl('', Validators.required)
    })
    this.getLoyaltyDetails()
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  get formControls() {
    return this.form.controls
  }

  getLoyaltyDetails() {
    this.LoyaltyService.loyaltyDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.loyaltyDetails = res?.result;
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.form.get('earningAmount')?.setValue(this.loyaltyDetails?.earning?.amount)
    this.form.get('earningPoints')?.setValue(this.loyaltyDetails?.earning?.points)
    this.form.get('conversionWorth')?.setValue(this.loyaltyDetails?.conversion?.worth)
    this.form.get('conversionPoints')?.setValue(this.loyaltyDetails?.conversion?.points)
  }

  close() {
    this.modalRef?.hide()
    this.form.reset()
    this.isSubmitted = false;
  }

  confirm() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    this.LoyaltyService.manageLoyalty({
      earning: {
        amount: this.form.get('earningAmount')?.value,
        points: this.form.get('earningPoints')?.value
      }, conversion: {
        worth: this.form.get('conversionWorth')?.value,
        points: this.form.get('conversionPoints')?.value
      }
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.close()
          this.getLoyaltyDetails()
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message);
      }
    })
  }

}
