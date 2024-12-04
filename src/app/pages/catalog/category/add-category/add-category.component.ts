import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { HotToastService } from '@ngneat/hot-toast';

interface parentDetails {
  refid: string;
  catid: string;
}

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  appRoute = appRoutes;
  categories: Array<any> = [];
  categoryDetails: Array<any> = [];
  root: string = '';
  path: string = '';
  parentDetails: parentDetails = {
    refid: '',
    catid: '',
  };
  cover: string = '';
  mobileCover: string = '';
  thumbnail: string = '';

  constructor(
    private Router: Router,
    private CategoryService: CategoryService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  get formControls() {
    return this.form.controls;
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
    this.mobileCover = event.path;
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

  ngOnInit(): void {
    this.initForm();
    this.getCategory();
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      thumbnail: new FormControl(null),
      cover: new FormControl(null),
      mobileCover: new FormControl(null),
      isRoot: new FormControl(true),
      parent: new FormControl(''),
      isActive: new FormControl(true),
      isFeatured: new FormControl(false),
      isArchive: new FormControl(false),
      description: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
    });
  }

  getCategory() {
    this.CategoryService.getCategory().subscribe({
      next: (res: any) => {
        this.categoryDetails = res?.result;
        this.ChangeDetectorRef.markForCheck();

        for (let i = 0; i < res?.result.length; i++) {
          if (
            res?.result[i]?.isActive == true &&
            res?.result[i]?.isArchive == false
          ) {
            if (res?.result[i]?.parent && !res?.result[i]?.root) {
              this.categories.push(
                res?.result[i]?.parent.refid.name + ' > ' + res?.result[i]?.name
              );
            }
            if (!res?.result[i]?.parent && res?.result[i]?.root) {
              this.categories.push(
                res?.result[i]?.root.name + ' > ' + res?.result[i]?.name
              );
            }
            if (res?.result[i]?.parent && res?.result[i]?.root) {
              if (
                res?.result[i]?.parent.refid?._id != res?.result[i]?.root?._id
              ) {
                this.categories.push(
                  res?.result[i]?.root.name +
                    ' > ' +
                    res?.result[i]?.parent.refid.name +
                    ' > ' +
                    res?.result[i]?.name
                );
              } else if (
                res?.result[i]?.parent.refid?._id == res?.result[i]?.root?._id
              ) {
                this.categories.push(
                  res?.result[i]?.root.name + ' > ' + res?.result[i]?.name
                );
              }
            }
            if (!res?.result[i]?.parent && !res?.result[i]?.root) {
              this.categories.push(res?.result[i]?.name);
            }
          }
        }
      },
      error: (err: any) => {},
    });
  }

  getParentDetails(event: any) {
    this.path = event.value;
    let split = event.value.split(' > ');
    let len = split.length;
    for (let category of this.categoryDetails) {
      if (len > 1) {
        if (split[0] == category.name) {
          this.root = category?._id;
        }
        if (split[len - 1] == category.name) {
          this.parentDetails.refid = category?._id;
          this.parentDetails.catid = category.catid;
        }
      } else if (len == 1) {
        if (split[0] == category.name) {
          this.root = category?._id;
          this.parentDetails.refid = category?._id;
          this.parentDetails.catid = category.catid;
        }
      }
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.CategoryService.addCategory({
      name: this.form.get('name')?.value,
      isRoot: this.form.get('isRoot')?.value,
      description: this.form.get('description')?.value,
      metaTitle: this.form.get('metaTitle')?.value,
      metaDescription: this.form.get('metaDescription')?.value,
      metaKeywords: this.form.get('metaKeywords')?.value,
      root: this.root ? this.root : null,
      thumbnail: this.form.get('thumbnail')?.value,
      cover: this.form.get('cover')?.value,
      mobileCover: this.form.get('mobileCover')?.value,
      parent: this.parentDetails?.refid ? this.parentDetails : null,
      isActive: this.form.get('isActive')?.value,
      isFeatured: this.form.get('isFeatured')?.value,
      isArchive: this.form.get('isArchive')?.value,
      path: this.path,
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.category.CATEGORY_LIST]);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }
}
