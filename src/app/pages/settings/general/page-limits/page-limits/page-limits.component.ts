import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { PageLimitsService } from 'src/app/includes/services/page.limits.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-page-limits',
  templateUrl: './page-limits.component.html',
  styleUrls: ['./page-limits.component.scss']
})
export class PageLimitsComponent implements OnInit {
  appRoute = appRoutes
  pagelimits: any = []
  pagelimitscount: any
  slug: any
  len: any
  base: any

  constructor(
    private cdr: ChangeDetectorRef,
    private PageLimitsService: PageLimitsService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    
    this.PageLimitsService.getPageLimits().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.pagelimits = res?.result
        this.len = this.pagelimits.length
        this.slug = this.pagelimits[0].slug
        this.cdr.markForCheck()
      }
    })

    this.PageLimitsService.getPageLimitsCount().subscribe((res: any) => {
      this.cdr.markForCheck()
      if (res?.result) {
        this.pagelimitscount = res?.result
      } else {
        this.pagelimitscount = 0
      }
    })
  }

}
