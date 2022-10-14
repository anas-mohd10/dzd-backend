import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  bannersData: any
  displayTable: boolean;
  base: string;

  constructor(
    private bannerService: BannerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    }
    this.getBanners()
  }

  getBanners() {
    this.bannerService.getBanners().subscribe((res: any) => {
      this.bannersData = res?.result
      this.cdr.markForCheck()
      for (let banner of this.bannersData) {
        banner.validFrom = new Date(banner.validFrom).toDateString()
        banner.validTo = new Date(banner.validTo).toDateString()
      }
      this.displayTable = true;
    })
  }

}
