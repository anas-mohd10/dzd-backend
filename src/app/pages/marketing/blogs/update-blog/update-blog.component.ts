import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { BlogService } from 'src/app/includes/services/blog.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// Add these imports at the top
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PlatformService } from 'src/app/includes/services/platform.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import slugify from 'slugify';

interface Media {
  title: string;
  _id: string;
  size: string;
  path: string;
  slug: string;
  tag: string;
  type: string;
  uploadedBy: string;
  uploadedDescription: string;
  uploadedTo: string;
  createdAt: string;
}

// Add this interface at the top of the file
interface BlogCategory {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  isActive: boolean;
}

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.scss'],
  styles: [`
    .product-item {
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
    }
    .product-item:hover {
      background-color: #f8f9fa;
    }
    .select-btn {
      opacity: 0;
    }
    .product-item:hover .select-btn {
      opacity: 1;
    }
  `]
})


export class UpdateBlogComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup;
  categories: BlogCategory[] = [];
  isSubmitted: boolean = false;
  previews: any = { thumbnail: '', cover: '', authorThumbnail: '' };
  files: any = { thumbnail: null, cover: null };
  blogDetails: any;
  blogQuery: string = '';
  modalRef: BsModalRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    sanitize: false,
    toolbarHiddenButtons: [
      [
        'fontName',
      ]
    ]
  };
  slug: string;
  author: string = '';
  settings: any = {};
  newSlugValue: string = '';
  slugConfirmationRef?: BsModalRef;
  @ViewChild('slugConfirmationTemplate') slugConfirmationTemplate: TemplateRef<any>;


  constructor(
    private BlogService: BlogService,
    private Router: Router,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private PlatformService: PlatformService,
  ) {
    // Add this in constructor
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.searchProducts(value);
      } else {
        this.searchResults = [];
      }
    });
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.getCategories();
    this.initializeForm();
    this.blogQuery = this.ActivatedRoute.snapshot.params['slug'];
    this.getBlogDetails();

    this.AppSettingsService.getSettings().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    })
  }

  generateSlug() {
    const newSlug = slugify(this.form.get('title')?.value, {
      lower: true,
      strict: true,
      remove: /[*+~.()'\"!:@]/g,
      trim: true
    });
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

  getUrl(urlType: 'live' | 'draft') {
    const domainUrl: string = this.settings.domain.endsWith('/') ? this.settings.domain : `${this.settings.domain}/`;
    if (urlType === 'live') {
      return `${domainUrl}blogs/${this.blogDetails.slug}`;
    } else {
      return `${domainUrl}blogs/draft/${this.blogDetails.slug}`;
    }
  }

  initializeForm() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      overview: new FormControl(''),
      isActive: new FormControl(true),
      isDraft: new FormControl(false),
      isFeatured: new FormControl(false),
      author: new FormControl(''),
      authorThumbnail: new FormControl(null),
      category: new FormControl('', Validators.required),
      seoTitle: new FormControl(''),
      seoDescription: new FormControl(''),
      seoKeywords: new FormControl(''),
      canonicalUrl: new FormControl(''),
      thumbnail: new FormControl(null, Validators.required),
      cover: new FormControl(null),
      slug: new FormControl('', Validators.required),
      products: new FormControl([]),
      _id: new FormControl(''),
    });
  }

  getBlogDetails() {
    this.BlogService.getBlogBySlug(this.blogQuery).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.form.patchValue(res.result);
          if (res.result.category) {
            let categoryDoc = this.categories.find(category => category.title === res.result.category.title);
            this.form.patchValue({ category: categoryDoc?._id });
            this.form.patchValue({ _id: res.result._id });
          }

          this.previews = { thumbnail: res.result?.thumbnail?.path, cover: res.result?.cover?.path, authorThumbnail: res.result?.authorThumbnail?.path };
          this.selectedProducts = res.result.products || [];
          this.blogDetails = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      }
    });
  }



  selectedProducts: any[] = [];
  dropdownInputs: any = {
    placeholder: 'Search products',
    searchText: '',
  };
  base = environment.baseUrl;

  handleCover(event: any) {
    this.previews.cover = event.path;
    this.form.get('cover')?.setValue(event?._id);
  }

  handleAuthorThumbnail(event: any) {
    this.previews.authorThumbnail = event.path;
    this.form.get('authorThumbnail')?.setValue(event?._id);
  }

  handleThumbnail(event: any) {
    this.previews.thumbnail = event.path;
    this.form.get('thumbnail')?.setValue(event?._id);
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null);
        this.previews.cover = '';
        break;
      case 'authorThumbnail':
        this.form.get('authorThumbnail')?.setValue(null);
        this.previews.authorThumbnail = '';
        break;
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null);
        this.previews.thumbnail = '';
        break;
    }
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-sm',
      ignoreBackdropClick: true,
    });
  }

  confirm() {
    this.BlogService.deleteBlog(this.form.value._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.blogs.list]);
          this.Toast.success(res.message);
          this.modalRef?.hide();
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.Toast.error("Form validation failed")
      return;
    }
    this.BlogService.updateBlog({
      ...this.form.value,
      category: {
        title: this.categories.find(category => category._id === this.form.value.category)?.title,
        thumbnail: this.categories.find(category => category._id === this.form.value.category)?.thumbnail
      },
      // slug: this.form.value.slug || this.blogQuery,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.blogs.list]);
          this.Toast.success(res.message);
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }

  // Add these new methods
  onProductSelect(product: any) {
    if (!this.selectedProducts.find(p => p._id === product._id)) {
      this.selectedProducts.push(product);
      this.form.get('products')?.setValue(this.selectedProducts.map(p => p._id));
    }
  }

  onRemoveProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(p => p._id !== product._id);
    this.form.get('products')?.setValue(this.selectedProducts.map(p => p._id));
  }

  searchControl = new FormControl('');
  searchResults: any[] = [];
  showDropdown = false;


  // Add these new methods
  searchProducts(keyword: string) {
    this.PlatformService.getRedirectionResults({ keyword }).subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.searchResults = res.result.products || [];
          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }

  selectProduct(product: any) {
    if (!this.selectedProducts.find(p => p._id === product._id)) {
      this.selectedProducts.push(product);
      this.form.get('products')?.setValue(this.selectedProducts.map(p => p._id));
    }
    this.searchControl.setValue('');
    this.showDropdown = false;
  }

  removeProduct(product: any) {
    this.selectedProducts = this.selectedProducts.filter(p => p._id !== product._id);
    this.form.get('products')?.setValue(this.selectedProducts.map(p => p._id));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.product-search-container')) {
      this.showDropdown = false;
    }
  }

  getCategories() {
    this.BlogService.getCategories().subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.categories = res.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }

}
