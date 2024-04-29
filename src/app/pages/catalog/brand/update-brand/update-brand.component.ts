import { Component, OnInit, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  brandForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  brandDetails: any;
  slug: string;
  isSubmitted = false;
  thumbnail: string;
  cover: string;

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private brandService: BrandService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  get formControls() {
    return this.brandForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.slug = this.ActivatedRoute.snapshot.queryParams.brand || '';
    this.getBrand();
  }

  onThumbnailTriggered(event: any) {
    this.brandForm.get('thumbnail')?.setValue(event._id)
  }

  onCoverTriggered(event: any) {
    this.brandForm.get('cover')?.setValue(event._id)
  }

  initForm() {
    this.brandForm = this.FormBuilder.group({
      name: ['', Validators.required],
      isActive: ['', Validators.required],
      isFeatured: ['', Validators.required],
      isArchive: ['', Validators.required],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      thumbnail: [null],
      cover: [null],
      fontSize: [''],
      fontWeight: ['']
    });
  }

  getBrand() {
    this.brandService.getBrandBySlug(this.slug).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brandDetails = res?.result[0];
          this.brandForm.get('name')?.setValue(this.brandDetails.name);
          this.brandForm.get('isActive')?.setValue(this.brandDetails.isActive);
          this.thumbnail = this.brandDetails.thumbnail?.path
          this.cover = this.brandDetails.cover?.path
          this.brandForm.get('thumbnail')?.setValue(this.brandDetails.thumbnail?._id);
          this.brandForm.get('cover')?.setValue(this.brandDetails.cover?._id);
          this.brandForm.get('isArchive')?.setValue(this.brandDetails.isArchive);
          this.brandForm.get('isFeatured')?.setValue(this.brandDetails.isFeatured);
          this.brandForm.get('background')?.setValue(this.brandDetails.style.background);
          this.brandForm.get('border')?.setValue(this.brandDetails.style.border);
          this.brandForm.get('radius')?.setValue(this.brandDetails.style.radius);
          this.brandForm.get('color')?.setValue(this.brandDetails.style.text.color);
          this.brandForm.get('fontSize')?.setValue(this.brandDetails.style.text.fontSize);
          this.brandForm.get('fontWeight')?.setValue(this.brandDetails.style.text.fontWeight);
          this.ChangeDetectorRef.markForCheck()
          break;
      }
    });
  }

  onSubmit() {
    if (!this.brandForm.valid) {
      return;
    }

    const payload = this.createPayload()

    if (payload) {
      this.brandService.updateBrand(this.slug, payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.brand.BRAND_LIST]);
        }
      });
    } else {
      this.HotToastService.success("Couldn't update brand");
    }
  }

  createPayload() {
    const data = {
      name: this.brandForm.get("name")?.value,
      isActive: this.brandForm.get("isActive")?.value,
      isFeatured: this.brandForm.get("isFeatured")?.value,
      isArchive: this.brandForm.get("isArchive")?.value,
      thumbnail: this.brandForm.get("thumbnail")?.value,
      cover: this.brandForm.get("cover")?.value,
      style: {
        background: this.brandForm.get('background')?.value,
        border: this.brandForm.get('border')?.value,
        radius: this.brandForm.get('radius')?.value,
        text: {
          color: this.brandForm.get('color')?.value,
          fontSize: this.brandForm.get('fontSize')?.value,
          fontWeight: this.brandForm.get('fontWeight')?.value,
        }
      },
      slug: this.brandDetails.slug,
      brandid: this.brandDetails.brandid
    }
    return data
  }

  // restoreBrand() {
  //   if (this.restore.value == "true") {
  //     this.brandService.restoreBrand({ brandid: this.brand?.brandid }).subscribe((res: any) => {
  //       if (res?.errorCode == 0) {
  //         this.toastr.success(res?.message);
  //         this.Router.navigate([this.appRoute.brand.ARCHIVED_BRAND]);
  //       } else {
  //         this.toastr.error(res?.message);
  //       }
  //     })
  //   } else {
  //     this.Router.navigate([this.appRoute.brand.ARCHIVED_BRAND]);
  //   }
  // }
}
