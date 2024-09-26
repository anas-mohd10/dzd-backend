import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { feedEndpoints } from 'src/app/config/endpoints';
import { appRoutes } from 'src/app/config/routes';
import { FeedService } from 'src/app/includes/services/feed.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {
  appRoute = appRoutes
  environment = environment
  feedEndpoints = feedEndpoints
  form!: FormGroup
  feedDetails: any = {}
  exportGoogleFeed: string = ''
  exportFacebookXmlFeed: string = ''
  exportFacebookCsvFeed: string = ''

  constructor(
    private FeedService: FeedService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private ClipboardService: ClipboardService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      isGoogleFeed: new FormControl('false'),
      isFacebookFeed: new FormControl('false'),
      googleFeedUrl: new FormControl(this.exportGoogleFeed),
      facebookXmlFeedUrl: new FormControl(this.exportFacebookXmlFeed),
      facebookCsvFeedUrl: new FormControl(this.exportFacebookCsvFeed),
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (response: any) => {
        if(response?.errorCode == 0) {
          this.exportGoogleFeed = response?.result?.domainUrl + 'api/v1/w/admin/auth' +  feedEndpoints.export_feed + "?type=google"
          this.exportFacebookXmlFeed = response?.result?.domainUrl + 'api/v1/w/admin/auth' + feedEndpoints.export_feed + "?type=facebook&format=xml"
          this.exportFacebookCsvFeed = response?.result?.domainUrl + 'api/v1/w/admin/auth' + feedEndpoints.export_feed + "?type=facebook&format=csv"
          this.form.patchValue({
            googleFeedUrl: this.exportGoogleFeed,
            facebookXmlFeedUrl: this.exportFacebookXmlFeed,
            facebookCsvFeedUrl: this.exportFacebookCsvFeed
          })
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.FeedService.getFeedDetails().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.feedDetails = res?.result
        if (this.feedDetails) for (let _key of Object.keys(this.feedDetails)) this.form.get(_key)?.setValue(this.feedDetails[_key])
        this.ChangeDetectorRef.detectChanges()
      }
    })
  }

  copyToClipboard(type: any) {
    switch (type) {
      case 'google':
        this.ClipboardService.copyFromContent(this.exportGoogleFeed);
        break
      case 'facebook-csv':
        this.ClipboardService.copyFromContent(this.exportFacebookCsvFeed);
        break
      case 'facebook-xml':
        this.ClipboardService.copyFromContent(this.exportFacebookXmlFeed);
        break
    }
    this.HotToastService.success("Copied to clipboard")
  }

  manageFeedDetails() {
    this.FeedService.manageFeed(this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ngOnInit()
        this.HotToastService.success(res?.message)
      } else {
        this.HotToastService.error(res?.message)
      }
    })
  }

}
