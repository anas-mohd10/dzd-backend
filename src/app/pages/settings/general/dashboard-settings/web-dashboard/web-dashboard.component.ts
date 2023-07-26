import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-web-dashboard',
  templateUrl: './web-dashboard.component.html',
  styleUrls: ['./web-dashboard.component.scss']
})
export class WebDashboardComponent implements OnInit {
  dashboard: Array<any> = []
  routes = appRoutes
  settings: any = {}

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private Router: Router,
    private DomSanitizer: DomSanitizer
  ) { }

  @ViewChild('previewFrame', { static: true }) myIframe: ElementRef;
  iframeSrc: SafeResourceUrl = this.DomSanitizer.bypassSecurityTrustResourceUrl('https://sajidhaweb.s414.previewbay.com/');

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.DashboardService.getWebDashboard().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.dashboard = res?.Data?.home_details
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    let dashboard = [...this.dashboard]
    moveItemInArray(dashboard, event.previousIndex, event.currentIndex);
    this.dashboard = [...dashboard]
  }

  navigateBack() {
    window.history.back()
  }

  publish() {
    this.DashboardService.publishDashboard({ dashboard: JSON.stringify(this.dashboard) }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        window.open(this.settings.domain, '_blank')

      }
    })
  }

  preview() {
    this.DashboardService.previewDashboard({ dashboard: JSON.stringify(this.dashboard) }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        const iframeElement: HTMLIFrameElement = this.myIframe.nativeElement;
        iframeElement.src = iframeElement.src;
      }
    })
  }

  discard() {
    this.DashboardService.getWebDashboard().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.dashboard = res?.Data?.home_details
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
