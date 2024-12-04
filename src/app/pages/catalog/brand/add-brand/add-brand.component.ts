import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  cover: string = '';
  mobileCover: string = '';
  thumbnail: string = '';

  constructor(
    private Router: Router,
    private BrandService: BrandService,
    private HotToastService: HotToastService
  ) { }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onThumbnailTriggered(event: any) {
    this.form.get('thumbnail')?.setValue(event?.path);
    this.thumbnail = event?.path;
  }

  onCoverTriggered(event: any) {
    this.form.get('cover')?.setValue(event?.path);
    this.cover = event?.path;
  }

  onMobileCoverTriggered(event: any) {
    this.form.get('mobileCover')?.setValue(event?.path);
    this.mobileCover = event?.path;
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

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      isActive: new FormControl('true'),
      isFeatured: new FormControl('false'),
      isArchive: new FormControl('false'),
      description: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      thumbnail: new FormControl(''),
      cover: new FormControl(''),
      mobileCover: new FormControl(''),
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.BrandService.addBrand(this.form.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.brand.BRAND_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => { }
    });
  }
}
