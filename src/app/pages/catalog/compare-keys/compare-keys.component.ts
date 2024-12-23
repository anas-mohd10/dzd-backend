import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-compare-keys',
  templateUrl: './compare-keys.component.html',
  styleUrls: ['./compare-keys.component.scss']
})
export class CompareKeysComponent implements OnInit {
  appRoute = appRoutes
  storeFrontFields: Array<{ title: string, isCompareKey: boolean }> = []
  form: FormGroup = new FormGroup({})
  isCompareEnabled: FormControl = new FormControl(false)

  constructor(
    private ProductService: ProductService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.getSettings()

    this.form = new FormGroup({
      storeFrontField: new FormControl(''),
      isCompareKey: new FormControl(false)
    })

    this.getStoreFields()
  }

  getStoreFields() {
    this.ProductService.getProductStoreFields().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.storeFrontFields = res.result
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.isCompareEnabled.setValue(res.result.isCompareEnabled)
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  onSwitchTriggered(event: { switchId: string, toggleState: boolean }) {
    this.form.get('storeFrontField')?.setValue(event.switchId)
    this.form.get('isCompareKey')?.setValue(event.toggleState)
    this.onSubmit()
  }

  onSubmit() {
    this.ProductService.updateStoreField({
      type: 'compare',
      ...this.form.value
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.getStoreFields()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      },
      error: (err: any) => { }
    })
  }

  onCompareKeyToggle(event: { toggleState: boolean, switchId: string }) {
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
}
