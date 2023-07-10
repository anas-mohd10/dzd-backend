import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { SocialMediaService } from 'src/app/includes/services/social.media.service';

@Component({
  selector: 'app-social-media-list',
  templateUrl: './social-media-list.component.html',
  styleUrls: ['./social-media-list.component.scss']
})
export class SocialMediaListComponent implements OnInit {
  appRoute = appRoutes
  data: any
  isData = false

  constructor(
    private SocialMediaService: SocialMediaService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.SocialMediaService.getSocialMediaLinks().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        if (res?.result) {
          this.data = res?.result
          this.isData = true
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }
}
