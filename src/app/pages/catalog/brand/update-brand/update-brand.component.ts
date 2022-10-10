import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { Location } from '@angular/common'

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private location: Location
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

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    event.preventDefault();
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      isActive: ['', Validators.required],
      isFeatured: ['', Validators.required],
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
          this.brandForm.get('isFeatured')?.setValue(this.brand.isFeatured);
          this.cdr.markForCheck()
          break;
      }
    });
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
      filestring: this.croppedImage,
      filename: this.filename,
      file: ''
    }

    if (this.uploadedimg != '') {
      data.file = this.brand?.file;
    }

    this.brandService.updateBrand(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Brand updated successfully');
        this.router.navigate([this.appRoute.brand.BRAND_LIST]);
      }
    });
  }
}
