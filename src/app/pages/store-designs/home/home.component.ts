import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeWidgetsService } from 'src/app/includes/services/home-widgets.service';
import { CdkDragDrop, moveItemInArray, } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BlogService } from 'src/app/includes/services/blog.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { StaticPageService } from 'src/app/includes/services/static-page.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CatalogService } from 'src/app/includes/services/catalog.service';
import { widgets } from './home.widgets';
import {
  cmsPages,
  editorConfig,
  hiddenDisplaySettings,
  hiddenHeaderItems,
  redirectionItems,
  searchRedirections,
  sortOptions,
  widgetImageTypes,
  widgetProductTypes
} from './home.constants';

interface WidgetProps {
  title: string;
  type: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  widgets: Array<WidgetProps> = widgets;
  widgetProductTypes: Array<any> = widgetProductTypes;
  widgetImageTypes: Array<any> = widgetImageTypes;
  isWidgetLoaded: boolean = false;
  redirectionItems: Array<any> = redirectionItems;
  sortOptions: Array<any> = sortOptions;
  cmsPages: Array<any> = cmsPages;
  searchRedirections: Array<string> = searchRedirections;
  editorConfig: AngularEditorConfig = editorConfig
  hiddenHeaderItems: Array<string> = hiddenHeaderItems;
  hiddenDisplaySettings: Array<string> = hiddenDisplaySettings;
  today: Date = new Date();
  focusedWidget: WidgetProps | null = null;
  confirmedWidget: any;
  duplicateRef?: any;
  duplicatedWidget: any;
  widgetDetails: any;
  widgetImagePreview: any;
  widgetImagePreviewIndex: any;
  widgetPreviewDetails: any;
  redirectionDetails: any;
  count: number = 0;
  screenLoad: number = 0;
  blogsMap: any = {}
  settings: any = {};
  isDraft: boolean = false;
  widgetImages: Array<any> = [];
  smartTileProducts: Array<any> = [];
  tileProducts: Array<any> = [];
  staticPages: Array<any> = [];
  keyPoints: Array<any> = []
  blogs: Array<any> = [];
  widgetBlogs: Array<any> = [];
  redirections: Array<any> = [];
  widgetProducts: Array<any> = [];
  products: Array<any> = [];
  homeWidgets: Array<any> = [];
  widgetItems: Array<any> = [];
  collections: Array<any> = [];
  spotlightSliders: Array<any> = [];
  categories: Array<any> = [];
  brands: Array<any> = [];
  testimonials: Array<any> = [];
  widgetTestimonials: Array<any> = [];
  catalogPages: Array<any> = [];
  widgetsRef?: BsModalRef;
  confirmRef?: BsModalRef;
  updateRef?: BsModalRef;
  historyRef?: BsModalRef;
  designRef?: BsModalRef;
  device: string = 'desktop';
  selectedProductType: string = 'products';
  hyperLinkHeroThumbnail: string = '';
  base: string = '';
  previewDetails: string = '';
  collectionCoverDetails: string = '';
  collectionThumbnailDetails: string = '';
  backgroundDetails: string;
  saleThumbnailDetails: string = '';
  titleThumbnailDetails: string = '';
  productsAdThumbnail: string;
  insightHubThumbnailSmall: string = '';
  insightHubThumbnailLarge: string = '';
  keyPointThumbnail: string = '';
  form: FormGroup = new FormGroup({});
  widgetForm: FormGroup = new FormGroup({});
  saleForm: FormGroup = new FormGroup({});
  productForm: FormGroup = new FormGroup({});
  designForm: FormGroup = new FormGroup({});
  insightHubForm: FormGroup = new FormGroup({});
  keyPointForms: FormGroup = new FormGroup({});
  hyperlinkheroForm: FormGroup = new FormGroup({});
  keyPointForm: FormGroup = new FormGroup({});
  widgetCollection: FormControl = new FormControl('');
  widgetBrand: FormControl = new FormControl('');
  widgetCategory: FormControl = new FormControl('');
  widgetBlog: FormControl = new FormControl('');
  productsAdRedirection: FormControl = new FormControl('');
  productAd: FormControl = new FormControl(null);
  redirectionQuery: FormControl = new FormControl(null);
  productKeyword: FormControl = new FormControl('', Validators.required);
  homeWidgetKeyword: FormControl = new FormControl('', Validators.required);
  tileProductsInput: FormControl = new FormControl('', Validators.required);
  testimonialKeyword: FormControl = new FormControl('', Validators.required);

