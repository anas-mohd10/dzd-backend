import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProductService } from 'src/app/includes/services/product.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

interface Media {
  title: string;
  _id: string;
  size: string;
  path: string;
  slug: string;
  tag: string;
  type: string;
  uploadedBy: string;
  uploadedDescription: string;
  uploadedTo: string;
  createdAt: string;
}

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
  imageWebChangedEvent: any = '';
  toDate: string = '';
  fromDate: string = '';
  fullWidth: Boolean = false
  halfWidth: Boolean = false
  thirdWidth: Boolean = false
  quarterWidth: Boolean = false
  // files: Array<any> = []
  bannerType: any;
  products: Array<any> = []
  product: string = ''
  categories: Array<any> = []
  category: string = ''
  external: FormControl = new FormControl('');
  heightConstraint: FormControl = new FormControl('1')
  count: FormControl = new FormControl('1', [Validators.min(1), Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')])
  redirectionType: string = ''
  title: FormControl = new FormControl('')
  file: any
  name: String = ''
  isImage: Boolean = false
  isCarousel: Boolean = false
  isHeightConstraint: string = '1'
  startDate: string = new Date().toISOString().split('T')[0];
  modalRef?: BsModalRef;
  bannerDetails: any

  @ViewChild('detailsTemplate') detailsTemplate: TemplateRef<any>;
  objectFit: string = 'cover'
  details: FormGroup
  files: Array<any> = []
  activeMediaDetails: any

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService,
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    const getDate = new Date().getDate()
    const date = new Date()
    this.fromDate = new Date(date.setDate(getDate + 1)).toISOString().split('T')[0]
    this.toDate = new Date(date.setDate(getDate + 10)).toISOString().split('T')[0]
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
      type: ['', Validators.required],
      slides: ['1'],
      heightConstraint: ['slider', Validators.required],
      isActive: ['true', Validators.required]
    });

    this.details = new FormGroup({
      title: new FormControl(''),
      type: new FormControl(''),
      url: new FormControl(''),
    })

    this.form.get('validFrom')?.setValue(this.fromDate)
    this.form.get('validTo')?.setValue(this.toDate)
  }

  mediaHandler(event: any) {
    this.activeMediaDetails = event
    this.modalRef = this.BsModalService.show(this.detailsTemplate, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  decline() {
    this.activeMediaDetails = null
  }

  confirm() {
    // this.files.length > this.ro
    this.files.push({
      file: this.activeMediaDetails.path,
      title: this.details.get('title')?.value,
      redirection: {
        type: this.details.get('type')?.value,
        url: this.details.get('url')?.value
      }
    })

    this.modalRef?.hide()
    this.activeMediaDetails = null
  }

  // addMediaDetails() {
  //   if (this.form.get("slides")?.value <) {

  //   }
  // }

  constraintHandler() {
    this.form.get("heightConstraint")?.value == 'slider' ? this.objectFit = 'cover' : this.objectFit = ''
  }

  get formControls() {
    return this.form.controls;
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

  getHeightConstraint() {
    if (this.heightConstraint?.value == '1') {
      this.isHeightConstraint = '1'
    } else if (this.heightConstraint?.value == '2') {
      this.isHeightConstraint = '2'
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
      id: this.files.length,
      file: this.file,
      name: this.name,
      title: this.title?.value,
      redirection: { type: this.redirectionType, url: '' }
    }
    if (this.redirectionType == 'product') data.redirection.url = this.product
    if (this.redirectionType == 'category') data.redirection.url = this.category
    if (this.redirectionType == 'external') data.redirection.url = this.external?.value
    this.files.push(data)
    this.isImage = false
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
      this.isSubmitted = true;
      this.toastr.error('Form validation failed')
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

  open(template: TemplateRef<any>, bannerDetails: any) {
    this.bannerDetails = bannerDetails
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  close() {
    this.bannerDetails = null
    this.modalRef?.hide()
  }

  createPayload() {
    let data = {
      type: this.bannerType,
      title: this.form.get('title')?.value,
      validFrom: this.form.get('validFrom')?.value,
      validTo: this.form.get('validTo')?.value,
      isActive: this.form.get('isActive')?.value,
      heightConstraint: this.heightConstraint?.value,
      files: this.files,
      count: this.count?.value
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