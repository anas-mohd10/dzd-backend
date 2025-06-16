import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-testimonial',
  templateUrl: './update-testimonial.component.html',
  styleUrls: ['./update-testimonial.component.scss'],
})
export class UpdateTestimonialComponent implements OnInit {
  editMode = false;
  appRoute = appRoutes;
  form: FormGroup = new FormGroup({});
  isSubmitted = false;
  details: any;
  base: string = `${environment.base}`;
  id: string;

  constructor(
    private HotToastService: HotToastService,
    private TestimonialService: TestimonialService,
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute
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
    });

    this.id = this.ActivatedRoute.snapshot.queryParams.id || '';
    this.getTestimonial();
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

  getTestimonial() {
    this.TestimonialService.getTestimonial(this.id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result;
          this.form.patchValue(res?.result);
          this.ChangeDetectorRef.markForCheck();
        } else { }
      },
      error: (err: any) => { },
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.TestimonialService.updateTestimonial({
      ...this.form.value,
      _id: this.details?._id,
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.testimonial.TESTIMONIAL_LIST]);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }
}