  constructor(
    private BsModalService: BsModalService,
    private Toast: HotToastService,
    private HomeWidgetsService: HomeWidgetsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService,
    private ProductService: ProductService,
    private CollectionService: CollectionService,
    private CatalogService: CatalogService,
    private AppSettingsService: AppSettingsService,
    private CategoryService: CategoryService,
    private TestimonialService: TestimonialService,
    private StaticPageService: StaticPageService,
    private BrandService: BrandService
  ) { }


  // Clickpulse
  handleClickpulse(event: any) { 

  }
  // Clickpulse


  getDomain(domain: string) {
    return domain.endsWith('/') ? domain.slice(0, -1) : domain;
  }

  toggleMotionCanvasThumbnail(event: any) {
    this.productAd?.setValue(event.path);
    this.productsAdThumbnail = event.path;
  }

  isPublished(event: boolean) {
    if (event) this.isDraft = false
  }

  removeMotionCanvasThumbnail() {
    this.productAd?.setValue(null);
    this.productsAdThumbnail = '';
  }

  getTestimonials() {
    if (!this.testimonialKeyword.valid) {
      this.testimonials = [];
      return;
    }

    this.TestimonialService.searchTestimonials({ keyword: this.testimonialKeyword.value, isActive: true }, 1, 20).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.testimonials = res?.result?.data;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => { },
    });
  }

  toggleTestimonials(testimonial: any) {
    let isExists = this.widgetTestimonials.some((item: any) => item?._id == testimonial?._id);
    if (isExists) {
      this.widgetTestimonials = this.widgetTestimonials.filter((item) => item?._id != testimonial?._id);
    } else {
      this.widgetTestimonials.push(testimonial);
    }
  }

  getTileProducts() {
    if (!this.tileProductsInput.valid) {
      this.tileProducts = [];
      return;
    }

    this.ProductService.searchProducts({
      name: this.tileProductsInput.value,
      page: 1,
      limit: 100,
      isActive: true,
      isVisible: '0',
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.tileProducts = res?.result?.data;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }

  toggleTileProducts(productDetails: any) {
    let isExists = this.smartTileProducts.some((item: any) => item?._id == productDetails?._id);
    if (isExists) {
      this.smartTileProducts = this.smartTileProducts.filter((item) => item?._id != productDetails?._id);
    } else {
      if (this.smartTileProducts.length >= 20) {
        return this.Toast.error('Maximum limit reachced');
      }
      this.smartTileProducts.push(productDetails);
    }
    this.widgetCollection.setValue('');
  }

  isTileProductExists(productDetails: any) {
    return this.smartTileProducts.some((item: any) => item?._id == productDetails?._id) ? true : false;
  }

  handleInsightHubThumbnail(event: any, type: string) {
    if (type == 'small') {
      this.insightHubForm.get('insightHubThumbnailSmall')?.setValue(event?._id);
      this.insightHubThumbnailSmall = event.path;
    } else {
      this.insightHubForm.get('insightHubThumbnailLarge')?.setValue(event?._id);
      this.insightHubThumbnailLarge = event.path;
    }
  }

  handleKeyPointThumbnail(event: any) {
    this.keyPointForm.get('icon')?.setValue(event?.path);
    this.keyPointThumbnail = event.path;
  }

  removeKeyPointThumbnail() {
    this.keyPointForm.get('icon')?.setValue(null);
    this.keyPointThumbnail = '';
  }

  saveKeyPoints() {
    if (!this.keyPointForm.valid) {
      return
    }

    this.keyPoints = [...this.keyPoints, this.keyPointForm.value]
    this.keyPointForm.reset();
    this.keyPointThumbnail = '';
    this.Toast.success('Key point added successfully')
  }

  removeKeyPoints(pointIndex: number) {
    this.keyPoints.splice(pointIndex, 1)
    this.Toast.info('Key point removed successfully')
  }

  saveBlogs() {
    let blogItem = this.blogsMap[this.widgetBlog.value]
    this.widgetBlogs.push(blogItem)
    this.widgetBlog.setValue('')
    this.Toast.success('Blog added successfully')
  }

  removeBlog(blogIndex: number) {
    this.widgetBlogs.splice(blogIndex, 1)
    this.Toast.info('Blog removed successfully')
  }

  removeInsightHubThumbnail(type: string) {
    if (type == 'small') {
      this.insightHubForm.get('insightHubThumbnailSmall')?.setValue(null);
      this.insightHubThumbnailSmall = '';
    } else {
      this.insightHubForm.get('insightHubThumbnailLarge')?.setValue(null);
      this.insightHubThumbnailLarge = '';
    }
  }

  onRedirectionSelected() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.getBlogs(this.redirectionQuery.value);
        break;
      case 'category':
        this.getCategories();
        break;
      case 'brand':
        this.getBrands();
        break;
      case 'catalog':
        this.getCatalogPages();
        break;
      case 'products':
        this.getProducts();
        break;
      case 'collection':
        this.getCollections();
        break;
      case 'static-pages':
        this.getStaticPages();
        break;
      case 'all-products':
        this.widgetForm.get('redirection')?.setValue('/products');
        this.redirectionQuery.setValue('/products');
        break;
    }
  }

  redirectionQueryChange() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.getBlogs(this.redirectionQuery.value);
        break;
    }
  }

  toggleRedirectionDetails(redirectionDetails: any) {
    this.redirectionDetails = redirectionDetails;
    this.blogs = [];
    this.brands = [];
    this.categories = [];
    this.redirectionQuery.setValue('');
  }

  continueRedirectionQuery() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.widgetForm
          .get('redirection')
          ?.setValue('/blogs/' + this.redirectionDetails.slug);
        break;
      case 'static-pages':
        this.widgetForm
          .get('redirection')
          ?.setValue('/pages/' + this.redirectionQuery.value);
        break;
      case 'cms-pages':
        this.widgetForm
          .get('redirection')
          ?.setValue(this.redirectionQuery.value);
        break;
      case 'search-filters':
        this.widgetForm
          .get('redirection')
          ?.setValue('/products' + this.redirectionQuery.value);
        break;
      case 'category':
        this.widgetForm
          .get('redirection')
          ?.setValue('/products/' + this.redirectionQuery.value);
        break;
      case 'catalog':
        this.widgetForm
          .get('redirection')
          ?.setValue('/catalogs/' + this.redirectionQuery.value);
        break;
      case 'brand':
        this.widgetForm
          .get('redirection')
          ?.setValue('/brands/' + this.redirectionQuery.value);
        break;
      case 'products':
        if (this.redirectionQuery.value) {
          this.widgetForm.get('redirection')?.setValue('/p/' + this.redirectionQuery.value);
        }
        break;
      case 'collection':
        this.widgetForm
          .get('redirection')
          ?.setValue('/c/' + this.redirectionQuery.value);
        break;
    }

    this.addWidgetDetails();
    this.redirectionQuery.setValue('');
    this.widgetImagePreviewIndex = null;
    this.widgetImagePreview = null;
    this.widgetForm.reset();
    this.widgetForm.patchValue({ redirectionType: '' });
  }

  deviceToggled(event: string) {
    this.device = event;
    this.ChangeDetectorRef.markForCheck();
  }

  toggleProductSelection(type: string) {
    this.selectedProductType = type;
    switch (type) {
      case 'collections':
        this.getCollections();
        this.widgetBrand.setValue(null);
        this.widgetCategory.setValue(null);
        this.smartTileProducts = [];
        break;
      case 'brands':
        this.getBrands();
        this.widgetCollection.setValue(null);
        this.widgetCategory.setValue(null);
        this.smartTileProducts = [];
        break;
      case 'categories':
        this.getCategories();
        this.widgetBrand.setValue(null);
        this.widgetCollection.setValue(null);
        this.smartTileProducts = [];
        break;
    }
  }

  openDesign(template: TemplateRef<any>, widget: any) {
    this.designRef = this.BsModalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    this.getWidgetDetails(widget);
  }

  isExpired(date: string) {
    return new Date(date) < new Date();
  }

  isScheduled(date: string) {
    return new Date(date) > new Date();
  }

  isRunning(startDate: string, endDate: string) {
    return new Date(startDate) < new Date() && new Date(endDate) > new Date();
  }

  getWidgetDetails(widget: any) {
    this.isWidgetLoaded = false;
    this.HomeWidgetsService.homeWidgetDetails(widget?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetDetails = res?.result;
          if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
            for (let widgetImage of this.widgetDetails?.widgetImages) {
              this.widgetImages.push({
                url: widgetImage?.media,
                title: widgetImage?.title,
                customStyles: widgetImage?.customStyles,
                description: widgetImage?.description,
                button: widgetImage?.button,
                redirection: widgetImage?.redirection,
              });
            }
            this.widgetImagePreview = this.widgetImages[0];
            this.widgetImagePreviewIndex = 0;
            this.previewDetails = this.widgetImagePreview?.url
              ? this.widgetImagePreview?.url?.path
              : '';
            this.widgetForm.patchValue(this.widgetImagePreview);
          }
          if (this.widgetDetails?.widgetType == 'blogs') {
            this.widgetBlogs = this.widgetDetails?.blogs;
            this.getBlogs('');
          }
          if (this.widgetDetails?.widgetType == 'testimonial-cards') {
            this.widgetTestimonials = this.widgetDetails?.testimonials;
          }
          [
            'smart-tiles',
            'products',
            'motion-canvas',
            'aurora-grid',
            'aurora-slider',
          ]?.includes(this.widgetDetails?.widgetType)
            ? (this.smartTileProducts = [...this.widgetDetails?.products])
            : null;
          if (this.widgetDetails?.styles?.backgroundImage)
            this.backgroundDetails =
              this.widgetDetails?.styles?.backgroundImage?.path;
          this.form.patchValue(this.widgetDetails);

          this.getCollections();
          this.getBrands();
          this.getCategories();

          if (this.widgetDetails?.collections) {
            this.selectedProductType = 'collections';
            this.widgetCollection.setValue(
              this.widgetDetails?.collections?._id
            );
          }

          if (this.widgetDetails?.productBrands) {
            this.selectedProductType = 'brands';
            this.widgetBrand.setValue(this.widgetDetails?.productBrands?._id);
          }

          if (this.widgetDetails?.productCategories) {
            this.selectedProductType = 'categories';
            this.widgetCategory.setValue(
              this.widgetDetails?.productCategories?._id
            );
          }

          if (this.widgetDetails?.isTimeBoundWidget == true) {
            this.form.patchValue({
              widgetStartTime:
                this.widgetDetails?.widgetStartTime?.split('T')[0],
              widgetEndTime: this.widgetDetails?.widgetEndTime?.split('T')[0],
            });
          }

          if (this.widgetDetails?.titleImage) {
            this.titleThumbnailDetails = this.widgetDetails?.titleImage?.path;
          }
          this.saleForm.patchValue(this.widgetDetails);
          if (this.widgetDetails?.saleThumbnail) {
            this.saleThumbnailDetails = this.widgetDetails?.saleThumbnail?.path;
            this.saleForm
              .get('saleThumbnail')
              ?.setValue(this.widgetDetails?.saleThumbnail?._id);
          }
          this.widgetDetails.collection
            ? this.widgetCollection.setValue(
              this.widgetDetails?.collection?._id
            )
            : null;

          if (this.widgetProductTypes.includes(this.widgetDetails.type)) {
            this.widgetDetails.products.length > 0
              ? (this.selectedProductType = 'products')
              : (this.selectedProductType = 'collections');
          }

          if (this.widgetDetails?.widgetType == 'hyperlinkhero') {
            this.hyperlinkheroForm.patchValue(this.widgetDetails);
            this.hyperLinkHeroThumbnail =
              this.widgetDetails?.hyperLinkThumbnail?.path;
          }

          if (this.widgetDetails?.widgetType == 'insight-hub') {
            this.insightHubForm.patchValue(this.widgetDetails);
            this.insightHubThumbnailSmall =
              this.widgetDetails?.insightHubThumbnailSmall?.path;
            this.insightHubThumbnailLarge =
              this.widgetDetails?.insightHubThumbnailLarge?.path;
          }

          if (this.widgetDetails?.widgetType == 'key-points-grid') {
            this.keyPoints = res?.result?.keyPoints
          }

          this.widgetDetails?.endDate
            ? this.saleForm
              .get('endDate')
              ?.setValue(new Date(this.widgetDetails?.endDate))
            : null;
          this.designForm.patchValue(this.widgetDetails?.styles);
          this.isWidgetLoaded = true;
          this.ChangeDetectorRef.markForCheck();
          if (
            ['motion-canvas', 'aurora-grid', 'aurora-slider'].includes(
              this.widgetDetails?.widgetType
            )
          ) {
            this.productsAdThumbnail = this.widgetDetails?.productsAdThumbnail;
            this.productAd?.setValue(this.widgetDetails?.productsAdThumbnail);
            this.productsAdRedirection?.setValue(
              this.widgetDetails?.productsAdRedirection
            );
          }
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }

  closeDesign() {
    this.designRef?.hide();
    this.widgetImages = [];
    this.widgetImagePreviewIndex = null;
    this.widgetImagePreview = null;
  }
  //Design ends here

  //Add widgets starts here
  openWidgets(template: TemplateRef<any>) {
    this.widgetsRef = this.BsModalService.show(template, {
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  focusWidget(widget: WidgetProps) {
    this.focusedWidget = widget;
  }

  closeWidgets() {
    this.widgetsRef?.hide();
  }

  addWidget(widget: WidgetProps | null) {
    if (!widget) return;

    this.HomeWidgetsService.addHomeWidget({
      index: this.widgetItems.length,
      widgetName: widget.title,
      widgetType: widget.type,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.screenLoad++;
          this.count++;
          this.isDraft = true;
          this.Toast.success(res?.message);
          this.getHomeWidgets();
          this.closeWidgets();
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }
  //Add widgets ends here

  getHomeWidgets() {
    this.HomeWidgetsService.homeWidgets().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetItems = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  getHomeDraftWidgets() {
    this.HomeWidgetsService.draftWidgets().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetItems = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  reorderWidgets() {
    let widgets = this.widgetItems.map((widget, index) => {
      return {
        widgetType: widget?.widgetType,
        refid: widget?.refid,
        index: index,
      };
    });

    this.HomeWidgetsService.reorderWidgets(this.count, {
      widgets: widgets,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.widgetItems = [];
          this.getHomeWidgets();
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }

  mediaTriggered(event: any) {
    this.widgetImages[this.widgetImagePreviewIndex] = {
      ...this.widgetImagePreview,
      url: event,
    };
    this.widgetImagePreview = this.widgetImages[this.widgetImagePreviewIndex];
    this.widgetImagePreviewIndex = null;
    this.widgetImagePreview = null;
    this.ChangeDetectorRef.markForCheck();
  }

  addMediaTriggered(event: any) {
    this.widgetImages.push({ url: event, title: '', redirection: '' });
    this.previewDetails = '';
    this.ChangeDetectorRef.markForCheck();
  }

  addWidgetDetails() {
    this.widgetImages[this.widgetImagePreviewIndex] = {
      ...this.widgetImages[this.widgetImagePreviewIndex],
      ...this.widgetForm.value,
    };
  }

  deleteWidgetImage(index: number, event: Event): void {
    event.stopPropagation();
    this.widgetImages.splice(index, 1);
    this.widgetImagePreviewIndex = null;
    this.widgetImagePreview = null;
  }

  getWidgetImagePreview(index: number) {
    this.widgetImagePreviewIndex = index;
    this.widgetImagePreview = this.widgetImages[index];
    this.previewDetails = this.widgetImagePreview.url
      ? this.widgetImagePreview.url?.path
      : '';
    this.ChangeDetectorRef.markForCheck();
    this.widgetForm.patchValue(this.widgetImagePreview);
  }

  productMediaTriggered(event: any, type: string) {
    type == 'cover'
      ? this.productForm.get('cover')?.setValue(event?._id)
      : this.productForm.get('thumbnail')?.setValue(event?._id);
  }

  //Update widgets starts here
  openUpdate(template: TemplateRef<any>, widget: any) {
    this.updateRef = this.BsModalService.show(template, {
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    this.getWidgetDetails(widget);
  }

  closeUpdate() {
    this.updateRef?.hide();
    this.widgetImages = [];
    this.widgetImagePreviewIndex = null;
    this.widgetImagePreview = null;
    this.form.reset();
    this.selectedProductType = 'products';
    this.widgetCollection.reset();
    this.widgetBrand.reset();
    this.widgetCategory.reset();
    this.brands = [];
    this.categories = [];
    this.collections = [];
    this.smartTileProducts = [];
    this.saleForm.reset();
    this.saleForm.get('saleButtonVisibility')?.setValue(true);
  }

  dropWidgetImages(event: any) {
    let items = [...this.widgetImages];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.widgetImages = [...items];
  }

  updateWidget(type?: string) {
    let widgetPayload = {
      ...this.form.value,
      refid: this.widgetDetails?.refid,
    };

    if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
      let widgetImages = [];
      for (let widgetImage of this.widgetImages) {
        widgetImages.push({ ...widgetImage, media: widgetImage?.url?._id });
      }
      widgetPayload['widgetImages'] = widgetImages;
    } else if (this.widgetDetails?.widgetType == 'blogs') {
      let blogItems = this.widgetBlogs?.map((widgetBlog: any) => widgetBlog._id)
      widgetPayload = { ...widgetPayload, blogs: blogItems };
    } else if (this.widgetDetails?.widgetType == 'testimonial-cards') {
      let widgetTestimonials = this.widgetTestimonials.map((testimonial: any) => testimonial?._id);
      widgetPayload['testimonials'] = widgetTestimonials;
    } else if (this.widgetDetails?.widgetType == 'sale-timer') {
      widgetPayload = {
        visibility: this.form.get('visibility')?.value,
        refid: this.widgetDetails?.refid,
        widgetType: this.widgetDetails?.widgetType,
        ...this.saleForm.value,
        ...this.form.value,
        startDate: this.saleForm.get('startDate')?.value
          ? this.saleForm.get('startDate')?.value
          : new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endDate: this.saleForm.get('endDate')?.value
          ? this.saleForm.get('endDate')?.value
          : new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      };
    } else if (this.widgetProductTypes.includes(this.widgetDetails.widgetType)) {
      widgetPayload = {
        visibility: this.form.get('visibility')?.value,
        refid: this.widgetDetails?.refid,
        ...this.form.value,
        widgetType: this.widgetDetails?.widgetType,
        products: this.widgetCollection.value
          ? []
          : this.smartTileProducts.map((product) => product?._id),
        collections: this.widgetCollection.value
          ? this.widgetCollection.value
          : null,
        productBrands: this.widgetBrand.value ? this.widgetBrand.value : null,
        productCategories: this.widgetCategory.value
          ? this.widgetCategory.value
          : null,
      };
    }

    type == 'styles' ? (widgetPayload['styles'] = this.designForm.value) : null;

    if (['motion-canvas', 'aurora-grid', 'aurora-slider'].includes(this.widgetDetails?.widgetType)) {
      widgetPayload['productsAdThumbnail'] = this.productAd.value ? this.productAd.value : null;
      widgetPayload['productsAdRedirection'] = this.productsAdRedirection.value;
    }

    if (this.widgetDetails?.widgetType == 'hyperlinkhero') {
      widgetPayload = { ...widgetPayload, ...this.hyperlinkheroForm.value };
    }

    if (this.widgetDetails?.widgetType == 'insight-hub') {
      widgetPayload = { ...widgetPayload, ...this.insightHubForm.value };
    }

    if (this.widgetDetails?.widgetType == 'key-points-grid') {
      widgetPayload = { ...widgetPayload, keyPoints: this.keyPoints };
    }

    this.HomeWidgetsService.updateHomeWidget(widgetPayload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getHomeWidgets();
          this.count++;
          this.isDraft = true;
          this.tileProductsInput.setValue('');
          this.tileProducts = [];
          this.smartTileProducts = [];
          this.widgetImages = [];
          this.screenLoad++;
          this.widgetImagePreviewIndex = null;
          this.widgetImagePreview = null;
          this.keyPointForm.reset();
          this.keyPointThumbnail = '';
          this.form.reset();
          this.widgetForm.patchValue({
            title: '',
            redirection: '',
            redirectionType: '',
            buttonText: '',
            buttonRedirection: '',
            redirectionQuery: '',
          });
          this.testimonialKeyword.setValue('');
          this.widgetTestimonials = [];
          this.designForm.patchValue({
            backgroundColor: '#ffffff',
            backgroundImage: '',
            marginLeft: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            borderRadius: 0,
            borderWidth: 0,
          });
          this.closeUpdate();
          this.closeDesign();
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }
  //Update widgets ends here

  //Delete widgets starts here
  openConfirmation(template: TemplateRef<any>, widget: any) {
    this.confirmedWidget = widget;
    this.confirmRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeConfirmation() {
    this.confirmRef?.hide();
    this.confirmedWidget = null;
  }

  deleteWidget() {
    this.HomeWidgetsService.deleteWidget(this.confirmedWidget?.refid).subscribe(
      {
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getHomeWidgets();
            this.closeConfirmation();
            this.count++;
            this.screenLoad++;
            this.isDraft = true;
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.Toast.error(res?.message);
          }
        },
        error: (err: any) => {
          this.Toast.error(err?.error?.message);
        },
      }
    );
  }
  //Delete widgets ends here

  //Duplicate widgtes starts here
  openDuplication(template: TemplateRef<any>, widget: any) {
    this.duplicatedWidget = widget;
    this.duplicateRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  closeDuplication() {
    this.duplicateRef?.hide();
    this.duplicatedWidget = null;
  }

  duplicateWidget() {
    this.HomeWidgetsService.duplicateHomeWidget({
      widget: this.duplicatedWidget?.refid,
      index: this.widgetItems.length,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getHomeWidgets();
          this.closeDuplication();
          this.count++;
          this.screenLoad++;
          this.isDraft = true;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }
  //Duplicate widgets ends here

  drop(event: CdkDragDrop<string[]>) {
    const existingWidgets = [...this.widgetItems]; // create a copy of the array
    moveItemInArray(this.widgetItems, event.previousIndex, event.currentIndex);

    const isArraySuffled = JSON.stringify(this.widgetItems) !== JSON.stringify(existingWidgets);
    const isWidgetDeleted = this.widgetItems.length < existingWidgets.length;
    const isWidgetAdded = this.widgetItems.length > existingWidgets.length;

    if (isArraySuffled || isWidgetDeleted || isWidgetAdded) {
      this.reorderWidgets();
      this.isDraft = true;
      this.screenLoad++;
      this.count++;
    }
  }

  //Title image
  onTitleImageTriggered(event: any) {
    this.titleThumbnailDetails = event.path;
    this.form.get('titleImage')?.setValue(event?._id);
  }

  removeTitleImage() {
    this.titleThumbnailDetails = '';
    this.form.get('titleImage')?.setValue(null);
  }
  //Title image

  //hyperlink hero
  onHyperlinkHeroTriggered(event: any) {
    this.hyperlinkheroForm.get('hyperLinkThumbnail')?.setValue(event?._id);
    this.hyperLinkHeroThumbnail = event.path;
  }

  removeHyperlinkHeroThumbnail() {
    this.hyperlinkheroForm.get('hyperLinkThumbnail')?.setValue(null);
    this.hyperLinkHeroThumbnail = '';
  }
  //hyperlink hero

  searchWidgets(event: any) {
    this.homeWidgets = this.widgets.filter((widget: any) =>
      widget.title
        .toLowerCase()
        .startsWith(this.homeWidgetKeyword?.value.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.homeWidgets = this.widgets;
    this.widgets = this.widgets.sort((a: any, b: any) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }

      return 0;
    });

    this.hyperlinkheroForm = new FormGroup({
      hyperlinkTitle: new FormControl(''),
      hyperLinkCaption: new FormControl(''),
      hyperLinkDescription: new FormControl(''),
      hyperLinkButton: new FormControl(''),
      hyperLinkRedirection: new FormControl(''),
      hyperLinkThumbnail: new FormControl(null),
      alignment: new FormControl('left'),
    });

    this.insightHubForm = new FormGroup({
      insightHubTitle: new FormControl(''),
      insightHubDescription: new FormControl(''),
      insightHubButton: new FormControl(''),
      insightHubRedirection: new FormControl(''),
      insightHubThumbnailSmall: new FormControl(null),
      insightHubThumbnailLarge: new FormControl(null),
    });

    this.keyPointForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      icon: new FormControl(''),
    })

    this.focusedWidget = this.widgets[0];
    this.getHomeWidgets();
    this.form = new FormGroup({
      visibility: new FormControl('all'),
      buttonVisibility: new FormControl(),
      title: new FormControl(''),
      titleImage: new FormControl(null),
      description: new FormControl(''),
      html: new FormControl(''),
      video: new FormControl(''),
      view: new FormControl('grid'),
      textTwirlTitle: new FormControl(''),
      isReversed: new FormControl(false),
      textTwirlDescription: new FormControl(''),
      gridsPerCount: new FormGroup({
        mobile: new FormControl(2, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        tablet: new FormControl(3, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        desktop: new FormControl(4, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      }),
      spacing: new FormGroup({
        mobile: new FormControl(2, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        tablet: new FormControl(3, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        desktop: new FormControl(4, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      }),
      pagination: new FormGroup({
        desktop: new FormControl(true),
        mobile: new FormControl(true),
      }),
      sliderButtons: new FormGroup({
        desktop: new FormControl(true),
        mobile: new FormControl(true),
      }),

      isAutoScroll: new FormControl(false),

      isTimeBoundWidget: new FormControl(false),
      widgetStartTime: new FormControl(''),
      widgetEndTime: new FormControl(''),

      sliderButtonPosition: new FormControl('relative'),
      paginationPosition: new FormControl('relative'),
      sortOptions: new FormControl('popularity'),
      hovering: new FormGroup({
        desktop: new FormControl(false),
        mobile: new FormControl(false),
      }),
      buttonText: new FormControl(''),
      buttonLink: new FormControl(''),
      slidesPerCount: new FormGroup({
        mobile: new FormControl(2, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        tablet: new FormControl(3, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
        desktop: new FormControl(4, [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      }),
    });

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          environment.base = res.result.baseS3Url;
          this.base = environment.base;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });

    this.saleForm = new FormGroup({
      saleTitle: new FormControl(''),
      saleButtonText: new FormControl(''),
      saleButtonLink: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      saleDescription: new FormControl(''),
      saleButtonVisibility: new FormControl('true'),
      saleThumbnail: new FormControl(null),
    });

    this.widgetForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      button: new FormControl(''),
      redirection: new FormControl(''),
      customStyles: new FormControl(''),
      redirectionType: new FormControl(''),
      buttonText: new FormControl(''),
      buttonRedirection: new FormControl(''),
      productsAdThumbnail: new FormControl(null),
      productsAdRedirection: new FormControl(''),
      redirectionQuery: new FormControl(''),
    });

    this.designForm = new FormGroup({
      marginLeft: new FormControl(0),
      marginRight: new FormControl(0),
      marginTop: new FormControl(0),
      marginBottom: new FormControl(0),
      elevation: new FormControl(0),
      backgroundColor: new FormControl('#ffffff'),
      backgroundImage: new FormControl(''),
      paddingLeft: new FormControl(0),
      paddingRight: new FormControl(0),
      paddingTop: new FormControl(0),
      paddingBottom: new FormControl(0),
      borderRadius: new FormControl(0),
      borderWidth: new FormControl(0),
      borderColor: new FormControl('#ffffff'),
    });
  }

  onBackgroundTriggered(event: any) {
    this.designForm.get('backgroundImage')?.setValue(event?._id);
  }

  onRemoveBackground() {
    this.designForm.get('backgroundImage')?.setValue(null);
    this.backgroundDetails = '';
  }

  onSaleThumbnailTriggered(event: any) {
    this.saleForm.get('saleThumbnail')?.setValue(event?._id);
  }

  removeSaleThumbnail() {
    this.saleForm.get('saleThumbnail')?.setValue(null);
    this.saleThumbnailDetails = '';
  }

  onTimeBoundSwitch(event: { toggleState: boolean; switchId: string }) {
    this.form.get('isTimeBoundWidget')?.setValue(event.toggleState);
  }

  customSearchFn = (term: string, item: any) => {
    term = term.toLowerCase();
    // Search in both name and SKU
    return item.searchText.includes(term);
  }

  getProducts() {
    this.ProductService.getActiveProduct().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          // Modify the products array to include a searchText and displayText property
          this.products = res?.result.map((product: any) => ({
            ...product,
            slug: product.slug || product._id, // Fallback to ID if slug doesn't exist
            searchText: `${product.name} ${product.sku}`.toLowerCase(), // Combined search text
            displayText: `${product.name} (${product.sku})` // Combined display text
          }));

          // If there's a selected product, update the form
          if (this.widgetDetails?.redirection) {
            const productSlug = this.widgetDetails.redirection.split('/p/')[1];
            if (productSlug) {
              this.redirectionQuery.setValue(productSlug);
            }
          }

          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }

  toggleProducts(productDetails: any) {
    if (this.isIdInArray(productDetails?._id, this.widgetProducts)) {
      this.widgetProducts = this.widgetProducts.filter(
        (item) => item?._id !== productDetails?._id
      );
    } else {
      this.widgetProducts.push(productDetails);
    }
  }

  isIdInArray(idToCheck: string, array: any[]) {
    return array.some((item) => item?._id === idToCheck);
  }

  getBlogs(query: string) {
    this.BlogService.blogs({ keyword: query, page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blogs = res?.result?.data;
          if (res.result.data && res.result.data.length > 0) {
            res.result.data.map((blog: any) => {
              this.blogsMap[blog.slug] = blog;
            })
          }
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  openHistory(template: TemplateRef<any>) {
    this.historyRef = this.BsModalService.show(template, {
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getCollections() {
    this.CollectionService.getActiveCollection().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.collections = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }

  getCategories() {
    this.CategoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.categories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  getCatalogPages() {
    this.CatalogService.getCatalogs().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.catalogPages = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  getBrands() {
    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  getStaticPages() {
    this.StaticPageService.active().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.staticPages = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  switchToggled(event: { switchId: string; toggleState: boolean }) {
    switch (event.switchId) {
      case 'desktop-pagination':
        this.form.get('pagination.desktop')?.setValue(event.toggleState);
        break;
      case 'mobile-pagination':
        this.form.get('pagination.mobile')?.setValue(event.toggleState);
        break;
      case 'desktop-slider':
        this.form.get('sliderButtons.desktop')?.setValue(event.toggleState);
        break;
      case 'mobile-slider':
        this.form.get('sliderButtons.mobile')?.setValue(event.toggleState);
        break;
      case 'desktop-hover':
        this.form.get('hovering.desktop')?.setValue(event.toggleState);
        break;
      case 'mobile-hover':
        this.form.get('hovering.mobile')?.setValue(event.toggleState);
        break;
      case 'reverse-widget':
        this.form.get('isReversed')?.setValue(event.toggleState);
        break;
    }
  }
}
