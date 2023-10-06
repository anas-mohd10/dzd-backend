import { Component, OnInit, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss'],
})
export class UpdateBrandComponent implements OnInit {
  brandForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  filedata: File;
  slug: any;
  brand: any;
  uploadedimg: any;
  imageChangedEvent: any = '';
  croppedImage: any;
  loadImage: boolean;
  filename: string;
  base: any
  file: any
  img: any;
  //Styling variables
  background: any
  border: any
  color: any
  isArchived: any
  images: any = []

  restore = new FormControl('false');
  bannerFiledata: File;
  bannerFilename: string;
  bannerChangedEvent: any = '';
  loadBanner: boolean = false;
  banner: any;
  croppedBanner: any

  coverModalRef?: BsModalRef;
  mediaModalRef?: BsModalRef;
  existModalRef?: BsModalRef;
  quesModalRef?: BsModalRef;
  @ViewChild('coverModal') coverModal: any;
  @ViewChild('mediaModal') mediaModal: any;
  @ViewChild('existingModal') existingModal: any;
  @ViewChild('quesModal') quesModal: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) {
  }

  get bf() {
    return this.brandForm.controls;
  }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.slug = this.route.snapshot.queryParams.brand || '';
    this.managePage();
    this.getBrand();

    this.brandService.getBrandImages({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.images = res?.result?.images
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      isActive: ['', Validators.required],
      isFeatured: ['', Validators.required],
      isArchive: ['', Validators.required],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
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

  getBrand() {
    this.brandService.getBrandBySlug(this.slug).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brand = res?.result[0];
          this.img = this.base + "/" + res?.result[0].file
          this.banner = res?.result[0].banner ? this.base + "/" + res?.result[0].banner : null
          this.brandForm.get('name')?.setValue(this.brand.name);
          this.brandForm.get('isActive')?.setValue(this.brand.isActive);
          this.brandForm.get('isArchive')?.setValue(this.brand.isArchive);
          this.brandForm.get('isFeatured')?.setValue(this.brand.isFeatured);
          this.brandForm.get('background')?.setValue(this.brand.style.background);
          this.brandForm.get('border')?.setValue(this.brand.style.border);
          this.brandForm.get('radius')?.setValue(this.brand.style.radius);
          this.brandForm.get('color')?.setValue(this.brand.style.text.color);
          this.brandForm.get('fontSize')?.setValue(this.brand.style.text.fontSize);
          this.brandForm.get('fontWeight')?.setValue(this.brand.style.text.fontWeight);
          this.background = this.brand.style.background
          this.color = this.brand.style.text.color
          this.border = this.brand.style.border
          if (this.brand.isArchive == true) {
            this.isArchived = true
          }
          this.cdr.markForCheck()
          break;
      }
    });
  }

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
    }
  }

  selectImage(file: any) {
    this.file = file
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  addBrand() { }

  updateBrand() {
    if (!this.brandForm.valid) {
      return;
    }

    const payload = this.createPayload()

    if (payload) {
      this.brandService.updateBrand(this.slug, payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.brand.BRAND_LIST]);
        }
      });
    } else {
      this.toastr.success("Couldn't update brand");
    }
  }

  createPayload() {
    const data = {
      name: this.brandForm.get("name")?.value,
      isActive: this.brandForm.get("isActive")?.value,
      isFeatured: this.brandForm.get("isFeatured")?.value,
      isArchive: this.brandForm.get("isArchive")?.value,
      style: {
        background: this.brandForm.get('background')?.value,
        border: this.brandForm.get('border')?.value,
        radius: this.brandForm.get('radius')?.value,
        text: {
          color: this.brandForm.get('color')?.value,
          fontSize: this.brandForm.get('fontSize')?.value,
          fontWeight: this.brandForm.get('fontWeight')?.value,
        }
      },
      brandid: this.brand.brandid
    }
    return data
  }

  restoreBrand() {
    if (this.restore.value == "true") {
      this.brandService.restoreBrand({ brandid: this.brand?.brandid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.brand.ARCHIVED_BRAND]);
        } else {
          this.toastr.error(res?.message);
        }
      })
    } else {
      this.router.navigate([this.appRoute.brand.ARCHIVED_BRAND]);
    }
  }


  //Media managment starts
  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
    this.BsModalService.show(this.mediaModal, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
    this.quesModalRef?.hide()
  }

  bannerFile(event: any) {
    this.bannerFiledata = <File>event.target.files[0];
    this.bannerFilename = this.bannerFiledata.name
    this.bannerChangedEvent = event;
    this.loadBanner = true
    this.BsModalService.show(this.coverModal, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
  }

  openQuesModal(template: TemplateRef<any>) {
    this.quesModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
  }

  openCoverModal(template: TemplateRef<any>) {
    this.coverModalRef = this.BsModalService.show(template);
  }

  openMediaModal(template: TemplateRef<any>) {
    this.mediaModalRef = this.BsModalService.show(template);
  }

  openExistingModal(template: TemplateRef<any>) {
    this.existModalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered' });
    this.quesModalRef?.hide()
  }

  closeMedia(type: any) {
    if (type == 'cover') {
      this.croppedBanner = ''
      this.bannerFilename = ''
    } else if (type == 'thumbnail') {
      this.croppedImage = ''
      this.filename = ''
    }
    this.BsModalService.hide()
  }

  saveMedia(type: any) {
    if (type == 'cover') {
      this.brandService.updateBrandMedias({ brand: this.brand?.brandid, media: { url: this.croppedBanner, name: this.bannerFilename } }, type).subscribe({
        next: (res: any) => {
          this.getBrand()
          this.toastr.success(res.message)
        }, error: (err: any) => {
          this.toastr.error(err.message)
        }
      })
    } else if (type == 'thumbnail') {
      this.brandService.updateBrandMedias({ brand: this.brand?.brandid, media: { url: this.croppedImage, name: this.filename } }, type).subscribe({
        next: (res: any) => {
          this.getBrand()
          this.toastr.success(res.message)
        }, error: (err: any) => {
          this.toastr.error(err.message)
        }
      })
    }

    this.BsModalService.hide()
  }

  saveExistingMedia(type: any, image: any) {
    if (type == 'cover') {
      this.brandService.updateBrandMedias({ brand: this.brand?.brandid, url: image }, type).subscribe({
        next: (res: any) => {
          this.getBrand()
          this.toastr.success(res.message)
        }, error: (err: any) => {
          this.toastr.error(err.message)
        }
      })
    } else if (type == 'thumbnail') {
      this.brandService.updateBrandMedias({ brand: this.brand?.brandid, url: image }, type).subscribe({
        next: (res: any) => {
          this.getBrand()
          this.toastr.success(res.message)
        }, error: (err: any) => {
          this.toastr.error(err.message)
        }
      })
    }

    this.BsModalService.hide()
  }

  removeCoverImage() {
    this.brandService.removeCoverMedia(this.brand.brandid).subscribe({
      next: (res: any) => {
        this.getBrand()
        this.toastr.success(res.message)
      }, error: (err: any) => {
        this.toastr.error(err.message)
      }
    })
  }
  //Media managment ends
}
