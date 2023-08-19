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
  isSubmitted = false;
  imageWebChangedEvent: any = '';
  to_date: string = '';
  from_date: string = '';
  fullWidth: Boolean = false
  halfWidth: Boolean = false
  thirdWidth: Boolean = false
  quarterWidth: Boolean = false
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
  base: string = ''
  slug: string = ''
  bannerData: any = {}
  validBanner: Boolean = false
  fromDate: string = ''
  lastDate: string = ''
  heightConstraint: FormControl = new FormControl('1')
  isHeightConstraint: string = '1'
  title: FormControl = new FormControl('')
  startDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private CategoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.slug = this.route.snapshot.queryParams.banner || ''
    this.getBanner()
    this.initForm()
    this.managePage()

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
      if (res?.errorCode == 0) {
        this.bannerData = res?.result[0]
        this.form.get("title")?.setValue(res?.result[0].title)
        this.form.get("validFrom")?.setValue(res?.result[0].validFrom)
        this.form.get("validTo")?.setValue(res?.result[0].validTo)
        this.form.get("isActive")?.setValue(res?.result[0].isActive)
        this.fromDate = new Date(this.bannerData.validFrom).toISOString().split('T')[0];
        this.lastDate = new Date(this.bannerData.validTo).toISOString().split('T')[0];
        this.form.get('validFrom')?.setValue(this.fromDate);
        this.form.get('validTo')?.setValue(this.lastDate);
        const today = new Date().toISOString()
        if (today > this.bannerData?.validFrom) {
          this.validBanner = true
          this.form.get('validFrom')?.disable()
        }

        this.bannerType = res?.result[0].type
        this.form.get('type')?.setValue(this.bannerType)
        if (this.bannerType == '1') this.isCarousel = true
        this.count.setValue(res?.result[0].count)
        for (let file of this.bannerData?.files) {
          this.files.push({
            file: this.base + "/" + file?.file,
            name: null,
            mobileFile: this.base + "/" + file?.mobileFile,
            title: file?.title,
            redirection: file?.redirection
          })
        }

        switch (this.bannerType) {
          case '1':
            this.quarterWidth = false
            this.fullWidth = true
            this.halfWidth = false
            this.thirdWidth = false
            break
          case '2':
            this.quarterWidth = false
            this.fullWidth = false
            this.halfWidth = true
            this.thirdWidth = false
            break
          case '3':
            this.quarterWidth = false
            this.fullWidth = false
            this.halfWidth = false
            this.thirdWidth = true
            break
          case '4':
            this.quarterWidth = true
            this.fullWidth = false
            this.halfWidth = false
            this.thirdWidth = false
            break
        }

        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: [''],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirection: [''],
      isActive: ['true', Validators.required],
      type: [''],
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
      this.quarterWidth = true
      this.fullWidth = false
      this.halfWidth = false
      this.thirdWidth = false

      this.isCarousel = false
    } else if (this.bannerType == 1) {
      this.quarterWidth = false
      this.fullWidth = true
      this.halfWidth = false
      this.thirdWidth = false

      this.isCarousel = true
    } else if (this.bannerType == 3) {
      this.quarterWidth = false
      this.fullWidth = false
      this.halfWidth = false
      this.thirdWidth = true

      this.isCarousel = false
    } else if (this.bannerType == 2) {
      this.quarterWidth = false
      this.fullWidth = false
      this.halfWidth = true
      this.thirdWidth = false

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

  getHeightConstraint() {
    if (this.heightConstraint?.value == '1') {
      this.isHeightConstraint = '1'
    } else if (this.heightConstraint?.value == '2') {
      this.isHeightConstraint = '2'
    }
  }

  handleInputChange(event: any, key: any) {
    switch (key) {
      case 'crop':
        this.name = event?.target?.files[0]?.name
        this.imageWebChangedEvent = event;
        break
      case 'custom':
        let file = event?.target?.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          this.file = reader.result as string
        }
        reader.readAsDataURL(file);
        this.name = event?.target?.files[0]?.name
        break
    }
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
      title: this.title?.value,
      redirection: { type: this.redirectionType, url: '' }
    }
    if (this.redirectionType == 'product') data.redirection.url = this.product
    if (this.redirectionType == 'category') data.redirection.url = this.category
    if (this.redirectionType == 'external') data.redirection.url = this.external?.value
    this.files.push(data)
  }

  removeBanner(name: any) {
    this.files = this.files.filter((item: any) => item?.file != name)
  }

  editBanner(banner: any) {

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
      this.isSubmitted = true;
      this.toastr.error('Form validation failed')
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.bannerService.updateBanner(payload).subscribe((res: any) => {
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
      files: this.files,
      bannerid: this.bannerData?.bannerid
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
