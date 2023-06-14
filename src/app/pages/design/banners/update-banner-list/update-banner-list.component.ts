import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-banner-list',
  templateUrl: './update-banner-list.component.html',
  styleUrls: ['./update-banner-list.component.scss']
})

export class UpdateBannerListComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  form: FormGroup
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
  base: string;

  isGrid: boolean = false
  categories: any = []
  products: any = []
  collections: any = []

  collection: any
  product: any
  category: any
  redirection: {};
  bannerType: any;

  aspectRatioWebWidth: any = 2
  aspectRatioWebHeight: any = 1
  aspectRatioMobileWidth: any = 6
  aspectRatioMobileHeight: any = 3

  previousBanners: any = []
  bannerMedia: any = []

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private CollectionService: CollectionService,
    private CategoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.slug = this.route.snapshot.queryParams.banner || ''
    this.getBanner()
    this.initForm()
    this.managePage()

    this.CollectionService.getActiveCollection().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.collections = res?.result
        this.cdr.markForCheck()
      }
    })

    this.productService.getActiveProduct().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result
        this.cdr.markForCheck()
      }
    })

    this.CategoryService.getActiveCategory().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result
        this.cdr.markForCheck()
      }
    })
  }

  getBannerType(type: any) {
    this.bannerType = type
  }

  getBanner() {
    this.bannerService.getBanner(this.slug).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.bannerData = res?.result[0]
        this.form.get("title")?.setValue(res?.result[0].title)
        this.form.get("validFrom")?.setValue(res?.result[0].validFrom)
        this.form.get("validTo")?.setValue(res?.result[0].validTo)
        this.form.get("isActive")?.setValue(res?.result[0].isActive)
        this.fromDate = new Date(this.bannerData.validFrom).toISOString().split('T')[0];
        this.lastDate = new Date(this.bannerData.validTo).toISOString().split('T')[0];
        this.category = res?.result[0]?.redirection?.category ? res?.result[0]?.redirection?.category : null
        this.product = res?.result[0]?.redirection?.product ? res?.result[0]?.redirection?.product : null
        this.collection = res?.result[0]?.redirection?.collection ? res?.result[0]?.redirection?.collection : null
        this.form.get('validFrom')?.setValue(this.fromDate);
        this.form.get('validTo')?.setValue(this.lastDate);
        const today = new Date().toISOString()
        if (today > this.bannerData?.validFrom) {
          this.validBanner = true
          this.form.get('validFrom')?.disable()
        }
        this.form.get('type')?.setValue(res?.result[0]?.type)
        this.cdr.markForCheck()
      }
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
    this.form = this.formBuilder.group({
      title: [''],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      type: ['', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get hf() {
    return this.form.controls;
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

  onSubmit() {
    if (!this.form.valid) {
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
      title: this.form.get('title')?.value,
      validFrom: this.form.get('validFrom')?.value,
      redirectionUrl: this.form.get('redirectURL')?.value,
      isActive: this.form.get('isActive')?.value,
      validTo: this.form.get('validTo')?.value,
      redirection: {
        unit: '',
        category: this.category ? this.category : '',
        collection: this.collection ? this.collection : '',
        product: this.product ? this.product : '',
        external: this.form.get('redirectURL')?.value
      },
      file: this.bannerMedia,
      bannerid: this.slug
    }

    if (this.web_file != '' && this.mobile_file != '') {
      return data
    } else {
      this.toastr.info('Banner image is being processed')
    }
  }
}
