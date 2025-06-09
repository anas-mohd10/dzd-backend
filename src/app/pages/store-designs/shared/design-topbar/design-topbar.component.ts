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
  @Output() productConfigDraft: EventEmitter<any> = new EventEmitter();
  @Output() productConfigPublish: EventEmitter<any> = new EventEmitter();
  @Output() isPublished: EventEmitter<any> = new EventEmitter();

  deviceType: string = 'desktop';
  domain: string = ''
  hideTopbarDetails: boolean = false
  showDevices: Array<string> = ['home', 'catalog', 'product-listing']
  hiddenPages: Array<string> = ['app-images', 'catalog', 'contact-us', 'about-us', 'product-designs']
  isPublishing: boolean = false;
  isDraftSaved: boolean = false; // Track if draft has been saved

  isShowPublish: boolean = false
  isShowDraft: boolean = false

  constructor(
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HomeWidgetsService: HomeWidgetsService,
    private Toast: HotToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.hiddenPages.includes(this.page) ? this.hideTopbarDetails = true : null
    
    // Reset draft saved state when page changes
    if (changes['page'] && !changes['page'].firstChange) {
      this.isDraftSaved = false;
    }
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
      case 'product-listing':
        this.productConfigDraft.emit()
        break;
      default:
        break;
    }
  }

  publishWidgets() {
    // Only allow publish if draft has been saved
    if (!this.isDraftSaved) {
      this.Toast.error('Please save as draft before publishing');
      return;
    }

    this.isPublishing = true;
    switch (this.page) {
      case 'home':
        this.publishHomeWidgets()
        break;
      case 'product-listing':
        this.productConfigPublish.emit()
        break;
      default:
        this.isPublishing = false;
        break;
    }
  }

  publishHomeWidgets() {
    this.HomeWidgetsService.publishHomeWidgets().subscribe({
      next: (res: any) => {
        this.isPublishing = false;
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.isPublished.emit(true)
          this.isDraftSaved = false; // Reset after successful publish
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.isPublishing = false;
        this.Toast.error(err?.error?.message)
      }
    })
  }

  saveHomeWidgetsDraft() {
    this.HomeWidgetsService.saveHomeWidgetsDraft().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.isDraftSaved = true; // Mark draft as saved
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  // Method to handle product listing draft save
  onProductConfigDraftSaved() {
    this.isDraftSaved = true;
    this.ChangeDetectorRef.markForCheck();
  }

  // Method to handle product listing publish
  onProductConfigPublished() {
    this.isDraftSaved = false; // Reset after successful publish
    this.ChangeDetectorRef.markForCheck();
  }
}