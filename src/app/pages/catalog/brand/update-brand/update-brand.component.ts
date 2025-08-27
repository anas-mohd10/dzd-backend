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
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { environment } from 'src/environments/environment';

  @Component({
    selector: 'app-update-brand',
    templateUrl: './update-brand.component.html',
    styleUrls: ['./update-brand.component.scss'],
  })
  export class UpdateBrandComponent implements OnInit {
    form: FormGroup;
    task = PageTasks.ADD;
    editMode = false;
    base: string = environment.base;
    appRoute = appRoutes;
    brandDetails: any;
    slug: string;
    isSubmitted = false;
    thumbnail: string;
    cover: string;
    mobileCover: string;
    brandCategories: Array<{ 
      title: string,
      brandCategoryImages: Array<{ 
        url: string, 
        title: string 
      }> 
    }> = [];
    @ViewChild('deleteConfirmation') deleteConfirmation: TemplateRef<any>;

    constructor(
      private FormBuilder: FormBuilder,
      private Router: Router,
      private ActivatedRoute: ActivatedRoute,
      private brandService: BrandService,
      private HotToastService: HotToastService,
      private ChangeDetectorRef: ChangeDetectorRef,
      private modalService: NgbModal
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
        slug: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        ]),
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
            
            // Updated brand categories initialization
            this.brandCategories = res?.result?.BrandCategory?.map((category: any) => ({
              title: category.title || '',
              brandCategoryImages: (category.brandCategoryImages || []).map((img: any) => ({
                url: typeof img === 'string' ? img : img.url,
                title: typeof img === 'string' ? '' : img.title || ''
              }))
            })) || [];
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
      this.isSubmitted = true;

      if (!this.form.valid) {
        return;
      }

      this.brandService.updateBrand({
        _id: this.brandDetails._id,
        ...this.form.value,
        BrandCategory: this.brandCategories
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
      this.modalService.open(this.deleteConfirmation, { centered: true });
    }

    confirmDelete() {
      this.modalService.dismissAll();
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

    // Add image to a category
    addBrandCategoryImage(categoryIndex: number, event: any) {
      const imgPath = event.path;
      if (!this.brandCategories[categoryIndex].brandCategoryImages.some(img => img.url === imgPath)) {
        this.brandCategories[categoryIndex].brandCategoryImages.push({
          url: imgPath,
          title: ''
        });
      }
      this.ChangeDetectorRef.markForCheck();
    }

    // Remove image from a category
    removeBrandCategoryImage(categoryIndex: number, imgUrl: string) {
      this.brandCategories[categoryIndex].brandCategoryImages =
        this.brandCategories[categoryIndex].brandCategoryImages.filter(img => img.url !== imgUrl);
      this.ChangeDetectorRef.markForCheck();
    }

    updateImageTitle(categoryIndex: number, imageIndex: number, event: Event) {
      const title = (event.target as HTMLInputElement).value;
      this.brandCategories[categoryIndex].brandCategoryImages[imageIndex].title = title;
    }
  
    // New method to update category title
    updateCategoryTitle(categoryIndex: number, event: Event) {
      const title = (event.target as HTMLInputElement).value;
      this.brandCategories[categoryIndex].title = title;
    }
  }