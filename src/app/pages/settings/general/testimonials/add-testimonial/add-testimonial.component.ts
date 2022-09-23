import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
      firmName: [''],
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

  handleInputChange(fileInput: any) {
    this.filedata = <File>fileInput.target.files[0];
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

    const formdata = new FormData()
    if (this.filedata != null && this.filedata != undefined) {
      formdata.append('file', this.filedata);
    }
    for (const data of Object.keys(this.testimonialForm.value)) {
      formdata.append(data, this.testimonialForm.value[data]);
    }
    this.testimonialService.addTestimonial(formdata).subscribe((res: any) => {
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
