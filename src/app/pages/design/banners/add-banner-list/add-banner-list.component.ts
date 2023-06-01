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
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]

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

    this.initForm()
    this.managePage()
  }

  initForm() {
    this.bannerForm = this.formBuilder.group({
      title: [''],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      isActive: ['true', Validators.required],
      type: ["1", Validators.required]
    });
    this.bannerForm.get('validFrom')?.setValue(this.from_date)
    this.bannerForm.get('validTo')?.setValue(this.to_date)
  }

  get hf() {
    return this.bannerForm.controls;
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

  addBanner() {
    let length = this.bannerMedia.length
    if (length < this.bannerType) {
      this.addFiles()
    } else {
      this.toastr.error('Maximum ' + this.bannerType + ' files are allowed')
    }
    this.clearFiles()

    console.log(this.bannerMedia);
  }

  addFiles() {
    this.bannerMedia.push({
      web: { file: this.web_file, name: this.w_name },
      mobile: { file: this.mobile_file, name: this.m_name },
      redirection: {
        unit: '',
        category: this.category ? this.category : '',
        collection: this.collection ? this.collection : '',
        product: this.product ? this.product : '',
        external: this.bannerForm.get('redirectURL')?.value
      },
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
    if (!this.bannerForm.valid) {
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
      type: this.bannerForm.get('type')?.value,
      title: this.bannerForm.get('title')?.value,
      validFrom: this.bannerForm.get('validFrom')?.value,
      validTo: this.bannerForm.get('validTo')?.value,
      isActive: this.bannerForm.get('isActive')?.value,
      redirection: {
        unit: '',
        category: this.category ? this.category : '',
        collection: this.collection ? this.collection : '',
        product: this.product ? this.product : '',
        external: this.bannerForm.get('redirectURL')?.value
      },
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