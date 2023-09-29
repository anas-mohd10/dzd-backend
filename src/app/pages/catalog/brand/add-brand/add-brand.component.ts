import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss'],
})
export class AddBrandComponent implements OnInit {
  brandForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;

  isSubmitted = false;
  params: any;
  filedata: File;
  bannerFiledata: File
  status: boolean;
  imageArray: any;
  previewURL: any;
  uploadedImg: boolean = false;
  imageChangedEvent: any = '';
  bannerChangedEvent: any = '';
  croppedImage: any;
  croppedBanner: any
  filename: any
  bannerFilename: any
  loadImage: boolean = false;
  loadBanner: boolean = false;
  images: any = []
  //Styling variables
  background: any
  border: any
  color: any
  base: any
  file: any

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private BrandService: BrandService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  get bf() {
    return this.brandForm.controls;
  }

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  bannerFile(event: any) {
    this.bannerFiledata = <File>event.target.files[0];
    this.bannerFilename = this.bannerFiledata.name
    this.bannerChangedEvent = event;
    this.loadBanner = true
  }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.params = this.route.snapshot;
    this.managePage();
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });
    this.brandForm.get('background')?.setValue(AppSettings.BACKGROUND)
    this.background = AppSettings.BACKGROUND
    this.brandForm.get('border')?.setValue(AppSettings.BORDER)
    this.border = AppSettings.BORDER
    this.brandForm.get('color')?.setValue(AppSettings.COLOR)
    this.color = AppSettings.COLOR
    this.brandForm.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.brandForm.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.brandForm.get('fontSize')?.setValue(AppSettings.FONT_SIZE)

    this.BrandService.getBrandImages({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.images = res?.result?.images
        this.cdr.markForCheck()
      }
    })
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  handleCheckBox() { }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.file = null
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
    // this.file = null
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

  removebanner() {
    this.croppedBanner = ''
    this.loadBanner = false
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

  //Update exsisting brand
  updateBrand() { }

  //Add brand
  addBrand() {
    if (!this.brandForm.valid) {
      return;
    }

    const payload = this.createPayload()

    console.log(payload);


    if (payload) {
      if (payload.filestring != '') {
        this.BrandService.addBrand(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.brand.BRAND_LIST]);
          }
        });
      }
      else {
        this.toastr.error('Something went wrong');
      }
    } else {
      this.toastr.error("Couldn't add brand");
    }
  }

  createPayload() {
    const data = {
      name: this.brandForm.get("name")?.value,
      isActive: this.brandForm.get("isActive")?.value,
      isFeatured: this.brandForm.get("isFeatured")?.value,
      isArchive: this.brandForm.get("isArchive")?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      bannerstring: this.croppedBanner,
      bannername: this.bannerFilename,
      file: this.file,
      style: {
        background: this.brandForm.get('background')?.value,
        border: this.brandForm.get('border')?.value,
        radius: this.brandForm.get('radius')?.value,
        text: {
          color: this.brandForm.get('color')?.value,
          fontSize: this.brandForm.get('fontSize')?.value,
          fontWeight: this.brandForm.get('fontWeight')?.value,
        }
      }
    }
    return data
  }
}
