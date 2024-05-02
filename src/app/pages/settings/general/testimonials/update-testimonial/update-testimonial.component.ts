import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { UploadService } from 'src/app/includes/services/upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-testimonial',
  templateUrl: './update-testimonial.component.html',
  styleUrls: ['./update-testimonial.component.scss']
})
export class UpdateTestimonialComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes
  form: FormGroup = new FormGroup({})
  isSubmitted = false;
  thumbnail: any;
  details: any;
  base: string = `${environment.base}/`
  id: string;

  constructor(
    private HotToastService: HotToastService,
    private TestimonialService: TestimonialService,
    private Router: Router,
    private UploadService: UploadService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      profession: new FormControl(''),
      business: new FormControl(''),
      file: new FormControl(''),
      place: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      isActive: new FormControl(true),
    });

    this.id = this.ActivatedRoute.snapshot.queryParams.id || ''
    this.getTestimonial()
  }

  get formControls() {
    return this.form.controls;
  }

  getTestimonial() {
    this.TestimonialService.getTestimonial(this.id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          res?.result?.file ? this.thumbnail = `${environment.base}${res?.result?.file}` : null
          this.form.patchValue(res?.result)
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  uploadThumbnail(event: any) {
    let formdata = new FormData()
    formdata.append("file", event.target.files[0])
    this.UploadService.uploadThumbnail(formdata).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.thumbnail = res?.result?.path
          this.form.get('file')?.setValue(res?.result?.location)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  removeThumbnail() {
    this.UploadService.removeThumbnail({ location: this.form.get('file')?.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.thumbnail = null
          this.form.get('file')?.setValue('')
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }


  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.TestimonialService.updateTestimonial({ ...this.form.value, _id: this.details._id }).subscribe({
      next: (res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.testimonial.TESTIMONIAL_LIST]);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      }
    })
  }
}
