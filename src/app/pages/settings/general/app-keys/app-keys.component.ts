import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppKeysService } from 'src/app/includes/services/app-keys.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-app-keys',
  templateUrl: './app-keys.component.html',
  styleUrls: ['./app-keys.component.scss']
})
export class AppKeysComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup = new FormGroup({})
  isCurrentLocation: FormControl = new FormControl(false)
  isSearchLocation: FormControl = new FormControl(false)

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private AppKeysService: AppKeysService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.getKeys()
    this.getSettings()
    this.form = new FormGroup({
      googleMapKey: new FormControl(""),
    })
  }

  enableSettings(event: { toggleState: boolean, switchId: string }) {
    this.AppSettingsService.updateSettings({ [event.switchId]: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.getSettings()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.isCurrentLocation.setValue(res.result.isCurrentLocation)
          this.isSearchLocation.setValue(res.result.isSearchLocation)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  getKeys() {
    this.AppKeysService.keyDetails().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.form.patchValue(res.result)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  onSubmit() {
    this.AppKeysService.manageKeys(this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.getKeys()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

}
