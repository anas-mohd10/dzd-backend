import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { sitemapEndpoints } from 'src/app/config/endpoints';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sitemap-settings',
  templateUrl: './sitemap-settings.component.html',
  styleUrls: ['./sitemap-settings.component.scss']
})
export class SitemapSettingsComponent implements OnInit {
  appRoute = appRoutes;
  settings: any = {};
  domainUrl: string = ''

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private HttpClient: HttpClient,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.domainUrl = res?.result?.domain.endsWith('/') ? res?.result?.domain : res?.result?.domain + '/'
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  refreshSitemap() {
    this.HttpClient.get(`${environment.apiUrl}${sitemapEndpoints.generateSitemap}`).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res.message || 'Sitemap refreshed successfully')
        } else { 
          this.HotToastService.error(res.message || 'Something went wrong')
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message || 'Something went wrong')
       }
    })
  }
}
