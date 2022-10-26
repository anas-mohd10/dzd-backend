import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
  status: boolean;
  imageArray: any;
  previewURL: any;
  uploadedImg: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  filename: any
  loadImage: boolean = false;


  //Styling variables
  background: any
  border: any
  color: any


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private BrandService: BrandService,
    private toastr: ToastrService
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

  ngOnInit(): void {
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

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
    }
  }

  //Update exsisting brand
  updateBrand() { }

  //Add brand
  addBrand() {
    if (!this.brandForm.valid) {
      return;
    }
    const data = {
      name: this.brandForm.get("name")?.value,
      isActive: this.brandForm.get("isActive")?.value,
      isFeatured: this.brandForm.get("isFeatured")?.value,
      filestring: this.croppedImage,
      filename: this.filename,
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
    if (data.filestring != '') {
      this.BrandService.addBrand(data).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Brand added successfully');
          this.router.navigate([this.appRoute.brand.BRAND_LIST]);
        }
      });
    }
    else {
      this.toastr.error('Something went wrong');
    }
  }
}
