import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AppSettings } from '../../../../config/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { HotToastService } from '@ngneat/hot-toast';
import slugify from 'slugify';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

interface parentDetails {
  refid: string;
  catid: string;
}

interface Hierarchy {
  name: string;
  slug: string;
  _id: string;
}

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
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
  categoryDoc: any;
  categoryId: string = '';
  hierarchies: Array<Hierarchy> = [];
  @ViewChild('deleteConfirmation') deleteConfirmation!: TemplateRef<any>;
  @ViewChild('slugConfirmationTemplate') slugConfirmationTemplate: TemplateRef<any>;

  slugConfirmationRef?: BsModalRef;
  newSlugValue: string = '';

  constructor(
    private Router: Router,
    private CategoryService: CategoryService,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private BsModalService: BsModalService
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
    this.categoryId = this.ActivatedRoute.snapshot.queryParams['category'] || '';

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      slug: new FormControl(''),
      description: new FormControl(''),
      thumbnail: new FormControl(null),
      cover: new FormControl(null),
      mobileCover: new FormControl(null),
      hierarchy: new FormControl(''),
      isFeatured: new FormControl(false),
      isRoot: new FormControl(true),
      isActive: new FormControl(true),
      isArchive: new FormControl(false),
      isMenu: new FormControl(false),
      isFilter: new FormControl(true),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
    });

    this.fetchCategories();

    this.CategoryService.getCategoryDetails(this.categoryId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.categoryDoc = res?.result;
          this.form.patchValue(res.result);

          // Set image paths
          this.cover = res.result?.cover || '';
          this.mobileCover = res.result?.mobileCover || '';
          this.thumbnail = res.result?.thumbnail || '';


          // Set Root and Parent Details based on the categoryDoc
          if (res?.result?.rootDetails) {
            this.rootDoc = res?.result?.rootDetails;
          }

          if (res?.result?.parentDetails) {
            this.parentDoc = res?.result?.parentDetails;
          }

          if (res?.result?.hierarchies && res?.result?.hierarchies.length > 0) {
            this.hierarchies = res?.result?.hierarchies.map((hierarchy: any) => {
              return this.formatCategoryDoc(hierarchy);
            });
            // Remove null from the hierarchies
            this.hierarchies = this.hierarchies.filter((hierarchy: any) => hierarchy !== null);
            // Remove the duplicate hierarchies
            this.hierarchies = this.hierarchies.filter((hierarchy: any, index: number, self: any) =>
              index === self.findIndex((t: any) => t._id === hierarchy._id)
            );
            // Check if the parentDoc is already in the hierarchies
            if (!this.hierarchies.some((hierarchy: any) => hierarchy._id == this.parentDoc._id)) {
              this.hierarchies.push(this.formatCategoryDoc(this.parentDoc));
            }
          } else {
            this.hierarchies = [this.formatCategoryDoc(this.parentDoc)];
          }

          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err: any) => { }
    });
  }

  generateSlug() {
    const newSlug = slugify(this.form.get('name')?.value, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
      trim: true
    });

    // Show confirmation dialog
    this.openSlugConfirmation(newSlug);
  }

  openSlugConfirmation(newSlug: string) {
    this.newSlugValue = newSlug;
    this.slugConfirmationRef = this.BsModalService.show(this.slugConfirmationTemplate, {
      class: 'modal-dialog-centered modal-md',
      ignoreBackdropClick: true,
    });
  }

  confirmSlugChange() {
    this.form.get('slug')?.setValue(this.newSlugValue);
    this.slugConfirmationRef?.hide();
    this.ChangeDetectorRef.markForCheck();
  }

  cancelSlugChange() {
    this.slugConfirmationRef?.hide();
  }

  fetchCategories() {
    this.CategoryService.getCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.categoryDocs = res?.result;

          this.categories = this.categoryDocs.map((category: any) => {
            if (category.slug == this.categoryId) return
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
    this.hierarchies.push(...this.parentDoc.hierarchies, this.formatCategoryDoc(this.parentDoc))
  }

  formatCategoryDoc(categoryDoc: any) {
    return {
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      _id: categoryDoc._id,
    }
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.HotToastService.error('Please fill all the required fields');
      return;
    }

    this.CategoryService.updateCategory(this.categoryDoc.slug, {
      ...this.form.value,
      _id: this.categoryDoc._id,
      hierarchies: this.hierarchies,
      rootDetails: ['false', false].includes(this.form.get('isRoot')?.value) && this.formatCategoryDoc(this.rootDoc),
      parentDetails: ['false', false].includes(this.form.get('isRoot')?.value) && this.formatCategoryDoc(this.parentDoc),
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

  onRestore() {
    this.CategoryService.restoreCategory(this.categoryDoc?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([appRoutes.category.CATEGORY_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }

  onDelete() {
    this.modalService.open(this.deleteConfirmation, { centered: true });
  }

  confirmDelete() {
    this.CategoryService.deleteCategory(this.categoryDoc?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.category.CATEGORY_LIST]);
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }
  // onDelete() {
  //   this.CategoryService.deleteCategory(this.categoryDoc?._id).subscribe({
  //     next: (res: any) => {
  //       if (res?.errorCode == 0) {
  //         this.Router.navigate([appRoutes.category.CATEGORY_LIST]);
  //         this.HotToastService.success(res?.message);
  //       } else {
  //         this.HotToastService.error(res?.message);
  //       }
  //     },
  //     error: (err: any) => {
  //       this.HotToastService.error(err?.error?.message);
  //     },
  //   });
  // }
}
