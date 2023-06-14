import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-banner-list',
  templateUrl: './add-banner-list.component.html',
  styleUrls: ['./add-banner-list.component.scss']
})
export class AddBannerListComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  form: FormGroup
  isSubmitted = false;
  productsData: any;
  fileData: File;
  uploadedImg: boolean;
  bannerFile: File;
  mobileBannerFile: File;
  images: any = []

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
  to_date: string;
  from_date: string;

  isGrid: boolean = false
  categories: any = []
  products: any = []
  collections: any = []

  collection: any
  product: any
  category: any
  redirection: {};

  aspectRatioWebWidth: any = 2
  aspectRatioWebHeight: any = 1
  webWidth: any = 2000
  webHeight: any = 1000

  aspectRatioMobileWidth: any = 6
  aspectRatioMobileHeight: any = 3
  mobileWidth: any = 1500
  mobileHeight: any = 750

  previousBanners: any = []
  bannerMedia: any = []
  bannerType: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]
    this.initForm()
    this.managePage()
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: [''],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      isActive: ['true', Validators.required]
    });

    this.form.get('validFrom')?.setValue(this.from_date)
    this.form.get('validTo')?.setValue(this.to_date)
  }

  get hf() {
    return this.form.controls;
  }

  getBannerType(type: any) {
    this.bannerType = type
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

  addBanner() {
    let length = this.bannerMedia.length
    if (length < this.bannerType) {
      this.addFiles()
    } else {
      this.toastr.error('Maximum ' + this.bannerType + ' files are allowed')
    }
    this.clearFiles()
  }

  addFiles() {
    this.bannerMedia.push({
      web: { file: this.web_file, name: this.w_name },
      mobile: { file: this.mobile_file, name: this.m_name }
    })
  }

  clearFiles() {
    this.web_file = null
    this.mobile_file = null
    this.w_name = null
    this.m_name = null
    this.w_file = null
    this.m_file = null
  }

  imageCroppedWeb(event: ImageCroppedEvent) {
    this.web_file = event.base64;
  }

  imageCroppedMobile(event: ImageCroppedEvent) {
    this.mobile_file = event.base64;
  }

  imageWebLoaded() {
  }

  cropperWebReady() {
  }

  loadImageWebFailed() {
  }

  imageMobileLoaded() {
  }

  cropperMobileReady() {
  }

  loadImageMobileFailed() {
  }

  onSubmit() {
    if (!this.form.valid) {
      this.toastr.error('Invalid form')
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.bannerService.addBaner(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.banner.BANNER_LIST]);
        }
      })
    }
  }

  checkFileLength() {
    if (this.bannerMedia.length == this.bannerType) {
      return true
    } else {
      return false
    }
  }

  createPayload() {
    const data = {
      type: this.bannerType,
      title: this.form.get('title')?.value,
      validFrom: this.form.get('validFrom')?.value,
      validTo: this.form.get('validTo')?.value,
      isActive: this.form.get('isActive')?.value,
      file: this.bannerMedia
    }

    let isValidFile = this.checkFileLength()
    if (isValidFile) {
      return data
    } else {
      this.toastr.error('Invalid file length')
    }
  }
}