import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { SocialMediaService } from 'src/app/includes/services/social.media.service';

@Component({
  selector: 'app-add-social-nedia',
  templateUrl: './add-social-nedia.component.html',
  styleUrls: ['./add-social-nedia.component.scss']
})
export class AddSocialNediaComponent implements OnInit {
  task = PageTasks.ADD;
  editMode: boolean;
  isSubmitted: boolean;
  appRoute = appRoutes
  socialMediaForm: FormGroup

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

  updateSocialMediaLinks() {
  }

  addSocialMediaLinks() {
    this.socialMediaService.addSocialMediaLinks(this.socialMediaForm.value).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.socialMedia.SOCIAL_MEDIA_LIST]);
      }
    })
  }
}
