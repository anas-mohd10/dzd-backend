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
  form: FormGroup
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
    this.socialMediaService.getSocialMediaLinks().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        if(res?.result) for (let _key of Object.keys(res?.result)) this.form.get(_key)?.setValue(res?.result[_key])
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      facebook: [''],
      whatsapp: [''],
      instagram: [''],
      linkedin: [''],
      youtube: [''],
      twitter: [''],
      behance: [''],
      appStore: [''],
      googlePlay: [''],
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
    this.socialMediaService.addSocialMediaLinks(this.form.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.socialMedia.SOCIAL_MEDIA_LIST]);
      }
    })
  }

}
