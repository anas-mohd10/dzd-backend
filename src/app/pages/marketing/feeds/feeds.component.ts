import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { feedEndpoints } from 'src/app/config/endpoints';
import { appRoutes } from 'src/app/config/routes';
import { FeedService } from 'src/app/includes/services/feed.service';
import { environment } from 'src/environments/environment.prod';
import { ClipboardService } from 'ngx-clipboard';

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
  exportGoogleFeed: string = environment.apiUrl + feedEndpoints.export_feed + "?type=google"
  exportFacebookXmlFeed: string = environment.apiUrl + feedEndpoints.export_feed + "?type=facebook&format=xml"
  exportFacebookCsvFeed: string = environment.apiUrl + feedEndpoints.export_feed + "?type=facebook&format=csv"

  constructor(
    private FeedService: FeedService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private ClipboardService: ClipboardService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      isGoogleFeed: new FormControl('false'),
      isFacebookFeed: new FormControl('false'),
      googleFeedUrl: new FormControl(this.exportGoogleFeed),
      facebookXmlFeedUrl: new FormControl(this.exportFacebookXmlFeed),
      facebookCsvFeedUrl: new FormControl(this.exportFacebookCsvFeed),
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
    this.ToastrService.success("Copied to clipboard")
  }

  manageFeedDetails() {
    this.FeedService.manageFeed(this.form.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ngOnInit()
        this.ToastrService.success(res?.message)
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }

}
