import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';

  isShowClicked: Boolean = false
  pages: any = [1, 2, 3]
  currentPage: any = this.pages[0]

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.isShowClicked = false
    this.headerLeft = this.layout.getProp('header.left') as string;
  }

  toggleNotifications() {
    this.isShowClicked = !this.isShowClicked
  }

  fetchNotifications(page: any) {
    this.currentPage = page
  }
}
