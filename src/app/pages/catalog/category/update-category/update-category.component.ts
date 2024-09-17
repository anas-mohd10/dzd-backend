import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../../config/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { HotToastService } from '@ngneat/hot-toast';

interface parentDetails {
  refid: string;
  catid: string
}

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  form: FormGroup = new FormGroup({})
  isSubmitted: boolean = false
  appRoute = appRoutes
  details: any;
  categories: Array<any> = []
  categoryDetails: Array<any> = []
  root: string = '';
  path: string = '';
  parentDetails: parentDetails = {
    refid: '',
    catid: ''
  }
  categorySlug: string = ''
  cover: string = ''
  thumbnail: string = ''

  constructor(
    private Router: Router,
    private CategoryService: CategoryService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute
  ) { }

  get formControls() {
    return this.form.controls;
  }

  onThumbnailTriggered(event: any) {
    this.form.get('thumbnail')?.setValue(event._id)
    this.thumbnail = event.path
  }

  onCoverTriggered(event: any) {
    this.form.get('cover')?.setValue(event._id)
    this.cover = event.path
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null)
        this.cover = ''
        break
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null)
        this.thumbnail = ''
        break
    }
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  ngOnInit(): void {
    this.categorySlug = this.ActivatedRoute.snapshot.queryParams.category || ""
    this.initForm();
    this.getCategory();
    this.CategoryService.getCategoryDetails(this.categorySlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.details = res?.result
          this.cover = res?.result?.cover?.path
          this.thumbnail = res?.result?.thumbnail?.path
          this.parentDetails = {
            refid: res?.result?.parent?.refid?._id,
            catid: res?.result?.parent?.catid
          }
          res?.result?.root ? this.root = res?.result?.root?._id : null
          this.form.patchValue(res?.result)
          this.path = res?.result?.path          
          this.form.get('parent')?.setValue(this.path)
          this.form.get('background')?.setValue(res?.result?.style?.background);
          this.form.get('border')?.setValue(res?.result?.style?.border);
          this.form.get('radius')?.setValue(res?.result?.style?.radius);
          this.form.get('color')?.setValue(res?.result?.style?.text?.color);
          this.form.get('fontSize')?.setValue(res?.result?.style?.text?.fontSize);
          this.form.get('fontWeight')?.setValue(res?.result?.style?.text?.fontWeight);
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      thumbnail: new FormControl(null),
      cover: new FormControl(null),
      isRoot: new FormControl(true),
      parent: new FormControl(''),
      isActive: new FormControl(true),
      isFeatured: new FormControl(false),
      isArchive: new FormControl(false),
      background: new FormControl(''),
      border: new FormControl(''),
      description: new FormControl(''),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      radius: new FormControl(''),
      color: new FormControl(''),
      fontSize: new FormControl(''),
      fontWeight: new FormControl(''),
    });

    this.form.get('background')?.setValue(AppSettings.BACKGROUND)
    this.form.get('border')?.setValue(AppSettings.BORDER)
    this.form.get('color')?.setValue(AppSettings.COLOR)
    this.form.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.form.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.form.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
  }

  getCategory() {
    this.CategoryService.getCategory().subscribe({
      next: (res: any) => {
        this.categoryDetails = res?.result
        for (let i = 0; i < res?.result.length; i++) {
          if (res?.result[i]?.isActive == true && res?.result[i]?.isArchive == false) {
            if (res?.result[i]?.parent && !res?.result[i]?.root) {
              this.categories.push(res?.result[i]?.parent.refid.name + ' > ' + res?.result[i]?.name);
            }
            if (!res?.result[i]?.parent && res?.result[i]?.root) {
              this.categories.push(res?.result[i]?.root.name + ' > ' + res?.result[i]?.name);
            }
            if (res?.result[i]?.parent && res?.result[i]?.root) {
              if (res?.result[i]?.parent.refid._id != res?.result[i]?.root._id) {
                this.categories.push(res?.result[i]?.root.name + ' > ' + res?.result[i]?.parent.refid.name + ' > ' + res?.result[i]?.name);
              } else if (res?.result[i]?.parent.refid._id == res?.result[i]?.root._id) {
                this.categories.push(res?.result[i]?.root.name + ' > ' + res?.result[i]?.name);
              }
            }
            if (!res?.result[i]?.parent && !res?.result[i]?.root) {
              this.categories.push(res?.result[i]?.name);
            }
          }
        }
      
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => { }
    });
  }

  getParentDetails(event: any) {
    this.path = event.value
    let split = event.value.split(" > ")
    let len = split.length
    for (let category of this.categoryDetails) {
      if (len > 1) {
        if (split[0] == category.name) {
          this.root = category._id
        }
        if (split[len - 1] == category.name) {
          this.parentDetails.refid = category._id
          this.parentDetails.catid = category.catid
        }
      } else if (len == 1) {
        if (split[0] == category.name) {
          this.root = category._id
          this.parentDetails.refid = category._id
          this.parentDetails.catid = category.catid
        }
      }
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.CategoryService.updateCategory(this.details.slug, {
      name: this.form.get('name')?.value,
      isRoot: this.form.get('isRoot')?.value,
      root: this.root ? this.root : null,
      parent: this.parentDetails?.refid ? this.parentDetails : null,
      _id: this.details._id,
      slug: this.details.slug,
      description: this.form.get("description")?.value,
      metaTitle: this.form.get("metaTitle")?.value,
      metaDescription: this.form.get("metaDescription")?.value,
      metaKeywords: this.form.get("metaKeywords")?.value,
      thumbnail: this.form.get('thumbnail')?.value,
      cover: this.form.get('cover')?.value,
      catid: this.details.catid,
      isActive: this.form.get('isActive')?.value,
      isFeatured: this.form.get('isFeatured')?.value,
      isArchive: this.form.get('isArchive')?.value,
      path: this.path,
      style: {
        background: this.form.get('background')?.value,
        border: this.form.get('border')?.value,
        radius: this.form.get('radius')?.value,
        text: {
          color: this.form.get('color')?.value,
          fontSize: this.form.get('fontSize')?.value,
          fontWeight: this.form.get('fontWeight')?.value,
        }
      }
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.category.CATEGORY_LIST]);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      }
    });
  }

  onRestore() {
    this.CategoryService.restoreCategory(this.details?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.Router.navigate([appRoutes.category.CATEGORY_LIST])
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  onDelete() {
    this.CategoryService.deleteCategory(this.details?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.category.CATEGORY_LIST])
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }
}
