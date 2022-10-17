import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit {
  appRoute = appRoutes;
  banners: any
  base: any
  page: any = 1
  limit: any = 8
  totalcount: any;
  totaldata: number;
  currpage: number = 1;
  selectedpage: number = 1;
  pages: any = [];
  max: number = 3;
  isNext: boolean;
  count: any;
  shifted: number;

  constructor(
    private bannerService: BannerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base

    this.bannerService.getBannersByPage(this.page, this.limit).subscribe((res: any) => {
      this.banners = res?.result
      this.cdr.markForCheck()
    })

    this.bannerService.getBannersCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.cdr.markForCheck();
      this.setPages()
    })
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  fetchBanner(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(page, limit)
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.currpage, this.limit)
      } else {
        this.getData(this.currpage, this.limit)
      }
    }
  }

  setPages() {
    this.currpage = 1
    this.selectedpage = 1
    this.pages.length = 0
    if (this.totaldata > 3) {
      for (let i = 1; i <= this.max; i++) {
        this.pages.push(i)
      }
    } else {
      for (let i = 1; i <= this.totaldata; i++) {
        this.pages.push(i)
      }
    }
  }

  getData(page: any, limit: any) {
    this.bannerService.getBannersByPage(page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.banners = res?.result
        this.count = this.banners.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
