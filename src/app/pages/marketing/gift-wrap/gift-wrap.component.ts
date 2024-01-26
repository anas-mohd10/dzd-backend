import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { GiftWrapService } from 'src/app/includes/services/gift.wrap.service';

@Component({
  selector: 'app-gift-wrap',
  templateUrl: './gift-wrap.component.html',
  styleUrls: ['./gift-wrap.component.scss']
})
export class GiftWrapComponent implements OnInit {
  appRoute = appRoutes
  giftWrapDetails: any = {};
  form: FormGroup
  isSubmitted: boolean = false;

  constructor(
    private GiftWrapService: GiftWrapService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      isEnabled: new FormControl("false"),
      isOrderLevel: new FormControl("false"),
      minimumValue: new FormControl("", Validators.pattern(/^[0-9]*$/)),
      giftCharge: new FormControl("", Validators.pattern(/^[0-9]*$/)),
    });

    this.getGiftWrapDetails()
  }

  get formControls() {
    return this.form.controls
  }

  toggleCheckbox(type: string) {
    switch (type) {
      case "isEnabled":
        this.form.patchValue({ isEnabled: !this.form.value.isEnabled })
        break;
      case "isOrderLevel":
        this.form.patchValue({ isOrderLevel: !this.form.value.isOrderLevel })
        break;
      default:
        break;
    }
  }

  discard(){
    this.form.reset();
    this.getGiftWrapDetails()
  }

  update() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return
    }

    this.GiftWrapService.manageGiftWrap(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getGiftWrapDetails();
          this.isSubmitted = false
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message);
        }
      }, error: (err) => {
        this.Toast.error(err.error.message);
      }
    })
  }

  getGiftWrapDetails() {
    this.GiftWrapService.giftWrapDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.giftWrapDetails = res?.result;
          this.form.patchValue(this.giftWrapDetails);
          this.ChangeDetectorRef.detectChanges();
        } else {
          this.Toast.error(res?.message);
        }
      }, error: (err) => {
        this.Toast.error(err.message);
      }
    })
  }

}
