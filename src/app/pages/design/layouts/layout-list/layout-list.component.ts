import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { LayoutService } from 'src/app/includes/services/layout.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-layout-list',
  templateUrl: './layout-list.component.html',
  styleUrls: ['./layout-list.component.scss']
})
export class LayoutListComponent implements OnInit {

  appRoute = appRoutes;
  layouts: any = [];
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
    private service: LayoutService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base

    this.service.getLayoutByPage(this.page, this.limit).subscribe((res: any) => {
      this.layouts = res?.result
      this.count = this.layouts.length
      for (let data of this.layouts) {
        const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
        if (data.validTo > today) {
          data.isEditable = true
        } else {
          data.isEditable = false
        }
        data.validFrom = new Date(data.validFrom).toDateString()
        data.validTo = new Date(data.validTo).toDateString()
      }
      this.cdr.markForCheck()
    })

    this.service.getLayoutsCount().subscribe((res: any) => {
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

  fetchLayout(page: any, limit: any) {
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
    this.service.getLayoutByPage(page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.layouts = res?.result
        this.count = this.layouts.length
        for (let data of this.layouts) {
          const today = new Date().toISOString()
          if (data.validTo > today) {
            data.isEditable = true
          } else {
            data.isEditable = false
          }
          data.validFrom = new Date(data.validFrom).toDateString()
          data.validTo = new Date(data.validTo).toDateString()
        }
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
