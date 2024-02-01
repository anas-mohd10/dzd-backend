import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';

@Component({
  selector: 'app-add-testimonial',
  templateUrl: './add-testimonial.component.html',
  styleUrls: ['./add-testimonial.component.scss']
})
export class AddTestimonialComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  testimonialForm: FormGroup
  isSubmitted = false;
  filedata: File;
  filename: any;
  croppedImage: any;
  imageChangedEvent: any;
  loadImage: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private testimonialService: TestimonialService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()


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
      filename: this.filename
    }
    this.testimonialService.addTestimonial(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Testimonial added successfully');
        this.router.navigate([this.appRoute.testimonial.TESTIMONIAL_LIST]);
      }
    })
  }

  updateTestimonial() {
  }

}
