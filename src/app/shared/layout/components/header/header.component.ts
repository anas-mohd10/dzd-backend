import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent } from '../../../kt/components';
import { appRoutes } from 'src/app/config/routes';
import { SocketService } from 'src/app/includes/services/socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerContainerCssClasses: string = '';
  asideDisplay: boolean = true;
  headerLeft: string = 'menu';
  pageTitleCssClasses: string = '';
  pageTitleAttributes: { [attrName: string]: string | boolean };
  appRoute = appRoutes
  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
  private socket: any;
  private unsubscribe: Subscription[] = [];

  constructor(
    private LayoutService: LayoutService,
    private Router: Router,
    private SocketService: SocketService
  ) { this.routingChanges() }

  ngOnInit(): void {
    this.headerContainerCssClasses = this.LayoutService.getStringCSSClasses('headerContainer');
    this.asideDisplay = this.LayoutService.getProp('aside.display') as boolean;
    this.headerLeft = this.LayoutService.getProp('header.left') as string;
    this.pageTitleCssClasses = this.LayoutService.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.LayoutService.getHTMLAttributes('pageTitle');

    this.SocketService.onOrderPlaced().subscribe((data: any) => {
      console.log(data);
    })
  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (this.pageTitleAttributes.hasOwnProperty(key)) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  routingChanges() {
    const routerSubscription = this.Router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        MenuComponent.reinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
  }
}
