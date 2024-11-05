import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-order-settings',
  templateUrl: './order-settings.component.html',
  styleUrls: ['./order-settings.component.scss']
})
export class OrderSettingsComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  settings: any = {}

  constructor(
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getSettings()
    this.form = new FormGroup({
      isCancelOrderEnabled: new FormControl(false)
    })
  }

  onSwitchTriggered(event: { toggleState: boolean, switchId: string }) {
    this.form.get(event.switchId)?.setValue(event.toggleState)
  }

  onSubmit() {
    this.AppSettingsService.updateSettings(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.getSettings()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

}
