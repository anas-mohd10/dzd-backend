import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-update-banner-list',
  templateUrl: './update-banner-list.component.html',
  styleUrls: ['./update-banner-list.component.scss']
})

export class UpdateBannerListComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  bannerForm: FormGroup
  slug: any = ''
  bannerData: any
  productsData: any;
  images: any = [];
  eImages: any = [] //Exsisting images
  isSubmitted = false;
  imageWebChangedEvent: any = '';
  imageMobileChangedEvent: any = '';
  croppedImage: any = '';

  webLoadImage: boolean = false;
  mobileLoadImage: boolean = false

  w_file: any
  m_file: any

  w_name: any
  m_name: any

  web_file: any
  mobile_file: any
  fromDate: string;
  lastDate: string;
  validBanner: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.queryParams.banner || ''
    this.getBanner()
    this.initForm()
    this.managePage()
  }

  getBanner() {
    this.bannerService.getBanner(this.slug).subscribe((res: any) => {
      this.bannerData = res?.result[0]
      this.bannerForm.get("title")?.setValue(res?.result[0].title)
      this.bannerForm.get("validFrom")?.setValue(res?.result[0].validFrom)
      this.bannerForm.get("validTo")?.setValue(res?.result[0].validTo)
      this.bannerForm.get("isActive")?.setValue(res?.result[0].isActive)
      this.bannerForm.get("redirectURL")?.setValue(res?.result[0].redirectionUrl)

      this.fromDate = new Date(this.bannerData.validFrom).toISOString().split('T')[0];
      this.lastDate = new Date(this.bannerData.validTo).toISOString().split('T')[0];

      this.bannerForm.get('validFrom')?.setValue(this.fromDate);
      this.bannerForm.get('validTo')?.setValue(this.lastDate);

      const today = new Date().toISOString()
      if (today > this.bannerData?.validFrom) {
        this.validBanner = true
        this.bannerForm.get('validFrom')?.disable()
      }

      this.web_file = this.bannerData?.w_file
      this.mobile_file = this.bannerData?.m_file
      this.cdr.markForCheck()
    })
  }

  handleInputChange(event: any, key: any) {
    if (key === 'web') {
      this.w_file = event.target.files[0]
      this.w_name = this.w_file.name
      this.imageWebChangedEvent = event;
      this.webLoadImage = true
    } else if (key === 'mobile') {
      this.m_file = event.target.files[0]
      this.m_name = this.m_file.name
      this.imageMobileChangedEvent = event;
      this.mobileLoadImage = true
    }
  }

  initForm() {
    this.bannerForm = this.formBuilder.group({
      title: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      isActive: ['true', Validators.required],
    });
  }

  get hf() {
    return this.bannerForm.controls;
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

  imageCroppedWeb(event: ImageCroppedEvent) {
    this.web_file = event.base64;
  }

  imageCroppedMobile(event: ImageCroppedEvent) {
    this.mobile_file = event.base64;
  }

  imageWebLoaded() {
    // show cropper
  }

  cropperWebReady() {
    // cropper ready
  }

  loadImageWebFailed() {
    // show message
  }

  imageMobileLoaded() {
    // show cropper
  }

  cropperMobileReady() {
    // cropper ready
  }

  loadImageMobileFailed() {
    // show message
  }

  removeImage(key: any) {
    this.croppedImage = ''
    if (key === 'web') {
      this.webLoadImage = false
    } else if (key === 'mobile') {
      this.mobileLoadImage = false
    }
  }

  onSubmit() {
    if (!this.bannerForm.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.bannerService.updateBanner(this.slug, payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Banner updated successfully');
          this.router.navigate([this.appRoute.banner.BANNER_LIST]);
        }
      })
    }
  }

  createPayload() {
    const data = {
      title: this.bannerForm.get('title')?.value,
      validFrom: this.bannerForm.get('validFrom')?.value,
      redirectionUrl: this.bannerForm.get('redirectURL')?.value,
      isActive: this.bannerForm.get('isActive')?.value,
      validTo: this.bannerForm.get('validTo')?.value,
      w_file: this.web_file,
      w_name: this.w_name,
      m_file: this.mobile_file,
      m_name: this.m_name,
      bannerid: this.slug
    }
    return data
  }
}
