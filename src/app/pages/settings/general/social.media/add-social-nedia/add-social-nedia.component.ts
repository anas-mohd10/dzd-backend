import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { SocialMediaService } from 'src/app/includes/services/social.media.service';

@Component({
  selector: 'app-add-social-nedia',
  templateUrl: './add-social-nedia.component.html',
  styleUrls: ['./add-social-nedia.component.scss']
})
export class AddSocialNediaComponent implements OnInit {
  isSubmitted: boolean;
  appRoute = appRoutes
  form: FormGroup

  constructor(
    private Router: Router,
    private SocialMediaService: SocialMediaService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      facebook: new FormControl(''),
      whatsapp: new FormControl(''),
      instagram: new FormControl(''),
      linkedin: new FormControl(''),
      youtube: new FormControl(''),
      twitter: new FormControl(''),
      behance: new FormControl(''),
      tiktok: new FormControl(''),
      pinterest: new FormControl(''),
      appStore: new FormControl(''),
      googlePlay: new FormControl('')
    });
  }

  onSubmit() {
    this.SocialMediaService.addSocialMediaLinks(this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.socialMedia.SOCIAL_MEDIA_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }
    })
  }
}
