import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss'],
})
export class UpdateBrandComponent implements OnInit {
  form: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  brandDetails: any;
  slug: string;
  isSubmitted = false;
  thumbnail: string;
  cover: string;
  mobileCover: string;

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private brandService: BrandService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  get formControls() {
    return this.form.controls;
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      isActive: new FormControl('true'),
      isArchive: new FormControl('false'),
      isFeatured: new FormControl('false'),
      description: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      thumbnail: new FormControl(''),
      cover: new FormControl(''),
      mobileCover: new FormControl(''),
    });

    this.slug = this.ActivatedRoute.snapshot.queryParams.brand || '';

    this.brandService.getBrandBySlug(this.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.brandDetails = res?.result;
          this.form.patchValue(res?.result);
          this.thumbnail = res?.result?.thumbnail;
          this.cover = res?.result?.cover;
          this.mobileCover = res?.result?.mobileCover;
        }
      }, error: (err: any) => { }
    });
  }

  onThumbnailTriggered(event: any) {
    this.form.get('thumbnail')?.setValue(event?.path);
  }

  onCoverTriggered(event: any) {
    this.form.get('cover')?.setValue(event?.path);
  }
  onMobileCoverTriggered(event: any) {
    this.form.get('mobileCover')?.setValue(event?.path);
  }


  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null);
        this.cover = '';
        break;
      case 'mobileCover':
        this.form.get('mobileCover')?.setValue(null);
        this.mobileCover = '';
        break;
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null);
        this.thumbnail = '';
        break;
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.brandService.updateBrand({
      _id: this.brandDetails._id,
      ...this.form.value
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.brand.BRAND_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      }
    });
  }

  onRestore() {
    this.brandService
      .restoreBrand(this.brandDetails?._id)
      .subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.brand.BRAND_LIST]);
          } else {
            this.HotToastService.error(res?.message);
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        }
      });
  }

  onDelete() {
    this.brandService
      .deleteBrand(this.brandDetails?._id)
      .subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.brand.BRAND_LIST]);
          } else {
            this.HotToastService.error(res?.message);
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        }
      });
  }
}
