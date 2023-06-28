import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProductService } from 'src/app/includes/services/product.service';
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
  form: FormGroup
  isSubmitted = false;
  fileData: File;
  uploadedImg: boolean;
  bannerFile: File;
  mobileBannerFile: File;
  images: any = []

  imageWebChangedEvent: any = '';
  imageMobileChangedEvent: any = '';
  croppedImage: any = '';

  to_date: string;
  from_date: string;

  aspectRatioWebWidth: any = 2
  aspectRatioWebHeight: any = 1
  webWidth: any = 2000
  webHeight: any = 1000

  aspectRatioMobileWidth: any = 6
  aspectRatioMobileHeight: any = 3
  mobileWidth: any = 1500
  mobileHeight: any = 750

  previousBanners: any = []


  isGrid: Boolean = false
  files: Array<any> = []
  bannerType: any;
  products: Array<any> = []
  product: string = ''
  categories: Array<any> = []
  category: string = ''
  external: FormControl = new FormControl('');
  count: FormControl = new FormControl('1', [Validators.min(1), Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')])
  redirectionType: string = ''
  file: any
  name: String = ''
  isImage: Boolean = false
  isCarousel: Boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private ProductService: ProductService,
    private CategoryService: CategoryService
  ) { }

  ngOnInit(): void {
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]
    this.initForm()
    this.managePage()

    this.ProductService.getActiveProduct().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result
      }
    })

    this.CategoryService.getActiveCategory().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: [''],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirection: [''],
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
    if (this.bannerType == 4) {
      this.isGrid = true
      this.isCarousel = false
    } else if (this.bannerType == 1) {
      this.isGrid = false
      this.isCarousel = true
    } else {
      this.isGrid = false
      this.isCarousel = false
    }
  }

  getRedirectionType(event: any) {
    this.redirectionType = event?.value
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
    }
  }

  handleInputChange(event: any, key: any) {
    this.name = event?.target?.files[0]?.name
    this.imageWebChangedEvent = event;
    this.isImage = true
  }

  addBanner() {
    if (this.bannerType == '1') {
      if (this.files.length < this.count?.value) {
        this.addFiles()
      } else {
        this.toastr.error('Maximum ' + this.count?.value + ' files are allowed')
      }
    } else {
      if (this.files.length < this.bannerType) {
        this.addFiles()
      } else {
        this.toastr.error('Maximum ' + this.bannerType + ' files are allowed')
      }
    }

    this.clearFiles()
  }

  addFiles() {
    let data = {
      file: this.file,
      name: this.name,
      redirection: { type: this.redirectionType, url: '' }
    }
    if (this.redirectionType == 'product') data.redirection.url = this.product
    if (this.redirectionType == 'category') data.redirection.url = this.category
    if (this.redirectionType == 'external') data.redirection.url = this.external?.value
    this.files.push(data)
  }

  removeBanner(name: any) {
    this.files = this.files.filter((item: any) => item?.name != name)
  }

  clearFiles() {
    this.file = null
    this.name = ''
  }

  imageCroppedWeb(event: ImageCroppedEvent) {
    this.file = event.base64;
  }

  imageWebLoaded() {
  }

  cropperWebReady() {
  }

  loadImageWebFailed() {
  }

  onSubmit() {
    if (!this.form.valid) {
      this.toastr.error('Form validation failed')
      return;
    }

    const payload = this.createPayload()

    console.log(payload);

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
    let data = {
      type: this.bannerType,
      title: this.form.get('title')?.value,
      validFrom: this.form.get('validFrom')?.value,
      validTo: this.form.get('validTo')?.value,
      isActive: this.form.get('isActive')?.value,
      files: this.files
    }

    if (this.bannerType == '1') {
      if (this.files.length == this.count?.value) {
        return data
      } else {
        this.toastr.error("Can't proceed with banner creation, please add all the required files")
        return false
      }
    } else {
      if (this.files.length == this.bannerType) {
        return data
      } else {
        this.toastr.error("Can't proceed with banner creation, please add all the required files")
        return false
      }
    }
  }
}