import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HomeWidgetsService } from 'src/app/includes/services/home-widgets.service';

@Component({
  selector: 'app-design-topbar',
  templateUrl: './design-topbar.component.html',
  styleUrls: ['./design-topbar.component.scss']
})
export class DesignTopbarComponent implements OnInit, OnChanges {
  settings: any = {}
  @Input() page: string = '';
  @Input() isDraft?: boolean = false;
  @Output() device = new EventEmitter();
  deviceType: string = 'desktop';
  domain: string = ''
  hideTopbarDetails: boolean = false
  showDevices: Array<string> = ['home', 'catalog', 'product-listing']
  hiddenPages: Array<string> = ['app-images', 'catalog', 'contact-us', 'about-us', 'product-designs', 'product-listing']

  constructor(
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HomeWidgetsService: HomeWidgetsService,
    private Toast: HotToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.hiddenPages.includes(this.page) ? this.hideTopbarDetails = true : null
  }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId("1").subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result;
        this.domain = this.settings?.domain || ''
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  toggleDevice(type: string) {
    this.device.emit(type)
    this.deviceType = type;
  }

  saveDraft() {
    switch (this.page) {
      case 'home':
        this.saveHomeWidgetsDraft()
        break;
      default:
        break;
    }
  }

  publishWidgets() {
    switch (this.page) {
      case 'home':
        this.publishHomeWidgets()
        break;
      default:
        break;
    }
  }

  publishHomeWidgets() {
    this.HomeWidgetsService.publishHomeWidgets().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  saveHomeWidgetsDraft() {
    this.HomeWidgetsService.saveHomeWidgetsDraft().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
}
