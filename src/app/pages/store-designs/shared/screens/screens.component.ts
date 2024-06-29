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
  settings: any;
  websiteLink: SafeResourceUrl ;
  @Input() load: number = 0;

  constructor(
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private DomSanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.load) {
      this.websiteLink = this.DomSanitizer.bypassSecurityTrustResourceUrl(`${this.settings?.domain.endsWith('/') ? this.settings?.domain?.slice(0, -1) : this.settings?.domain}?type=preview`);
      this.reloadFrame()
    }
  }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res.result;
          this.websiteLink = this.DomSanitizer.bypassSecurityTrustResourceUrl(`${this.settings?.domain.endsWith('/') ? this.settings?.domain?.slice(0, -1) : this.settings?.domain}?type=draft`);
          this.ChangeDetectorRef.markForCheck()
        } else {

          
        }
      }, error: (err: any) => {

      }
    });
  }

  reloadFrame() {
    this.frame?.nativeElement.contentWindow?.location.reload();
  }
}
