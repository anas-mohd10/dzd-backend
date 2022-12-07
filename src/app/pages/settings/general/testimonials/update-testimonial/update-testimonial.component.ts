import { environment } from './../../../../../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-update-testimonial',
  templateUrl: './update-testimonial.component.html',
  styleUrls: ['./update-testimonial.component.scss']
})
export class UpdateTestimonialComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  testimonialForm: FormGroup
  isSubmitted = false;
  filedata: File;
  slug: any
  uploadedimg: any
  data: any;
  filename: any;
  croppedImage: any;
  imageChangedEvent: any;
  loadImage: boolean;
  base: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private testimonialService: TestimonialService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.slug || ''
    this.getTestimonial()
  }

  initForm() {
    this.testimonialForm = this.formBuilder.group({
      name: ['', Validators.required],
      profession: [''],
      business: [''],
      file: [''],
      place: ['', Validators.required],
      message: ['', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get tf() {
    return this.testimonialForm.controls;
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

  getTestimonial() {
    this.testimonialService.getTestimonial(this.slug).subscribe((res: any) => {
      this.data = res?.result[0]
      this.cdr.markForCheck()
      this.uploadedimg = this.base + "/" + res?.result[0].file
      this.testimonialForm.get("name")?.setValue(res?.result[0].name)
      this.testimonialForm.get("profession")?.setValue(res?.result[0].profession)
      this.testimonialForm.get("business")?.setValue(res?.result[0].business)
      this.testimonialForm.get("place")?.setValue(res?.result[0].place)
      this.testimonialForm.get("message")?.setValue(res?.result[0].message)
      this.testimonialForm.get("isActive")?.setValue(res?.result[0].isActive)
    })
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
      this.updateTestimonial();
    } else {
      this.addTestimonial();
    }
  }

  addTestimonial() {
  }

  updateTestimonial() {
    if (!this.testimonialForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }
    const data = {
      name: this.testimonialForm.get('name')?.value,
      profession: this.testimonialForm.get('profession')?.value,
      business: this.testimonialForm.get('business')?.value,
      place: this.testimonialForm.get('place')?.value,
      message: this.testimonialForm.get('message')?.value,
      isActive: this.testimonialForm.get('isActive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      file: ''
    }
    if (this.uploadedimg) {
      data.file = this.uploadedimg
    }
    this.testimonialService.updateTestimonial(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Testimonial updated successfully');
        this.router.navigate([this.appRoute.testimonial.TESTIMONIAL_LIST]);
      }
    })
  }
}
