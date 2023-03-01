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
  base: string;

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

  getBanner() {
    this.bannerService.getBanner(this.slug).subscribe((res: any) => {
      this.bannerData = res?.result[0]
      this.bannerForm.get("title")?.setValue(res?.result[0].title)
      this.bannerForm.get("validFrom")?.setValue(res?.result[0].validFrom)
      this.bannerForm.get("validTo")?.setValue(res?.result[0].validTo)
      this.bannerForm.get("type")?.setValue(res?.result[0].type)
      this.bannerForm.get("isActive")?.setValue(res?.result[0].isActive)
      this.bannerForm.get("redirectURL")?.setValue(res?.result[0].redirection?.external)

      this.fromDate = new Date(this.bannerData.validFrom).toISOString().split('T')[0];
      this.lastDate = new Date(this.bannerData.validTo).toISOString().split('T')[0];

      this.category = res?.result[0]?.redirection?.category ? res?.result[0]?.redirection?.category : null
      this.product = res?.result[0]?.redirection?.product ? res?.result[0]?.redirection?.product : null
      this.collection = res?.result[0]?.redirection?.collection ? res?.result[0]?.redirection?.collection : null

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
      title: [''],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      type: ["1", Validators.required],
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

  redirectionValidation(type: any) {
    if (type == 'category') {
      this.product = null
      this.bannerForm.get('redirectURL')?.setValue('')
      this.collection = null

      this.redirection = {
        type: type,
        category: this.category
      }
    } else if (type == 'collection') {
      this.product = null
      this.bannerForm.get('redirectURL')?.setValue('')
      this.category = null

      this.redirection = {
        type: type,
        collection: this.collection
      }
    } else if (type == 'product') {
      this.bannerForm.get('redirectURL')?.setValue('')
      this.category = null
      this.collection = null

      this.redirection = {
        type: type,
        product: this.product
      }
    } else {
      this.product = null
      this.category = null
      this.collection = null

      this.redirection = {
        type: type,
        external: this.bannerForm.get('redirectURL')?.value
      }
    }
  }

  addBanner() {
    const type = this.bannerForm.get('type')?.value
    if (type == "1") {
      if (this.bannerMedia.length < 1) {
        const prevLen = this.bannerMedia.length
        this.bannerMedia.push({ w_file: this.web_file, w_name: this.w_name, m_file: this.mobile_file, m_name: this.m_name })
        const newlen = this.bannerMedia.length
        if ((prevLen + 1) == newlen) {
          this.web_file = null
          this.w_name = null
          this.mobile_file = null
          this.m_name = null
        }
      } else {
        this.toastr.info('Maximum banner limit reached')
      }
    } else if (type == "2") {
      if (this.bannerMedia.length < 2) {
        const prevLen = this.bannerMedia.length
        this.bannerMedia.push({ w_file: this.web_file, w_name: this.w_name, m_file: this.mobile_file, m_name: this.m_name })
        const newlen = this.bannerMedia.length
        if ((prevLen + 1) == newlen) {
          this.web_file = null
          this.w_name = null
          this.mobile_file = null
          this.m_name = null
        }
      } else {
        this.toastr.info('Maximum banner limit reached')
      }
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
      redirection: {
        unit: '',
        category: this.category ? this.category : '',
        collection: this.collection ? this.collection : '',
        product: this.product ? this.product : '',
        external: this.bannerForm.get('redirectURL')?.value
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
