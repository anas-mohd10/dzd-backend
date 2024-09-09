import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-cart-settings',
  templateUrl: './cart-settings.component.html',
  styleUrls: ['./cart-settings.component.scss']
})
export class CartSettingsComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});

  constructor(
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      isMiniCart: new FormControl(false),
      isRecentlyBought: new FormControl(false),
      isTopSelling: new FormControl(false),
      minimumCartAmount: new FormControl(0, Validators.pattern('^[0-9]*$')),
      isTopRated: new FormControl(false),
    })

    this.getSettings()
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  onSwitchTriggered(event: {toggleState: boolean, switchId: string}) {
    this.form.get(event.switchId)?.setValue(event.toggleState)
  }

  onSubmit() {
    if(!this.form.valid){
      this.HotToastService.error('Please fill appropiate values in the form')
      return
    }

    this.AppSettingsService.updateSettings(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.getSettings()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message || 'Something went wrong')
      }
    })
  }



}
