import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';


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
  image: any
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private testimonialService: TestimonialService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.slug || ''
    this.getTestimonial()
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

  getTestimonial() {
    this.testimonialService.getTestimonial(this.slug).subscribe((res: any) => {
      this.data = res?.result[0]
      this.image = res?.result[0].file
      this.testimonialForm.get("name")?.setValue(res?.result[0].name)
      this.testimonialForm.get("profession")?.setValue(res?.result[0]?.details.profession)
      this.testimonialForm.get("firmName")?.setValue(res?.result[0]?.details.firmName)
      this.testimonialForm.get("place")?.setValue(res?.result[0]?.details.place)
      this.testimonialForm.get("message")?.setValue(res?.result[0].message)
      this.testimonialForm.get("isActive")?.setValue(res?.result[0].isActive)
    })
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

    const formdata = new FormData()
    if (this.filedata != null && this.filedata != undefined) {
      formdata.append('file', this.filedata);
    } else {
      formdata.append("file", this.image)
    }
    for (const data of Object.keys(this.testimonialForm.value)) {
      formdata.append(data, this.testimonialForm.value[data]);
    }
    this.testimonialService.updateTestimonial(this.slug, formdata).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Testimonial updated successfully');
        this.router.navigate([this.appRoute.testimonial.TESTIMONIAL_LIST]);
      }
    })
  }
}
