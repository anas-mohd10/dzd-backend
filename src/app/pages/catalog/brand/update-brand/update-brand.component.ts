import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

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
  croppedImage: any = '';
  loadImage: boolean;
  filename: string;
  base: any
  img: any;
  //Styling variables
  background: any
  border: any
  color: any
  isArchived: any

  restore = new FormControl('false');

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
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

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  getBrand() {
    this.brandService.getBrandBySlug(this.slug).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brand = res?.result[0];
          this.img = this.base + "/" + res?.result[0].file
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
    const data = {
      name: this.brandForm.get("name")?.value,
      isActive: this.brandForm.get("isActive")?.value,
      isFeatured: this.brandForm.get("isFeatured")?.value,
      isArchive: this.brandForm.get("isArchive")?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      file: '',
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

    if (this.uploadedimg != '') {
      data.file = this.brand?.file;
    }

    this.brandService.updateBrand(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.brand.BRAND_LIST]);
      }
    });
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
}
