import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from '../../includes/services/app.settings.service';

interface Settings {
  logo: string,
  darkLogo: string,
  adminLogo: string,
  defaultImage: string,
  favicon: string,
  adminFavicon: string,
  isDeveloperAccess: boolean,
  isStoreLive: boolean,
  isPaymentDue?: boolean
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  settings: Settings | null = null;

  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) {
    this.initService.init();
  }
  isReady: boolean = false;

  ngOnInit(): void {
    this.AppSettingsService.getSettings().subscribe((res: any) => {
      localStorage.setItem('primaryLanguage', res.result.primaryLang)
      environment.base = res.result.baseS3Url;
      this.isReady = true
      this.settings = res.result;
      this.ChangeDetectorRef.markForCheck()
    })

    // build view by layout config settings
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.toolbarDisplay = this.layout.getProp('toolbar.display') as boolean;
    this.contentContainerClasses = this.layout.getStringCSSClasses('contentContainer');
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('headerMenu');
  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }
  }

  // Check if the store is live
  checkStoreLive() {
    if (this.settings) {
      if (this.settings.isStoreLive == true) {
        return true;
      } else if (this.settings.isStoreLive == false) {
        if (this.settings.isDeveloperAccess == true) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
