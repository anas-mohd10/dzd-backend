import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { HotToastService } from '@ngneat/hot-toast';
import slugify from 'slugify';

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
  categoryDocs: Array<any> = [];
  rootDoc: any;
  parentDoc: any;
  cover: string = '';
  mobileCover: string = '';
  thumbnail: string = '';

  constructor(
    private Router: Router,
    private CategoryService: CategoryService,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

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

  onHierarchyChange() {
    if (this.form.get('isRoot')?.value == 'true') {
      this.form.get('hierarchy')?.setValue('');
      this.rootDoc = null;
      this.parentDoc = null;
      this.form.get('hierarchy')?.clearValidators();
      this.form.get('hierarchy')?.updateValueAndValidity();
    } else {
      this.form.get('hierarchy')?.setValidators([Validators.required]);
      this.form.get('hierarchy')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      slug: new FormControl(''),
      description: new FormControl(''),
      thumbnail: new FormControl(null),
      cover: new FormControl(null),
      mobileCover: new FormControl(null),
      hierarchy: new FormControl(''),
      isRoot: new FormControl(true),
      isActive: new FormControl(true),
      isMenu: new FormControl(false),
      isFilter: new FormControl(true),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
    });

    this.fetchCategories();
  }

  generateSlug() {
    this.form.get('slug')?.setValue(slugify(this.form.get('name')?.value, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g, trim: true }));
    this.ChangeDetectorRef.markForCheck();
  }

  fetchCategories() {
    this.CategoryService.getCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.categoryDocs = res?.result;

          this.categories = this.categoryDocs.map((category: any) => {
            let categoryDocItem = category.name;
            if (category.rootDetails && category.rootDetails.slug == category.parentDetails.slug) {
              categoryDocItem = category.rootDetails.name + ' > ' + category.name;
            } else if (category.parentDetails) {
              categoryDocItem = category.rootDetails.name + ' > ' + category.parentDetails.name + ' > ' + category.name;
            }

            return {
              ...category,
              name: categoryDocItem
            }
          });

          // Sort the categories by name
          this.categories.sort((a: any, b: any) => a.name.localeCompare(b.name));
          this.ChangeDetectorRef.markForCheck();
        } else { }
      },
      error: (err: any) => { },
    });
  }

  getParentDocs() {
    let categoryMap = new Map();
    this.categoryDocs.forEach((category: any) => (categoryMap.set(category.name, category)));
    let categoryItems = this.form.get('hierarchy')?.value.split(' > ');
    let categoryRootItem = categoryMap.get(categoryItems[0]);
    let categoryParentItem = categoryMap.get(categoryItems[categoryItems.length - 1]);
    this.rootDoc = categoryRootItem;
    this.parentDoc = categoryParentItem;
  }

  formatCategoryDoc(categoryDoc: any) {
    return {
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      _id: categoryDoc._id,
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.HotToastService.error('Please fill all the required fields');
      return;
    }

    this.CategoryService.addCategory({
      ...this.form.value,
      rootDetails: this.form.get('isRoot')?.value == 'false' && this.formatCategoryDoc(this.rootDoc),
      parentDetails: this.form.get('isRoot')?.value == 'false' && this.formatCategoryDoc(this.parentDoc),
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.category.CATEGORY_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }
}
