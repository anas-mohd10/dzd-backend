import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
@Component({
  selector: 'app-screens',
  templateUrl: './screens.component.html',
  styleUrls: ['./screens.component.scss']
})
export class ScreensComponent implements OnInit, OnChanges {
  @Input() device?: string;
  @ViewChild("frame") frame: ElementRef | undefined;
  @Input() page: string = '';
  @Input()catalogId?: string = '';
  settings: any;
  websiteLink: SafeResourceUrl;
  isLoading: boolean = true; // Flag to track loading state
  @Input() load: number = 0;

  constructor(
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private DomSanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.load) {      
      this.websiteLink = this.DomSanitizer.bypassSecurityTrustResourceUrl(`${this.settings?.domain.endsWith('/') ? this.settings?.domain?.slice(0, -1) : this.settings?.domain}?type=preview`);
      if(this.page == 'catalog') {
        this.websiteLink = this.DomSanitizer.bypassSecurityTrustResourceUrl(`${this.settings?.domain.endsWith('/') ? this.settings?.domain?.slice(0, -1) : this.settings?.domain}/catalogs/${this.catalogId}`);
      }
      this.reloadFrame()
    }
  }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res.result;
          this.websiteLink = this.DomSanitizer.bypassSecurityTrustResourceUrl(`${this.settings?.domain.endsWith('/') ? this.settings?.domain?.slice(0, -1) : this.settings?.domain}?type=draft`);
          console.log(this.catalogId);
          
          if(this.page == 'catalog') {
            this.websiteLink = this.DomSanitizer.bypassSecurityTrustResourceUrl(`${this.settings?.domain.endsWith('/') ? this.settings?.domain?.slice(0, -1) : this.settings?.domain}/catalogs/${this.catalogId}`);
          }
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { },
      complete: () => {
        this.isLoading = false; // Mark loading as complete
      }
    });
  }

  reloadFrame() {
    if (this.frame && this.frame.nativeElement) {
      this.isLoading = true; // Start loading state
      this.frame?.nativeElement.contentWindow?.location.reload();
    }
  }
}
