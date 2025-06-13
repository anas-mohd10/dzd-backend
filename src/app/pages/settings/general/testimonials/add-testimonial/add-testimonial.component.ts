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

  constructor(
    private HotToastService: HotToastService,
    private TestimonialService: TestimonialService,
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      avatar: new FormControl('',Validators.required),
      profession: new FormControl(''),
      title: new FormControl(''),
      business: new FormControl(''),
      file: new FormControl('',Validators.required),
      rating: new FormControl('', [Validators.required, Validators.pattern("^[0-9]$")]),
      place: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      thumbnail: new FormControl('',Validators.required),
    });
  }

  onMediaSelect(event: { path: string }, mediaType: string) {
    if (mediaType == "avatar") {
      this.form.get("avatar")?.setValue(event.path)
    } else if (mediaType == "file") {
      this.form.get("file")?.setValue(event.path)
    }
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      this.HotToastService.error('Please fill all the required fields')
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
