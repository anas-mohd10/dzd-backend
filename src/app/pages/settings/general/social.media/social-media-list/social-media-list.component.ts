import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { SocialMediaService } from 'src/app/includes/services/social.media.service';

@Component({
  selector: 'app-social-media-list',
  templateUrl: './social-media-list.component.html',
  styleUrls: ['./social-media-list.component.scss']
})
export class SocialMediaListComponent implements OnInit {
  appRoute = appRoutes
  socialMediaData: any
  isData = false

  constructor(
    private socialMediaService: SocialMediaService,
  ) { }

  ngOnInit(): void {
    this.getSocialMedia()
  }

  getSocialMedia() {
    this.socialMediaService.getSocialMediaLinks().subscribe((res: any) => {
      this.socialMediaData = res?.result[0]
      if (this.socialMediaData) {
        this.isData = true
      } else {
        this.isData = false
      }
    })
  }
}
