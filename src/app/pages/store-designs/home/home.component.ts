import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeWidgetsService } from 'src/app/includes/services/home-widgets.service';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BlogService } from 'src/app/includes/services/blog.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';


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
    { title: 'Classic Banners', type: 'classic-banners', icon: '../../../../assets/widgets/banner.png', description: 'This widget is used to showcase banner and carousel with only image.' },
    { title: 'Magestic Mosaic', type: 'magestic-mosaic', icon: '../../../../assets/widgets/rush-lake.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Glamour Glaze', type: 'glamour-glaze', icon: '../../../../assets/widgets/volta-lake.png', description: 'The widget can be used to showcase new brands or existing brands.The widget contains two section with image and description section on either side and vice-versa.The description box has a black border, with heading, subheading and button.' },
    { title: 'Dazzle Design', type: 'dazzle-design', icon: '../../../../assets/widgets/1x4.png', description: 'The following widget can be used to show collection of categories.The following widget is a collection of card where it has one main card and other 4 cards.The cards contain an image and decrotaive text which is center aligned with the image.' },
    { title: 'Grandeur Gallery', type: 'grandeur-gallery', icon: '../../../../assets/widgets/grandeur-gallery.png', description: 'The following widget can be used to show collection of categories.The following widget is a collection of card where it has one main card and other 4 cards.The cards contain an image and decrotaive text which is center aligned with the image.' },
    { title: 'Celestial Canvas', type: 'celestial-canvas', icon: '../../../../assets/widgets/celestial-canvas.png', description: 'This widget is used to showcase banner carousel and video' },
    { title: 'Blogs', type: 'blogs', icon: '../../../../assets/widgets/blogs.png', description: 'The following widget can be used to display the recent blogs, or categories.The widget contains image and white transluscent descriptive box.The description box contain text and button.' },
    { title: 'Custom HTML', type: 'html', icon: '../../../../assets/widgets/custom-html.png', description: '' },
    { title: 'Image Slider', type: 'image-slider', icon: '../../../../assets/widgets/image-slider.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Video', type: 'video', icon: '../../../../assets/widgets/video.png', description: 'This widget is used to showcase full width video only.' },
    { title: 'Products', type: 'products', icon: '../../../../assets/widgets/video.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Noble Nodes', type: 'noble-nodes', icon: '../../../../assets/widgets/noble-nodes.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Prime Plates', type: 'prime-plates', icon: '../../../../assets/widgets/prime-plates.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Elite Elements', type: 'elite-elements', icon: '../../../../assets/widgets/elite-elements.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Sale Timer', type: 'sale-timer', icon: '../../../../assets/widgets/sale-timer.png', description: 'This widget is used to showcase a sale timer.' },
    { title: 'Twin Towers', type: 'twin-towers', icon: '../../../../assets/widgets/twin-towers.png', description: 'The following widget can be used to show images within a particular category.The widget contains images.' },
    { title: 'Slider Spotlight', type: 'slider-spotlight', icon: '../../../../assets/widgets/slider-spotlight.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Trending Teasers', type: 'trending-teasers', icon: '../../../../assets/widgets/trending-teasers.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Smart Tiles', type: 'smart-tiles', icon: '../../../../assets/widgets/smart-tiles.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Stellar Selections', type: 'stellar-selections', icon: '../../../../assets/widgets/stellar-selections.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Testimonials', type: 'testimonial-cards', icon: '../../../../assets/widgets/image-slider.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Regal Rolls', type: 'regal-rolls', icon: '../../../../assets/widgets/regal-rolls.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Radiant Rectangles', type: 'radiant-rectangles', icon: '../../../../assets/widgets/radiant-rectangles.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
    { title: 'Unity Nexus', type: 'unity-nexus', icon: '../../../../assets/widgets/unity-nexus.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Picture Palette', type: 'picture-palette', icon: '../../../../assets/widgets/picture-palette.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Store Chronicles', type: 'store-chronicles', icon: '../../../../assets/widgets/store-chronicles.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
    { title: 'Quad Squares', type: 'quad-square', icon: '../../../../assets/widgets/quad-sqaure.png', description: 'The following widget can be used to show images within a particular category. The widget contains images.' },
  ]

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
  base: string = environment.base + '/'
  previewDetails: string = ''
  widgetImagePreview: any;
  widgetImagePreviewIndex: any;
  widgetPreviewDetails: any;
  smartTileProducts: Array<any> = [] // Smart tiles widgets
  tileProductsInput: FormControl = new FormControl("", Validators.required); // Smart tiles widgets
  tileProducts: Array<any> = [] // Smart tiles widgets
  widgetProductTypes: Array<any> = ["smart-tiles", "products"]
  widgetImageTypes: Array<any> = ["image-slider", "quad-square", "prime-plates", "elite-elements", "noble-nodes", "classic-banners", "magestic-mosaic", "glamour-glaze", "dazzle-design", "grandeur-gallery", "celestial-canvas", "twin-towers", "stellar-selections", "slider-spotlight", "trending-teasers"]
  redirectionItems: Array<any> = [
    { key: "None", value: "" },
    { key: "Open category products", value: "category" },
    { key: "Open all products", value: "all-products" },
    { key: "Open brand products", value: "brands" },
    { key: "Open collection products", value: "collection" },
    { key: "Open product details", value: "products" },
    { key: "Open catalog page", value: "catalog" },
    { key: "Open blogs", value: "blogs" },
    { key: "Open weblink", value: "web-links" },
    { key: "Open static page", value: "static-pages" },
    { key: "Search filters", value: "search-filters" },
  ]
  staticPages: Array<any> = [
    { title: 'Contact', url: '/contact' },
    { title: 'About', url: '/about-us' },
    { title: 'FAQ', url: '/faq' },
    { title: 'Blogs', url: '/blogs' },
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
  backgroundDetails: string
  isDraft: boolean = false
  saleForm: FormGroup
  device: string = 'desktop'
  count: number = 0
  saleThumbnailDetails: string = ''
  hiddenHeaderItems: Array<string> = ['sale-timer']
  selectedProductType: string = 'products';
  collections: Array<any> = []
  widgetCollection: FormControl = new FormControl("")
  redirectionQuery: FormControl = new FormControl("")
  redirectionDetails: any
  spotlightSliders: Array<any> = []
  settings: any = {}
  categories: Array<any> = []
  testimonialKeyword: FormControl = new FormControl("", Validators.required);
  testimonials: Array<any> = []
  widgetTestimonials: Array<any> = []

  constructor(
    private BsModalService: BsModalService,
    private Toast: HotToastService,
    private HomeWidgetsService: HomeWidgetsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService,
    private ProductService: ProductService,
    private CollectionService: CollectionService,
    private AppSettingsService: AppSettingsService,
    private CategoryService: CategoryService,
    private TestimonialService: TestimonialService
  ) { }

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
      return
    }

    this.ProductService.searchProducts({
      name: this.tileProductsInput.value, page: 1, limit: 100,
      isActive: true, isVisible: 0
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
      this.smartTileProducts.push(productDetails)
    }
    this.widgetCollection.setValue("")
  }

  isTileProductExists(productDetails: any) {
    return this.smartTileProducts.some((item: any) => item._id == productDetails._id) ? true : false
  }
  //Smart tiles widgets

  //Redirections
  onRedirectionSelected() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.getBlogs(this.redirectionQuery.value)
        break
      case 'category':
        this.getCategories()
        break
      case 'collection':
        this.getCollections()
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
    this.redirectionQuery.setValue("")
  }

  continueRedirectionQuery() {
    switch (this.widgetForm.value.redirectionType) {
      case 'blogs':
        this.widgetForm.get('redirection')?.setValue("/blogs/" + this.redirectionDetails.slug)
        break
      case 'static-pages':
        this.widgetForm.get('redirection')?.setValue(this.redirectionQuery.value)
        break
      case 'search-filters':
        this.widgetForm.get('redirection')?.setValue("/products" + this.redirectionQuery.value)
        break
      case 'category':
        this.widgetForm.get('redirection')?.setValue("/products?category=" + this.redirectionQuery.value)
        break
      case 'collection':
        this.widgetForm.get('redirection')?.setValue("/products?collection=" + this.redirectionQuery.value)
        break
    }
    this.addWidgetDetails()
    this.redirectionQuery.setValue("")
    this.widgetImagePreviewIndex = null
    this.widgetImagePreview = null
  }
  //Redirections

  //Toggle device
  deviceToggled(event: string) {
    this.device = event;
    this.ChangeDetectorRef.markForCheck()
  }

  toggleProductSelection(type: string) {
    this.selectedProductType = type
    if (type == 'collections') this.getCollections()
  }
  //Toggle device

  //Design starts here
  openDesign(template: TemplateRef<any>, widget: any) {
    this.designRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    this.getWidgetDetails(widget)
  }

  getWidgetDetails(widget: any) {
    this.HomeWidgetsService.homeWidgetDetails(widget?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetDetails = res?.result;
          if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
            for (let widgetImage of this.widgetDetails?.widgetImages) {
              this.widgetImages.push({ url: widgetImage?.media, title: widgetImage?.title, redirection: widgetImage?.redirection })
            }
          }
          if (this.widgetDetails?.widgetType == 'blog') {
            this.widgetBlogs = this.widgetDetails?.blogs
            this.getBlogs('')
          }
          if (this.widgetDetails?.widgetType == 'testimonial-cards') {
            this.widgetTestimonials = this.widgetDetails?.testimonials
          }
          this.widgetDetails?.widgetType == 'smart-tiles' || this.widgetDetails?.widgetType == 'products' ? this.smartTileProducts = [...this.widgetDetails?.products] : null
          if (this.widgetDetails?.styles?.backgroundImage) this.backgroundDetails = this.widgetDetails?.styles?.backgroundImage?.path
          this.form.patchValue(this.widgetDetails)
          this.saleForm.patchValue(this.widgetDetails)
          if (this.widgetDetails?.saleThumbnail) {
            this.saleThumbnailDetails = this.widgetDetails?.saleThumbnail?.path
            this.saleForm.get("saleThumbnail")?.setValue(this.widgetDetails?.saleThumbnail?._id)
          }
          this.widgetDetails.collection ? this.widgetCollection.setValue(this.widgetDetails?.collection?._id) : null
          if (this.widgetProductTypes.includes(this.widgetDetails.type)) {
            this.widgetDetails.products.length > 0 ? this.selectedProductType = 'products' : this.selectedProductType = 'collections'
          }
          this.widgetDetails?.endDate ? this.saleForm.get("endDate")?.setValue(new Date(this.widgetDetails?.endDate)) : null
          this.designForm.patchValue(this.widgetDetails?.styles)
          this.ChangeDetectorRef.markForCheck()
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
    this.widgetForm.patchValue(this.widgetImagePreview)
    this.ChangeDetectorRef.markForCheck()
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
    this.saleForm.reset()
    this.saleForm.get('saleButtonVisibility')?.setValue(true)
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
        startDate: this.saleForm.get("startDate")?.value ? this.saleForm.get('startDate')?.value : new Date(new Date().setHours(0, 0, 0, 0)).toUTCString(),
      }
    } else if (this.widgetProductTypes.includes(this.widgetDetails.widgetType)) {
      widgetPayload = {
        visibility: this.form.get("visibility")?.value,
        refid: this.widgetDetails?.refid,
        ...this.form.value,
        widgetType: this.widgetDetails?.widgetType,
        products: this.widgetCollection.value ? [] : this.smartTileProducts.map((product) => product?._id),
        collections: this.widgetCollection.value ? this.widgetCollection.value : null
      }
    }

    type == 'styles' ? widgetPayload['styles'] = this.designForm.value : null

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
          this.widgetImagePreviewIndex = null
          this.widgetImagePreview = null
          this.form.reset()
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
    this.count++
  }

  ngOnInit(): void {
    this.widgets = this.widgets.sort((a: any, b: any) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }

      return 0;
    });


    this.focusedWidget = this.widgets[0]
    // this.getHomeDraftWidgets()
    this.getHomeWidgets()
    this.form = new FormGroup({
      visibility: new FormControl("all"),
      title: new FormControl(""),
      description: new FormControl(""),
      html: new FormControl(""),
      htmlStyles: new FormControl(""),
      htmlScripts: new FormControl(""),
      video: new FormControl(""),
      view: new FormControl("grid"),
      gridsPerCount: new FormControl("4"),
      buttonVisibility: new FormControl(false),
      buttonText: new FormControl(""),
      buttonLink: new FormControl(""),
      slidesPerCount: new FormControl("3")
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
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
      redirection: new FormControl(""),
      redirectionType: new FormControl(""),
      buttonText: new FormControl(""),
      buttonRedirection: new FormControl(""),
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

  getProducts() {
    if (!this.productKeyword.valid) {
      return
    }

    this.ProductService.searchProducts({
      name: this.productKeyword.value,
      page: 1, limit: 100,
      isActive: true, isVisible: 0
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result?.data
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
}
