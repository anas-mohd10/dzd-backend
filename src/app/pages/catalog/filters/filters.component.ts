import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  appRoute = appRoutes
  storeFrontFields: Array<{ title: string, isShowHidden: boolean, isFilter: boolean }> = []
  form: FormGroup = new FormGroup({})
  isShowHidden: FormControl = new FormControl(false)
  settingsForm: FormGroup = new FormGroup({})
  searchFilterMode: number = 1;

  constructor(
    private ProductService: ProductService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.getStoreFields()
    this.getSettings()

    this.form = new FormGroup({
      storeFrontField: new FormControl(''),
      isFilter: new FormControl(false),
      isShowHidden: new FormControl(false)
    })

    this.settingsForm = new FormGroup({
      isCategoryFilter: new FormControl(false),
      isPriceFilter: new FormControl(false),
      isBrandFilter: new FormControl(false),
      isRatingFilter: new FormControl(false),
      isOriginFilter: new FormControl(false),
      isDiscountFilter: new FormControl(false),
      searchFilterMode: new FormControl(1)
    })
  }

  onSettingsSwitchTriggered(event: { switchId: string, toggleState: boolean }) {
    this.settingsForm.get(event.switchId)?.setValue(event.toggleState)
    this.onSubmitSettings()
  }

  onSwitchTriggered(event: { switchId: string, toggleState: boolean }) {
    this.form.get('storeFrontField')?.setValue(event.switchId)
    this.form.get('isFilter')?.setValue(event.toggleState)
    this.onSubmit()
  }

  onSubmit() {
    this.ProductService.updateStoreField(this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.getStoreFields()
          this.form.patchValue({
            storeFrontField: '',
            isFilter: false,
            isShowHidden: false
          })
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
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
          this.settingsForm.patchValue(res.result)
          // Set the searchFilterMode from settings
          this.searchFilterMode = res.result.searchFilterMode || 1;
        } else { }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  // Add new method to handle search filter mode changes
  onSearchFilterModeChange() {
    this.settingsForm.get('searchFilterMode')?.setValue(this.searchFilterMode);
    this.onSubmitSettings();
  }

  toggleHidden(storeFrontField: { isFilter: boolean, title: string, isShowHidden: boolean }) {
    this.form.patchValue({
      storeFrontField: storeFrontField.title,
      isFilter: storeFrontField.isFilter,
      isShowHidden: storeFrontField.isShowHidden
    })
    this.onSubmit()
  }

  onSubmitSettings() {
    this.AppSettingsService.updateSettings(this.settingsForm.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.getSettings()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }
}
