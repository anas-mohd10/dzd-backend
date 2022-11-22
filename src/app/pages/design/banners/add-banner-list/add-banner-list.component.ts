import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ProductService } from 'src/app/includes/services/product.service';
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
  bannerForm: FormGroup
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

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]

    this.initForm()
    this.managePage()
    this.getProduct()
  }

  initForm() {
    this.bannerForm = this.formBuilder.group({
      title: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      isActive: ['true', Validators.required],
    });
    this.bannerForm.get('validFrom')?.setValue(this.from_date)
    this.bannerForm.get('validTo')?.setValue(this.to_date)
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

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result
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

  createPayload() {
    const data = {
      title: this.bannerForm.get('title')?.value,
      validFrom: this.bannerForm.get('validFrom')?.value,
      isActive: this.bannerForm.get('isActive')?.value,
      redirectionUrl: this.bannerForm.get('redirectURL')?.value,
      validTo: this.bannerForm.get('validTo')?.value,
      w_file: this.web_file,
      w_name: this.w_name,
      m_file: this.mobile_file,
      m_name: this.m_name
    }

    return data
  }
}
