import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { routes } from 'src/app/app-routing.module';
import { AboutService } from 'src/app/includes/services/about.service';
import { environment } from 'src/environments/environment';

interface Feature {
  thumbnail: { _id: string };
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  routes = routes;
  thumbnailPreview: string = '';
  storyThumbnails: Array<any> = [];
  form: FormGroup = new FormGroup({});
  legacyItems: Array<{ title: string; placeholder: string }> = [];
  legacyRef?: BsModalRef;
  legacyForm: FormGroup = new FormGroup({});
  isLegacySubmitted: boolean = false;
  featureForm: FormGroup = new FormGroup({});
  isFeatureSubmitted: boolean = false;
  features: Array<{ thumbnail: any; title: string; description: string }> = [];
  featureRef?: BsModalRef;
  base: string = `${environment.base}`;
  aboutDetails: any;

  get legacyControls() {
    return this.legacyForm.controls;
  }

  get featureControls() {
    return this.featureForm.controls;
  }

  constructor(
    private AboutService: AboutService,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  openLegacy(template: TemplateRef<void>) {
    this.legacyRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  closeLegacy() {
    this.legacyForm.reset();
    this.legacyRef?.hide();
  }

  openFeature(template: TemplateRef<void>) {
    this.featureRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  closeFeature() {
    this.featureForm.reset();
    this.featureRef?.hide();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      html: new FormControl('', Validators.required),
      styles: new FormControl(''),
      scripts: new FormControl(''),
      storyThumbnails: new FormControl([]),
    });

    this.getAboutDetails();
  }

  onMediaSelected(type: string, event: any) {
    switch (type) {
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(event?._id);
        break;
    }
  }

  onFeatureMediaSelected(event: any) {
    this.featureForm.get('thumbnail')?.setValue(event);
  }

  onStoryThumbnailSelected(event: any) {
    this.storyThumbnails.push(event);
  }

  removeItems(type: string, index: number) {
    switch (type) {
      case 'storyThumbnails':
        this.storyThumbnails.splice(index, 1);
        break;
      case 'features':
        this.features.splice(index, 1);
        break;
      case 'legacyItems':
        this.legacyItems.splice(index, 1);
        break;
    }
  }

  saveLegacyItem() {
    if (!this.legacyForm.valid) {
      this.isLegacySubmitted = true;
      return;
    }

    this.legacyItems.push(this.legacyForm.value);
    this.closeLegacy();
  }

  saveFeatureItem() {
    if (!this.featureForm.valid) {
      this.isFeatureSubmitted = true;
      return;
    }

    this.features.push(this.featureForm.value);
    this.closeFeature();
  }

  getAboutDetails() {
    this.AboutService.getAboutDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.aboutDetails = res?.result;
          this.form.patchValue(res?.result);
          // this.legacyItems = res?.result?.legacyItems
          // this.features = res?.result?.features
          this.storyThumbnails = res?.result?.storyThumbnails
            ? res?.result?.storyThumbnails
            : [];
          // this.thumbnailPreview = res?.result?.thumbnail?.path
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }

  saveChanges() {
    if (!this.form.valid) {
      return;
    }

    // let features: Feature[] = []
    // if (this.features?.length > 0) {
    //   features = this.features.map(feature => {
    //     return {
    //       ...feature,
    //       thumbnail: feature.thumbnail?._id
    //     }
    //   })
    // }

    let storyThumbnails = [];
    if (this.storyThumbnails.length > 0) {
      storyThumbnails.push(...this.storyThumbnails.map((story) => story?._id));
    }

    this.form.get('storyThumbnails')?.setValue(storyThumbnails);

    this.AboutService.manageAbout(this.form.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getAboutDetails();
          this.HotToastService.success(
            res?.message || 'Changes saved successfully'
          );
        } else {
          this.HotToastService.error(res?.message || 'Something went wrong');
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.err.message || 'Something went wrong');
      },
    });
  }
}
