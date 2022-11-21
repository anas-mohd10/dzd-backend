import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  editMode = false;
  task = PageTasks.ADD;
  filedata: File;
  isSubmitted: boolean;

  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;

  //Styling variables
  background: any
  border: any
  color: any
  from_date: string;
  to_date: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService
  ) { }

  ngOnInit(): void {
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]

    this.initForm();
    this.managePage();
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      description: ['', Validators.required],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      isFeatured: ['false'],
      isActive: ['true'],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });
    this.offerForm.get('fromDate')?.setValue(this.from_date)
    this.offerForm.get('lastDate')?.setValue(this.to_date)
  }

  get of() {
    return this.offerForm.controls;
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

  addBrand() {
    if (!this.offerForm.valid) {
      console.error("Validation error")
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.offerService.addOffer(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.offer.OFFER_LIST]);
        }
      });
    }
  }

  createPayload() {
    const data = {
      name: this.offerForm.get('name')?.value,
      description: this.offerForm.get('description')?.value,
      fromDate: this.offerForm.get('fromDate')?.value,
      lastDate: this.offerForm.get('lastDate')?.value,
      isFeatured: this.offerForm.get('isFeatured')?.value,
      isActive: this.offerForm.get('isActive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      style: {
        background: this.offerForm.get('background')?.value,
        border: this.offerForm.get('border')?.value,
        radius: this.offerForm.get('radius')?.value,
        text: {
          color: this.offerForm.get('color')?.value,
          fontSize: this.offerForm.get('fontSize')?.value,
          fontWeight: this.offerForm.get('fontWeight')?.value,
        }
      }
    }

    return data
  }

  updateBrand() { }
}
