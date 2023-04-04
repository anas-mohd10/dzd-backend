import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { ExternalShippingService } from 'src/app/includes/services/external.shipping.service';

@Component({
  selector: 'app-add-shipping',
  templateUrl: './add-shipping.component.html',
  styleUrls: ['./add-shipping.component.scss']
})
export class AddShippingComponent implements OnInit {

  shippingform: any
  appRoutes = appRoutes
  charges: any = []
  task = PageTasks.ADD;
  editMode: boolean = false
  isSubmitted = false;

  from: any = new FormControl()
  to: any = new FormControl()
  price: any = new FormControl()
  isInvalid: boolean = false;
  croppedImage: any;
  loadImage: boolean;
  filedata: File;
  filename: string;
  imageChangedEvent: any;

  constructor(
    private Router: Router,
    private toast: ToastrService,
    private ExternalShippingService: ExternalShippingService
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  get sf() {
    return this.shippingform.controls;
  }

  initForm() {
    this.shippingform = new FormGroup({
      name: new FormControl('', Validators.required),
      days: new FormControl('', Validators.required),
      transitTime: new FormControl(''),
      url: new FormControl(''),
      isActive: new FormControl(true),
    })
  }

  validateValue(key: any) {
    switch (key) {
      case 1:
        const to = this.to?.value
        const from = this.from?.value
        if (to < from || to) {
          this.isInvalid = true
        }
        break
      case 2:
        const to2 = this.to?.value
        const from2 = this.from?.value
        if (to2 < from2) {
          this.isInvalid = true
        }
        break
    }
  }

  addData() {
    const fromWeight = this.from?.value
    const toWeight = this.to?.value
    const price = this.price?.value
    const validWeight = this.from?.value < this.to?.value
    console.log();
    if (this.to?.value > 0 && this.from?.value > 0) {
      if ((fromWeight != null && toWeight != null)) {
        if (price != null) {
          if (validWeight) {
            this.charges.push({
              id: this.charges.length,
              from: this.from?.value,
              to: this.to?.value,
              price: this.price?.value
            })
            this.from?.setValue('')
            this.to?.setValue('')
            this.price?.setValue('')
          } else {
            this.toast.error('To value should be greater than from value')
          }
        } else {
          this.toast.error('Price is required')
        }
      } else {
        this.toast.error('From weight & to weight value required')
      }
    } else {
      this.toast.error("Weight values can't be negative")
    }
  }

  removeData(key: any) {
    this.charges = this.charges.filter((data: any) => data.id != key)
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

  imageLoaded() { }

  cropperReady() { }

  loadImageFailed() { }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateShipping();
    } else {
      this.addShipping();
    }
  }

  updateShipping() { }

  addShipping() {
    if (!this.shippingform.valid) {
      return
    }

    if (this.shippingform.get('days')?.value < 0) {
      this.toast.error("Days can't be negative")
      return
    }

    const payload = this.createPayload()
    if (payload) {
      this.ExternalShippingService.addShipping(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toast.success(res?.message)
          this.Router.navigateByUrl(appRoutes.shipping.SHIPPING_LIST)
        } else {
          this.toast.error(res?.message)
        }
      })
    }
  }

  createPayload() {
    let data = {
      name: this.shippingform.get('name')?.value,
      details: {
        days: this.shippingform.get('days')?.value,
        transitTime: this.shippingform.get('transitTime')?.value,
        url: this.shippingform.get('url')?.value,
        charges: this.charges
      },
      file: {
        data: this.croppedImage,
        name: this.filename
      },
      isActive: this.shippingform.get('isActive')?.value
    }

    return data
  }

}
