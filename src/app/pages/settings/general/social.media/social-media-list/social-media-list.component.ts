import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { SocialMediaService } from 'src/app/includes/services/social.media.service';

@Component({
  selector: 'app-social-media-list',
  templateUrl: './social-media-list.component.html',
  styleUrls: ['./social-media-list.component.scss']
})
export class SocialMediaListComponent implements OnInit {
  appRoute = appRoutes
  socialMediaForm: FormGroup
  socialMediaData: any
  task = PageTasks.ADD;
  editMode: boolean;
  isSubmitted: boolean;
  currentData: any

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
    this.getSocialMedia()
  }
  getSocialMedia() {
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

  resetAll() {
    this.socialMediaForm.get("facebook")?.setValue('')
    this.socialMediaForm.get("whatsapp")?.setValue('')
    this.socialMediaForm.get("instagram")?.setValue('')
    this.socialMediaForm.get("linkedin")?.setValue('')
    this.socialMediaForm.get("youtube")?.setValue('')
    this.socialMediaForm.get("twitter")?.setValue('')
    this.socialMediaForm.get("behance")?.setValue('')
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
    if (!this.socialMediaForm.valid) {
      return;
    }
  }

}
