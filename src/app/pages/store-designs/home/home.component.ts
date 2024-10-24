import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeWidgetsService } from 'src/app/includes/services/home-widgets.service';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
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

interface WidgetProps {
  title: string;
  type: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  widgets: Array<WidgetProps> = [
    { title: 'Magestic Mosaic', type: 'magestic-mosaic', icon: 'assets/widgets/rush-lake.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Glamour Glaze', type: 'glamour-glaze', icon: 'assets/widgets/volta-lake.png', description: 'The widget can be used to showcase new brands or existing brands.The widget contains two section with image and description section on either side and vice-versa.The description box has a black border, with heading, subheading and button.' },
    { title: 'Dazzle Design', type: 'dazzle-design', icon: 'assets/widgets/1x4.png', description: 'The following widget can be used to show collection of categories.The following widget is a collection of card where it has one main card and other 4 cards.The cards contain an image and decrotaive text which is center aligned with the image.' },
    { title: 'Celestial Canvas', type: 'celestial-canvas', icon: 'assets/widgets/celestial-canvas.png', description: 'This widget is used to showcase banner carousel and video' },
    { title: 'Blogs', type: 'blogs', icon: 'assets/widgets/blogs.png', description: 'The following widget can be used to display the recent blogs, or categories.The widget contains image and white transluscent descriptive box.The description box contain text and button.' },
    { title: 'Custom HTML', type: 'html', icon: 'assets/widgets/custom-html.png', description: '' },
    { title: 'Image Slider', type: 'image-slider', icon: 'assets/widgets/image-slider.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Video', type: 'video', icon: 'assets/widgets/video.png', description: 'This widget is used to showcase full width video only.' },
    { title: 'Motion Canvas', type: 'motion-canvas', icon: 'assets/widgets/regal-rolls.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Products', type: 'products', icon: 'assets/widgets/blogs.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Noble Nodes', type: 'noble-nodes', icon: 'assets/widgets/noble-nodes.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Prime Plates', type: 'prime-plates', icon: 'assets/widgets/prime-plates.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Elite Elements', type: 'elite-elements', icon: 'assets/widgets/elite-elements.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Sale Timer', type: 'sale-timer', icon: 'assets/widgets/sale-timer.png', description: 'This widget is used to showcase a sale timer.' },
    { title: 'Twin Towers', type: 'twin-towers', icon: 'assets/widgets/twin-towers.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Slider Spotlight', type: 'slider-spotlight', icon: 'assets/widgets/slider-spotlight.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Trending Teasers', type: 'trending-teasers', icon: 'assets/widgets/trending-teasers.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Smart Tiles', type: 'smart-tiles', icon: 'assets/widgets/smart-tiles.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Stellar Selections', type: 'stellar-selections', icon: 'assets/widgets/stellar-selections.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Testimonials', type: 'testimonial-cards', icon: 'assets/widgets/image-slider.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Radiant Rectangles', type: 'radiant-rectangles', icon: 'assets/widgets/radiant-rectangles.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Quad Squares', type: 'quad-square', icon: 'assets/widgets/quad-sqaure.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Insight Hub', type: 'insight-hub', icon: 'assets/widgets/store-chronicles.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Delivery Timer', type: 'delivery-timer', icon: 'assets/widgets/delivery-timer.png', description: 'The following widget can be used to run a delivery timer with custom designs' },
    { title: 'Hyper Link Hero', type: 'hyperlinkhero', icon: 'assets/widgets/picture-palette.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Aurora Grid', type: 'aurora-grid', icon: 'assets/widgets/aurora-grid.png', description: 'The following widget can be used to run a delivery timer with custom designs' },
    { title: 'Aurora Slider', type: 'aurora-slider', icon: 'assets/widgets/aurora-slider.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Text Twirl', type: 'text-twirl', icon: 'assets/widgets/text-twirl.png', description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.' },
  ];
  homeWidgets: Array<any> = []
  homeWidgetKeyword: FormControl = new FormControl("", Validators.required)
  today: Date = new Date()
  widgetItems: Array<any> = []
  focusedWidget: WidgetProps = { title: '', type: '', icon: '', description: '' }
  widgetsRef?: BsModalRef;
  confirmedWidget: any;
  confirmRef?: BsModalRef;
  duplicateRef?: any
  duplicatedWidget: any
  updateRef?: BsModalRef
  widgetDetails: any;
  form: FormGroup;
  widgetForm: FormGroup
  widgetImages: Array<any> = []
  base: string = '';
  previewDetails: string = ''
  widgetImagePreview: any;
  widgetImagePreviewIndex: any;
  widgetPreviewDetails: any;
  smartTileProducts: Array<any> = [] // Smart tiles widgets
  tileProductsInput: FormControl = new FormControl("", Validators.required); // Smart tiles widgets
  tileProducts: Array<any> = [] // Smart tiles widgets
  widgetProductTypes: Array<any> = ["smart-tiles", 'aurora-slider', "aurora-grid", "products", "motion-canvas"]
  widgetImageTypes: Array<any> = [
    "image-slider", "radiant-rectangles",
    "quad-square", "prime-plates",
    "elite-elements", "noble-nodes",
    "classic-banners", "magestic-mosaic",
    "glamour-glaze", "dazzle-design",
    "grandeur-gallery", "celestial-canvas",
    "twin-towers", "stellar-selections",
    "slider-spotlight", "trending-teasers",
    "text-twirl"
  ]
  isWidgetLoaded: boolean = false
  redirectionItems: Array<any> = [
    { key: "None", value: "" },
    { key: "Open category products", value: "category" },
    { key: "Open all products", value: "all-products" },
    { key: "Open brand products", value: "brand" },
    { key: "Open collection products", value: "collection" },
    { key: "Open product details", value: "products" },
    { key: "Open catalog page", value: "catalog" },
    { key: "Open blogs", value: "blogs" },
    { key: "Open weblink", value: "web-links" },
    { key: "Open static page", value: "static-pages" },
    { key: "Open CMS page", value: "cms-pages" },
    { key: "Search filters", value: "search-filters" },
  ]
  screenLoad: number = 0
  hyperlinkheroForm: FormGroup
  hyperLinkHeroThumbnail: string = ''
  staticPages: Array<any> = []
  cmsPages: Array<any> = [
    { title: 'FAQs', value: '/faqs' },
    { title: 'Stores', value: '/stores' },
    { title: 'Brands', value: '/brands' },
    { title: 'Category', value: '/categories' },
    { title: 'Reviews', value: '/reviews' },
    { title: 'Contact Us', value: '/contact-us' },
  ]
  searchRedirections: Array<string> = ["category", "brands", "collection", "products", "catalog", "blogs"]
  blogs: Array<any> = []
  widgetBlogs: Array<any> = []
  redirections: Array<any> = []
  productForm: FormGroup;
  productKeyword: FormControl = new FormControl("", Validators.required);
  products: Array<any> = []
  widgetProducts: Array<any> = []
  historyRef?: BsModalRef
  collectionCoverDetails: string = ''
  collectionThumbnailDetails: string = ''
  designRef?: BsModalRef
  designForm: FormGroup
  insightHubForm: FormGroup;
  backgroundDetails: string
  isDraft: boolean = false
  saleForm: FormGroup
  device: string = 'desktop'
  count: number = 0
  saleThumbnailDetails: string = ''
  hiddenHeaderItems: Array<string> = ['sale-timer', 'hyperlinkhero', 'insight-hub']
  selectedProductType: string = 'products';

  widgetCollection: FormControl = new FormControl("")
  widgetBrand: FormControl = new FormControl("")
  widgetCategory: FormControl = new FormControl("")

  redirectionQuery: FormControl = new FormControl("")
  redirectionDetails: any
  spotlightSliders: Array<any> = []
  settings: any = {}
  collections: Array<any> = []
  categories: Array<any> = []
  brands: Array<any> = []
  testimonialKeyword: FormControl = new FormControl("", Validators.required);
  testimonials: Array<any> = []
  widgetTestimonials: Array<any> = []
  titleThumbnailDetails: string = ''
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
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  productsAdThumbnail: string
  productAd: FormControl = new FormControl(null)
  productsAdRedirection: FormControl = new FormControl("")
  insightHubThumbnailSmall: string = ''
  insightHubThumbnailLarge: string = ''
  catalogPages: Array<any> = []

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

  getDomain(domain: string) {
    return domain.endsWith('/') ? domain.slice(0, -1) : domain
  }

  //Motion canvas
  toggleMotionCanvasThumbnail(event: any) {
    this.productAd?.setValue(event.path)
    this.productsAdThumbnail = event.path
  }

  removeMotionCanvasThumbnail() {
    this.productAd?.setValue(null)
    this.productsAdThumbnail = ''
  }
  //Motion canvas

  //Testimonial widget operations
  getTestimonials() {
    if (!this.testimonialKeyword.valid) {
      this.testimonials = []
      return
    }

    this.TestimonialService.searchTestimonials({ keyword: this.testimonialKeyword.value, isActive: true }, 1, 20).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.testimonials = res?.result?.data
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {

      }
    })
  }

  toggleTestimonials(testimonial: any) {
    let isExists = this.widgetTestimonials.some((item: any) => item._id == testimonial._id)
    if (isExists) {
      this.widgetTestimonials = this.widgetTestimonials.filter(item => item._id != testimonial._id)
    } else {
      this.widgetTestimonials.push(testimonial)
    }
  }
  //Testimonial widget operations

  //Smart tiles widgets
  getTileProducts() {
    if (!this.tileProductsInput.valid) {
      this.tileProducts = []
      return
    }

    this.ProductService.searchProducts({
      name: this.tileProductsInput.value, page: 1, limit: 100,
      isActive: true, isVisible: '0'
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.tileProducts = res?.result?.data
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
      }
    })
  }

  toggleTileProducts(productDetails: any) {
    let isExists = this.smartTileProducts.some((item: any) => item._id == productDetails._id)
    if (isExists) {
      this.smartTileProducts = this.smartTileProducts.filter(item => item._id != productDetails._id)
    } else {
      if (this.smartTileProducts.length >= 20) {
        return this.Toast.error('Maximum limit reachced')
      }
      this.smartTileProducts.push(productDetails)
    }
    this.widgetCollection.setValue("")
  }

  isTileProductExists(productDetails: any) {
    return this.smartTileProducts.some((item: any) => item._id == productDetails._id) ? true : false
  }
  //Smart tiles widgets

  //Insight hub
  handleInsightHubThumbnail(event: any, type: string) {
    if (type == 'small') {
      this.insightHubForm.get('insightHubThumbnailSmall')?.setValue(event._id)
      this.insightHubThumbnailSmall = event.path
    } else {
      this.insightHubForm.get('insightHubThumbnailLarge')?.setValue(event._id)
      this.insightHubThumbnailLarge = event.path
    }
  }

  removeInsightHubThumbnail(type: string) {
    if (type == 'small') {
      this.insightHubForm.get('insightHubThumbnailSmall')?.setValue(null)
      this.insightHubThumbnailSmall = ''
    } else {
      this.insightHubForm.get('insightHubThumbnailLarge')?.setValue(null)
      this.insightHubThumbnailLarge = ''
    }
  }
  //Insight hub

  //Redirections
  onRedirectionSelected() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.getBlogs(this.redirectionQuery.value)
        break
      case 'category':
        this.getCategories()
        break
      case 'brand':
        this.getBrands()
        break
      case 'catalog':
        this.getCatalogPages()
        break
      case 'products':
        this.getProducts()
        break
      case 'collection':
        this.getCollections()
        break
      case 'static-pages':
        this.getStaticPages()
        break
      case 'all-products':
        this.widgetForm.get('redirection')?.setValue("/products")
        this.redirectionQuery.setValue("/products")
        break
    }
  }

  redirectionQueryChange() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.getBlogs(this.redirectionQuery.value)
        break
    }
  }

  toggleRedirectionDetails(redirectionDetails: any) {
    this.redirectionDetails = redirectionDetails
    this.blogs = []
    this.brands = []
    this.categories = []
    this.redirectionQuery.setValue("")
  }

  continueRedirectionQuery() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.widgetForm.get('redirection')?.setValue("/blogs/" + this.redirectionDetails.slug)
        break
      case 'static-pages':
        this.widgetForm.get('redirection')?.setValue('/pages/' + this.redirectionQuery.value)
        break
      case 'cms-pages':
        this.widgetForm.get('redirection')?.setValue(this.redirectionQuery.value)
        break
      case 'search-filters':
        this.widgetForm.get('redirection')?.setValue("/products" + this.redirectionQuery.value)
        break
      case 'category':
        this.widgetForm.get('redirection')?.setValue("/products/" + this.redirectionQuery.value)
        break
      case 'catalog':
        this.widgetForm.get('redirection')?.setValue("/catalogs/" + this.redirectionQuery.value)
        break
      case 'brand':
        this.widgetForm.get('redirection')?.setValue("/brands/" + this.redirectionQuery.value)
        break
      case 'products':
        this.widgetForm.get('redirection')?.setValue("/p/" + this.redirectionQuery.value)
        break
      case 'collection':
        this.widgetForm.get('redirection')?.setValue("/c/" + this.redirectionQuery.value)
        break
    }

    this.addWidgetDetails()
    this.redirectionQuery.setValue("")
    this.widgetImagePreviewIndex = null
    this.widgetImagePreview = null
    this.widgetForm.reset()
    this.widgetForm.patchValue({ redirectionType: '' })
  }
  //Redirections

  //Toggle device
  deviceToggled(event: string) {
    this.device = event;
    this.ChangeDetectorRef.markForCheck()
  }

  toggleProductSelection(type: string) {
    this.selectedProductType = type
    switch (type) {
      case 'collections':
        this.getCollections()
        break
      case 'brands':
        this.getBrands()
        break
      case 'categories':
        this.getCategories()
        break
    }
  }
  //Toggle device

  //Design starts here
  openDesign(template: TemplateRef<any>, widget: any) {
    this.designRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    this.getWidgetDetails(widget)
  }

  isExpired(date: string) {
    return new Date(date) < new Date()
  }

  isScheduled(date: string) {
    return new Date(date) > new Date()
  }

  isRunning(startDate: string, endDate: string) {
    return new Date(startDate) < new Date() && new Date(endDate) > new Date()
  }

  getWidgetDetails(widget: any) {
    this.isWidgetLoaded = false
    this.HomeWidgetsService.homeWidgetDetails(widget?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetDetails = res?.result;
          if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
            for (let widgetImage of this.widgetDetails?.widgetImages) {
              this.widgetImages.push({
                url: widgetImage?.media,
                title: widgetImage?.title,
                description: widgetImage?.description,
                button: widgetImage?.button,
                redirection: widgetImage?.redirection
              })
            }
            this.widgetImagePreview = this.widgetImages[0]
            this.widgetImagePreviewIndex = 0
            this.previewDetails = this.widgetImagePreview?.url ? this.widgetImagePreview?.url?.path : ""
            this.widgetForm.patchValue(this.widgetImagePreview)
          }
          if (this.widgetDetails?.widgetType == 'blog') {
            this.widgetBlogs = this.widgetDetails?.blogs
            this.getBlogs('')
          }
          if (this.widgetDetails?.widgetType == 'testimonial-cards') {
            this.widgetTestimonials = this.widgetDetails?.testimonials
          }
          ['smart-tiles', 'products', 'motion-canvas', 'aurora-grid', 'aurora-slider']?.includes(this.widgetDetails?.widgetType) ? this.smartTileProducts = [...this.widgetDetails?.products] : null
          if (this.widgetDetails?.styles?.backgroundImage) this.backgroundDetails = this.widgetDetails?.styles?.backgroundImage?.path
          this.form.patchValue(this.widgetDetails);

          this.getCollections()
          this.getBrands()
          this.getCategories()

          if (this.widgetDetails?.collections) {
            this.selectedProductType = 'collections'
            this.widgetCollection.setValue(this.widgetDetails?.collections?._id)
          }

          if (this.widgetDetails?.productBrands) {
            this.selectedProductType = 'brands'
            this.widgetBrand.setValue(this.widgetDetails?.productBrands?._id)
          }

          if (this.widgetDetails?.productCategories) {
            this.selectedProductType = 'categories'
            this.widgetCategory.setValue(this.widgetDetails?.productCategories?._id)
          }

          if (this.widgetDetails?.isTimeBoundWidget == true) {
            this.form.patchValue({
              widgetStartTime: this.widgetDetails?.widgetStartTime?.split('T')[0],
              widgetEndTime: this.widgetDetails?.widgetEndTime?.split('T')[0],
            })
          }

          if (this.widgetDetails?.titleImage) {
            this.titleThumbnailDetails = this.widgetDetails?.titleImage?.path
          }
          this.saleForm.patchValue(this.widgetDetails)
          if (this.widgetDetails?.saleThumbnail) {
            this.saleThumbnailDetails = this.widgetDetails?.saleThumbnail?.path
            this.saleForm.get("saleThumbnail")?.setValue(this.widgetDetails?.saleThumbnail?._id)
          }
          this.widgetDetails.collection ? this.widgetCollection.setValue(this.widgetDetails?.collection?._id) : null
          if (this.widgetProductTypes.includes(this.widgetDetails.type)) {
            this.widgetDetails.products.length > 0 ? 
            this.selectedProductType = 'products' : 
            this.selectedProductType = 'collections'
          }
          if (this.widgetDetails?.widgetType == 'hyperlinkhero') {
            this.hyperlinkheroForm.patchValue(this.widgetDetails)
            this.hyperLinkHeroThumbnail = this.widgetDetails?.hyperLinkThumbnail?.path
          }
          if (this.widgetDetails?.widgetType == 'insight-hub') {
            this.insightHubForm.patchValue(this.widgetDetails)
            this.insightHubThumbnailSmall = this.widgetDetails?.insightHubThumbnailSmall?.path
            this.insightHubThumbnailLarge = this.widgetDetails?.insightHubThumbnailLarge?.path
          }
          this.widgetDetails?.endDate ? this.saleForm.get("endDate")?.setValue(new Date(this.widgetDetails?.endDate)) : null
          this.designForm.patchValue(this.widgetDetails?.styles)
          this.isWidgetLoaded = true
          this.ChangeDetectorRef.markForCheck()
          if (['motion-canvas', 'aurora-grid', 'aurora-slider'].includes(this.widgetDetails?.widgetType)) {
            this.productsAdThumbnail = this.widgetDetails?.productsAdThumbnail
            this.productAd?.setValue(this.widgetDetails?.productsAdThumbnail)
            this.productsAdRedirection?.setValue(this.widgetDetails?.productsAdRedirection)
          }
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  closeDesign() {
    this.designRef?.hide();
    this.widgetImages = []
    this.widgetImagePreviewIndex = null
    this.widgetImagePreview = null
  }
  //Design ends here

  //Add widgets starts here
  openWidgets(template: TemplateRef<any>) {
    this.widgetsRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
  }

  focusWidget(widget: WidgetProps) {
    this.focusedWidget = widget;
  }

  closeWidgets() {
    this.widgetsRef?.hide();
  }

  addWidget(widget: WidgetProps) {
    this.HomeWidgetsService.addHomeWidget({
      index: this.widgetItems.length, widgetName: widget.title, widgetType: widget.type
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.screenLoad++
          this.count++
          this.isDraft = true
          this.Toast.success(res?.message)
          this.getHomeWidgets()
          this.closeWidgets()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Add widgets ends here

  getHomeWidgets() {
    this.HomeWidgetsService.homeWidgets().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetItems = res?.result;
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getHomeDraftWidgets() {
    this.HomeWidgetsService.draftWidgets().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetItems = res?.result;
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  reorderWidgets() {
    let widgets = this.widgetItems.map((widget, index) => {
      return { widgetType: widget?.widgetType, refid: widget?.refid, index: index }
    })

    this.HomeWidgetsService.reorderWidgets(this.count, { widgets: widgets }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.widgetItems = []
          this.getHomeWidgets()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  mediaTriggered(event: any) {
    this.widgetImages[this.widgetImagePreviewIndex] = { ...this.widgetImagePreview, url: event }
    this.widgetImagePreview = this.widgetImages[this.widgetImagePreviewIndex]
    this.ChangeDetectorRef.markForCheck()
  }

  addMediaTriggered(event: any) {
    this.widgetImages.push({ url: event, title: "", redirection: "" })
    this.previewDetails = ""
    this.ChangeDetectorRef.markForCheck()
  }

  addWidgetDetails() {
    this.widgetImages[this.widgetImagePreviewIndex] = { ...this.widgetImages[this.widgetImagePreviewIndex], ...this.widgetForm.value }
  }

  deleteWidgetImage(index: number, event: Event): void {
    event.stopPropagation()
    this.widgetImages.splice(index, 1)
  }

  getWidgetImagePreview(index: number) {
    this.widgetImagePreviewIndex = index
    this.widgetImagePreview = this.widgetImages[index]
    this.previewDetails = this.widgetImagePreview.url ? this.widgetImagePreview.url?.path : ""
    this.ChangeDetectorRef.markForCheck()
    this.widgetForm.patchValue(this.widgetImagePreview)
  }

  productMediaTriggered(event: any, type: string) {
    type == "cover" ? this.productForm.get("cover")?.setValue(event._id) : this.productForm.get("thumbnail")?.setValue(event._id)
  }

  //Update widgets starts here
  openUpdate(template: TemplateRef<any>, widget: any) {
    this.updateRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
    this.getWidgetDetails(widget)
  }

  closeUpdate() {
    this.updateRef?.hide();
    this.widgetImages = []
    this.widgetImagePreviewIndex = null
    this.widgetImagePreview = null
    this.form.reset()
    this.selectedProductType = 'products'
    this.widgetCollection.reset()
    this.widgetBrand.reset()  
    this.widgetCategory.reset()
    this.saleForm.reset()
    this.saleForm.get('saleButtonVisibility')?.setValue(true)
  }

  dropWidgetImages(event: any) {
    let items = [...this.widgetImages]
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.widgetImages = [...items]
  }

  updateWidget(type?: string) {
    let widgetPayload = { ...this.form.value, refid: this.widgetDetails?.refid }

    if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
      let widgetImages = []
      for (let widgetImage of this.widgetImages) {
        widgetImages.push({ ...widgetImage, media: widgetImage?.url?._id })
      }
      widgetPayload['widgetImages'] = widgetImages
    } else if (this.widgetDetails?.widgetType == 'blogs') {
      let widgetBlogs = []
    } else if (this.widgetDetails?.widgetType == 'testimonial-cards') {
      let widgetTestimonials = this.widgetTestimonials.map((testimonial: any) => testimonial._id)
      widgetPayload['testimonials'] = widgetTestimonials
    } else if (this.widgetDetails?.widgetType == 'sale-timer') {
      widgetPayload = {
        visibility: this.form.get("visibility")?.value,
        refid: this.widgetDetails?.refid,
        widgetType: this.widgetDetails?.widgetType,
        ...this.saleForm.value,
        ...this.form.value,
        startDate: this.saleForm.get("startDate")?.value ?
          this.saleForm.get('startDate')?.value :
          new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endDate: this.saleForm.get("endDate")?.value ?
          this.saleForm.get("endDate")?.value :
          new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      }
    } else if (this.widgetProductTypes.includes(this.widgetDetails.widgetType)) {
      widgetPayload = {
        visibility: this.form.get("visibility")?.value,
        refid: this.widgetDetails?.refid,
        ...this.form.value,
        widgetType: this.widgetDetails?.widgetType,
        products: this.widgetCollection.value ? [] : this.smartTileProducts.map((product) => product?._id),
        collections: this.widgetCollection.value ? this.widgetCollection.value : null,
        productBrands: this.widgetBrand.value ? this.widgetBrand.value : null,
        productCategories: this.widgetCategory.value ? this.widgetCategory.value : null
      }
    }

    type == 'styles' ? widgetPayload['styles'] = this.designForm.value : null

    if (['motion-canvas', 'aurora-grid', 'aurora-slider'].includes(this.widgetDetails?.widgetType)) {
      widgetPayload['productsAdThumbnail'] = this.productAd.value ? this.productAd.value : null
      widgetPayload['productsAdRedirection'] = this.productsAdRedirection.value
    }

    if (this.widgetDetails?.widgetType == 'hyperlinkhero') {
      widgetPayload = { ...widgetPayload, ...this.hyperlinkheroForm.value }
    }

    if (this.widgetDetails?.widgetType == 'insight-hub') {
      widgetPayload = { ...widgetPayload, ...this.insightHubForm.value }
    }

    this.HomeWidgetsService.updateHomeWidget(widgetPayload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getHomeWidgets()
          this.count++
          this.isDraft = true
          this.tileProductsInput.setValue('')
          this.tileProducts = []
          this.smartTileProducts = []
          this.widgetImages = []
          this.screenLoad++
          this.widgetImagePreviewIndex = null
          this.widgetImagePreview = null
          this.form.reset()
          this.widgetForm.patchValue({
            "title": "",
            "redirection": "",
            "redirectionType": "",
            "buttonText": "",
            "buttonRedirection": "",
            "redirectionQuery": ""
          })
          this.testimonialKeyword.setValue("")
          this.widgetTestimonials = []
          this.designForm.patchValue({
            backgroundColor: '#ffffff', backgroundImage: '', marginLeft: 0,
            marginTop: 0, marginRight: 0, marginBottom: 0,
            paddingTop: 0, paddingBottom: 0, paddingLeft: 0,
            paddingRight: 0, borderRadius: 0, borderWidth: 0
          })
          this.closeUpdate()
          this.closeDesign()
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Update widgets ends here

  //Delete widgets starts here
  openConfirmation(template: TemplateRef<any>, widget: any) {
    this.confirmedWidget = widget;
    this.confirmRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
  }

  closeConfirmation() {
    this.confirmRef?.hide();
    this.confirmedWidget = null
  }

  deleteWidget() {
    this.HomeWidgetsService.deleteWidget(this.confirmedWidget?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getHomeWidgets()
          this.closeConfirmation()
          this.count++
          this.screenLoad++
          this.isDraft = true
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Delete widgets ends here

  //Duplicate widgtes starts here
  openDuplication(template: TemplateRef<any>, widget: any) {
    this.duplicatedWidget = widget;
    this.duplicateRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
  }

  closeDuplication() {
    this.duplicateRef?.hide();
    this.duplicatedWidget = null
  }

  duplicateWidget() {
    this.HomeWidgetsService.duplicateHomeWidget({ widget: this.duplicatedWidget?.refid, index: this.widgetItems.length }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getHomeWidgets()
          this.closeDuplication()
          this.count++
          this.screenLoad++
          this.isDraft = true
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Duplicate widgets ends here

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.widgetItems, event.previousIndex, event.currentIndex);
    this.reorderWidgets()
    this.isDraft = true
    this.screenLoad++
    this.count++
  }

  //Title image
  onTitleImageTriggered(event: any) {
    this.titleThumbnailDetails = event.path
    this.form.get("titleImage")?.setValue(event._id)
  }

  removeTitleImage() {
    this.titleThumbnailDetails = ''
    this.form.get("titleImage")?.setValue(null)
  }
  //Title image

  //hyperlink hero
  onHyperlinkHeroTriggered(event: any) {
    this.hyperlinkheroForm.get("hyperLinkThumbnail")?.setValue(event._id)
    this.hyperLinkHeroThumbnail = event.path
  }

  removeHyperlinkHeroThumbnail() {
    this.hyperlinkheroForm.get("hyperLinkThumbnail")?.setValue(null)
    this.hyperLinkHeroThumbnail = ''
  }
  //hyperlink hero

  searchWidgets(event: any) {
    this.homeWidgets = this.widgets.filter((widget: any) => widget.title.toLowerCase().startsWith(this.homeWidgetKeyword?.value.toLowerCase()))
  }

  ngOnInit(): void {
    this.homeWidgets = this.widgets
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
      alignment: new FormControl('left')
    })

    this.insightHubForm = new FormGroup({
      insightHubTitle: new FormControl(''),
      insightHubDescription: new FormControl(''),
      insightHubButton: new FormControl(''),
      insightHubRedirection: new FormControl(''),
      insightHubThumbnailSmall: new FormControl(null),
      insightHubThumbnailLarge: new FormControl(null),
    })

    this.focusedWidget = this.widgets[0]
    this.getHomeWidgets()
    this.form = new FormGroup({
      visibility: new FormControl("all"),
      title: new FormControl(""),
      titleImage: new FormControl(null),
      description: new FormControl(""),
      html: new FormControl(""),
      video: new FormControl(""),
      view: new FormControl("grid"),
      textTwirlTitle: new FormControl(""),
      textTwirlDescription: new FormControl(""),
      gridsPerCount: new FormGroup({
        mobile: new FormControl(2, [Validators.required, Validators.pattern("^[0-9]*$")]),
        tablet: new FormControl(3, [Validators.required, Validators.pattern("^[0-9]*$")]),
        desktop: new FormControl(4, [Validators.required, Validators.pattern("^[0-9]*$")])
      }),
      spacing: new FormGroup({
        mobile: new FormControl(2, [Validators.required, Validators.pattern("^[0-9]*$")]),
        tablet: new FormControl(3, [Validators.required, Validators.pattern("^[0-9]*$")]),
        desktop: new FormControl(4, [Validators.required, Validators.pattern("^[0-9]*$")])
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
      widgetStartTime: new FormControl(""),
      widgetEndTime: new FormControl(""),

      sliderButtonPosition: new FormControl("relative"),
      paginationPosition: new FormControl("relative"),
      hovering: new FormGroup({
        desktop: new FormControl(false),
        mobile: new FormControl(false),
      }),
      buttonVisibility: new FormControl(true),
      buttonText: new FormControl(""),
      buttonLink: new FormControl(""),
      slidesPerCount: new FormGroup({
        mobile: new FormControl(2, [Validators.required, Validators.pattern("^[0-9]*$")]),
        tablet: new FormControl(3, [Validators.required, Validators.pattern("^[0-9]*$")]),
        desktop: new FormControl(4, [Validators.required, Validators.pattern("^[0-9]*$")])
      })
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          environment.base = res.result.baseS3Url;
          this.base = environment.base
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.saleForm = new FormGroup({
      saleTitle: new FormControl(""),
      saleButtonText: new FormControl(""),
      saleButtonLink: new FormControl(""),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      saleDescription: new FormControl(""),
      saleButtonVisibility: new FormControl("true"),
      saleThumbnail: new FormControl(null),
    })

    this.widgetForm = new FormGroup({
      title: new FormControl(""),
      description: new FormControl(''),
      button: new FormControl(''),
      redirection: new FormControl(""),
      redirectionType: new FormControl(""),
      buttonText: new FormControl(""),
      buttonRedirection: new FormControl(""),
      productsAdThumbnail: new FormControl(null),
      productsAdRedirection: new FormControl(""),
      redirectionQuery: new FormControl("")
    })

    this.designForm = new FormGroup({
      marginLeft: new FormControl(0),
      marginRight: new FormControl(0),
      marginTop: new FormControl(0),
      marginBottom: new FormControl(0),
      elevation: new FormControl(0),
      backgroundColor: new FormControl("#ffffff"),
      backgroundImage: new FormControl(""),
      paddingLeft: new FormControl(0),
      paddingRight: new FormControl(0),
      paddingTop: new FormControl(0),
      paddingBottom: new FormControl(0),
      borderRadius: new FormControl(0),
      borderWidth: new FormControl(0),
      borderColor: new FormControl("#ffffff"),
    })
  }

  onBackgroundTriggered(event: any) {
    this.designForm.get("backgroundImage")?.setValue(event._id)
  }

  onSaleThumbnailTriggered(event: any) {
    this.saleForm.get("saleThumbnail")?.setValue(event._id)
  }

  removeSaleThumbnail() {
    this.saleForm.get("saleThumbnail")?.setValue(null)
    this.saleThumbnailDetails = ""
  }

  onTimeBoundSwitch(event: { toggleState: boolean, switchId: string }) {
    this.form.get('isTimeBoundWidget')?.setValue(event.toggleState)
  }

  getProducts() {
    this.ProductService.getActiveProduct().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  toggleProducts(productDetails: any) {
    if (this.isIdInArray(productDetails?._id, this.widgetProducts)) {
      this.widgetProducts = this.widgetProducts.filter(item => item._id !== productDetails?._id)
    } else {
      this.widgetProducts.push(productDetails)
    }
  }

  isIdInArray(idToCheck: string, array: any[]) {
    return array.some(item => item._id === idToCheck);
  }

  getBlogs(query: string) {
    this.BlogService.blogs({ keyword: query, page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blogs = res?.result?.data
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  openHistory(template: TemplateRef<any>) {
    this.historyRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
  }

  getCollections() {
    this.CollectionService.getActiveCollection().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.collections = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  getCategories() {
    this.CategoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.categories = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getCatalogPages() {
    this.CatalogService.getCatalogs().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.catalogPages = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getBrands() {
    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  getStaticPages() {
    this.StaticPageService.active().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.staticPages = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  switchToggled(event: { switchId: string, toggleState: boolean }) {
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
    }
  }
}
