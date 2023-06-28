import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  banners: Array<any> = []
  base: any
  limit: FormControl = new FormControl('20')
  page: number = 1
  title: FormControl = new FormControl('')
  isActive: FormControl = new FormControl('')
  validFrom: FormControl = new FormControl('')
  validTo: FormControl = new FormControl('')
  lastPage: Boolean = false

  constructor(
    private BannerService: BannerService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.getBanners()
  }

  clearFilters() {
    this.title.setValue('')
    this.isActive.setValue('')
    this.validFrom.setValue('')
    this.validTo.setValue('')
    this.page = 1
    this.getBanners()
  }

  getNextPage() {
    this.page += 1
    this.getBanners()
  }

  getPreviousPage() {
    this.page -= 1
    this.getBanners()
  }

  getBanners() {
    let payload = {
      title: this.title.value,
      isActive: this.isActive.value,
      validFrom: this.validFrom.value,
      validTo: this.validTo.value,
      page: this.page,
      limit: this.limit.value
    }

    this.BannerService.searchBanners(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.banners = res?.result?.data

        for (let banner of this.banners) {
          banner.validFrom = new Date(banner.validFrom).toDateString()
          banner.validTo = new Date(banner.validTo).toDateString()
        }

        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
