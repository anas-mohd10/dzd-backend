import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss'],
})
export class AddBrandComponent implements OnInit {
  brandForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  cover: string = '';
  thumbnail: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private Router: Router,
    private BrandService: BrandService,
    private HotToastService: HotToastService
  ) {}

  get formControls() {
    return this.brandForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onThumbnailTriggered(event: any) {
    this.brandForm.get('thumbnail')?.setValue(event?._id);
    this.thumbnail = event?.path;
  }

  onCoverTriggered(event: any) {
    this.brandForm.get('cover')?.setValue(event?._id);
    this.cover = event?.path;
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.brandForm.get('cover')?.setValue(null);
        this.cover = '';
        break;
      case 'thumbnail':
        this.brandForm.get('thumbnail')?.setValue(null);
        this.thumbnail = '';
        break;
    }
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      background: [''],
      description: [''],
      metaTitle: [''],
      metaDescription: [''],
      metaKeywords: [''],
      border: [''],
      radius: [''],
      thumbnail: [null],
      cover: [null],
      color: [''],
      fontSize: [''],
      fontWeight: [''],
    });
    this.brandForm.get('background')?.setValue(AppSettings.BACKGROUND);
    this.brandForm.get('border')?.setValue(AppSettings.BORDER);
    this.brandForm.get('color')?.setValue(AppSettings.COLOR);
    this.brandForm.get('radius')?.setValue(AppSettings.BORDER_RADIUS);
    this.brandForm.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT);
    this.brandForm.get('fontSize')?.setValue(AppSettings.FONT_SIZE);
  }

  //Add brand
  onSubmit() {
    if (!this.brandForm.valid) {
      return;
    }

    const payload = this.createPayload();
    if (payload) {
      this.BrandService.addBrand(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.brand.BRAND_LIST]);
        }
      });
    } else {
      this.HotToastService.error("Couldn't add brand");
    }
  }

  createPayload() {
    const data = {
      name: this.brandForm.get('name')?.value,
      description: this.brandForm.get('description')?.value,
      metaTitle: this.brandForm.get('metaTitle')?.value,
      metaDescription: this.brandForm.get('metaDescription')?.value,
      metaKeywords: this.brandForm.get('metaKeywords')?.value,
      isActive: this.brandForm.get('isActive')?.value,
      isFeatured: this.brandForm.get('isFeatured')?.value,
      isArchive: this.brandForm.get('isArchive')?.value,
      thumbnail: this.brandForm.get('thumbnail')?.value,
      cover: this.brandForm.get('cover')?.value,
      style: {
        background: this.brandForm.get('background')?.value,
        border: this.brandForm.get('border')?.value,
        radius: this.brandForm.get('radius')?.value,
        text: {
          color: this.brandForm.get('color')?.value,
          fontSize: this.brandForm.get('fontSize')?.value,
          fontWeight: this.brandForm.get('fontWeight')?.value,
        },
      },
    };

    return data;
  }
}
