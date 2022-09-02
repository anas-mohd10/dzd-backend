import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { SocialMediaService } from 'src/app/includes/services/social.media.service';

@Component({
  selector: 'app-update-social-nedia',
  templateUrl: './update-social-nedia.component.html',
  styleUrls: ['./update-social-nedia.component.scss']
})
export class UpdateSocialNediaComponent implements OnInit {
  appRoute = appRoutes
  socialMediaData: any
  task = PageTasks.UPDATE;
  editMode: boolean;
  isSubmitted: boolean;
  socialMediaForm: FormGroup
  slug: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private socialMediaService: SocialMediaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.managePage()
    this.initForm()
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.slug = this.route.snapshot.queryParams.slug || ''
    this.getSocialMediaLinks()
  }

  getSocialMediaLinks() {
    this.socialMediaService.getSocialMediaLinksBySlug(this.slug).subscribe((res: any) => {
      this.socialMediaData = res?.result[0]
      this.socialMediaForm.get("facebook")?.setValue(res?.result[0]?.facebook)
      this.socialMediaForm.get("instagram")?.setValue(res?.result[0]?.instagram)
      this.socialMediaForm.get("linkedin")?.setValue(res?.result[0]?.linkedin)
      this.socialMediaForm.get("twitter")?.setValue(res?.result[0]?.twitter)
      this.socialMediaForm.get("youtube")?.setValue(res?.result[0]?.youtube)
      this.socialMediaForm.get("behance")?.setValue(res?.result[0]?.behance)
      this.socialMediaForm.get("whatsapp")?.setValue(res?.result[0]?.whatsapp)
    })
  }

  get smf() {
    return this.socialMediaForm.controls;
  }

  initForm() {
    this.socialMediaForm = this.formBuilder.group({
      facebook: [''],
      whatsapp: [''],
      instagram: [''],
      linkedin: [''],
      youtube: [''],
      twitter: [''],
      behance: [''],
    });
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateSocialMediaLinks();
    } else {
      this.addSocialMediaLinks();
    }
  }

  addSocialMediaLinks() {
  }

  updateSocialMediaLinks() {
    if (!this.socialMediaForm.valid) {
      return;
    }

    this.socialMediaService.updateSocialMediaLink(this.slug, this.socialMediaForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Social media updated successfully');
        this.router.navigate([this.appRoute.socialMedia.SOCIAL_MEDIA_LIST]);
      }
    })
  }

}
