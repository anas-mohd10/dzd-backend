import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { UploadService } from 'src/app/includes/services/upload.service';

@Component({
  selector: 'app-add-testimonial',
  templateUrl: './add-testimonial.component.html',
  styleUrls: ['./add-testimonial.component.scss']
})

export class AddTestimonialComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes
  form: FormGroup = new FormGroup({})
  isSubmitted = false;
  thumbnail: any;

  constructor(
    private HotToastService: HotToastService,
    private TestimonialService: TestimonialService,
    private Router: Router,
    private UploadService: UploadService,
    private ChangeDetectorRef: ChangeDetectorRef
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
  }

  get formControls() {
    return this.form.controls;
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

    this.TestimonialService.addTestimonial(this.form.value).subscribe({
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
