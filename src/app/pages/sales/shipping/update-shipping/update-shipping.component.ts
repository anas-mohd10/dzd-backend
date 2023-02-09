import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { ExternalShippingService } from 'src/app/includes/services/external.shipping.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-update-shipping',
  templateUrl: './update-shipping.component.html',
  styleUrls: ['./update-shipping.component.scss']
})
export class UpdateShippingComponent implements OnInit {
  refid: any;
  data: any;
  charges: any = []
  shippingform: FormGroup;
  isInvalid: boolean;
  appRoutes = appRoutes
  task = PageTasks.UPDATE;
  editMode: boolean = true
  isSubmitted = false;

  from: any = new FormControl()
  to: any = new FormControl()
  price: any = new FormControl()
  filedata: any;
  imageChangedEvent: any;
  loadImage: boolean;
  filename: any;
  croppedImage: any;
  base: string;
  img: string;

  constructor(
    private service: ExternalShippingService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private Router: Router,
    private toast: ToastrService
  ) { }

  get sf() {
    return this.shippingform.controls;
  }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.refid = this.route.snapshot.queryParams.shipping || ''
    this.service.getShipping({ refid: this.refid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.data = res?.result
        this.img = this.base + "/" + res?.result?.file
        for (let _data of res?.result?.details?.charges) {
          _data['id'] = this.charges.length
          this.charges.push(_data)
        }
        for (let _key of Object.keys(res?.result)) {
          this.shippingform.get(_key)?.setValue(res?.result[_key])
        }
        this.shippingform.get('url')?.setValue(res?.result?.details?.url)
        this.shippingform.get('transitTime')?.setValue(res?.result?.details?.transitTime)
        this.shippingform.get('days')?.setValue(res?.result?.details?.days)
        this.cdr.markForCheck()
      }
    })
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
        if (to < from) {
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
    if (fromWeight != null && toWeight != null) {
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
      this.toast.error('From & To value required')
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

  updateShipping() {
    if (!this.shippingform.valid) {
      this.toast.error('Validation error, kindly check fields entered.')
      return
    }

    const payload = this.createPayload()
    if (payload) {
      this.service.updateShipping(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toast.success(res?.message)
          this.Router.navigateByUrl(appRoutes.shipping.SHIPPING_LIST)
        } else {
          this.toast.error(res?.message)
        }
      })
    }
  }

  addShipping() { }

  createPayload() {
    let data = {
      name: this.shippingform.get('name')?.value,
      details: {
        days: this.shippingform.get('days')?.value,
        transitTime: this.shippingform.get('transitTime')?.value,
        url: this.shippingform.get('url')?.value,
        charges: this.charges
      },
      refid: this.refid,
      file: this.data?.file,
      isActive: this.shippingform.get('isActive')?.value
    }

    if (this.croppedImage) {
      data['file'] = {
        data: this.croppedImage,
        name: this.filename
      }
    }

    return data
  }

}
