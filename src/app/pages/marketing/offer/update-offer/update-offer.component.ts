import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service'; 3
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss'],
})
export class UpdateOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  task = PageTasks.UPDATE;
  editMode = false;
  filedata: File;
  isSubmitted: boolean;
  offer: any;
  offerData: any;
  fromDate: any;
  lastDate: string;
  uploadedimg: any;
  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;
  base: any;

  //Styling variables
  background: any
  border: any
  color: any
  offerStarted: boolean = false;
  image: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.offer = this.route.snapshot.queryParams.offer || '';
    this.initForm();
    this.managePage();
    this.getOffer();
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      name: [''],
      description: [''],
      fromDate: [''],
      lastDate: [''],
      isFeatured: [''],
      isActive: [''],
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

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  getOffer() {
    this.offerService.getOfferById(this.offer).subscribe((res: any) => {
      if (res.errorCode == 0) {
        this.offerData = res?.result[0];
        this.cdr.markForCheck()
        this.image = this.base + "/" + this.offerData?.file;
        this.uploadedimg = this.offerData?.file;

        this.offerForm.get('name')?.setValue(this.offerData.name);
        this.offerForm.get('description')?.setValue(this.offerData.description);
        this.offerForm.get('isActive')?.setValue(this.offerData.isActive);
        this.offerForm.get('isFeatured')?.setValue(this.offerData.isFeatured);

        const today = new Date().toISOString()
        if (today > this.offerData?.fromDate) {
          this.offerStarted = true
          this.offerForm.get('fromDate')?.disable()
        }

        this.fromDate = new Date(this.offerData.fromDate).toISOString().split('T')[0];
        this.lastDate = new Date(this.offerData.lastDate).toISOString().split('T')[0];

        this.offerForm.get('fromDate')?.setValue(this.fromDate);
        this.offerForm.get('lastDate')?.setValue(this.lastDate);

        this.offerForm.get('background')?.setValue(this.offerData.style.background);
        this.offerForm.get('border')?.setValue(this.offerData.style.border);
        this.offerForm.get('radius')?.setValue(this.offerData.style.radius);
        this.offerForm.get('color')?.setValue(this.offerData.style.text.color);
        this.offerForm.get('fontSize')?.setValue(this.offerData.style.text.fontSize);
        this.offerForm.get('fontWeight')?.setValue(this.offerData.style.text.fontWeight);

        this.color = this.offerData.style.text.color
        this.background = this.offerData.style.background
        this.border = this.offerData.style.border
      }
    });
  }

  validateDate(e: any) {
    const today = new Date().toISOString()
    const fromDate = this.offerForm.get('fromDate')?.value
    console.log(e.value);
    if (this.offerStarted) {
      if(e.value<fromDate){
        this.toastr.error('inavlid date')
      }
      // else if (e.value < today) {
      //   this.toastr.error('inavlid date')
      // }
    }
  }

  addBrand() { }

  updateBrand() {
    if (!this.offerForm.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.offerService.updateOffer(this.offer, payload).subscribe((res: any) => {
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
      file: '',
      style: {
        background: this.offerForm.get('background')?.value,
        border: this.offerForm.get('border')?.value,
        radius: this.offerForm.get('radius')?.value,
        text: {
          color: this.offerForm.get('color')?.value,
          fontSize: this.offerForm.get('fontSize')?.value,
          fontWeight: this.offerForm.get('fontWeight')?.value,
        }
      },
      offerid: this.offer
    }
    if (this.uploadedimg) {
      data.file = this.uploadedimg
    }

    return data
  }
}
