import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HomeWidgetsService } from 'src/app/includes/services/home-widgets.service';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BlogService } from 'src/app/includes/services/blog.service';
import { ProductService } from 'src/app/includes/services/product.service';


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
    { title: 'Video', type: 'video', icon: '../../../../assets/widgets/video.png', description: 'This widget is used to showcase full width video only' },
    { title: 'Products', type: 'products', icon: '../../../../assets/widgets/video.png', description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.' },
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
  widgetPreviewDetails: any
  widgetImageTypes: Array<any> = ["image-slider", "classic-banners", "magestic-mosaic", "glamour-glaze", "dazzle-design", "grandeur-gallery", "celestial-canvas"]
  redirectionItems: Array<any> = [
    { key: "None", value: "" },
    { key: "Open category products", value: "category" },
    { key: "Open brand products", value: "brands" },
    { key: "Open collection products", value: "collection" },
    { key: "Open product details", value: "products" },
    { key: "Open catalog page", value: "catalog" },
    { key: "Open blogs", value: "blogs" },
    { key: "Open weblink", value: "web-links" },
    { key: "Open static page", value: "static-pages" },
    { key: "Search filters", value: "search-filters" },
  ]
  searchRedirections: Array<string> = ["category", "brands", "collection", "products", "catalog", "blogs"]
  blogs: Array<any> = []
  widgetBlogs: Array<any> = []
  redirections: Array<any> = []
  productForm: FormGroup;
  productKeyword: FormControl = new FormControl("", Validators.required);
  products: Array<any> = []
  widgetProducts: Array<any> = []

  constructor(
    private BsModalService: BsModalService,
    private Toast: HotToastService,
    private HomeWidgetsService: HomeWidgetsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService,
    private ProductService: ProductService
  ) { }

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

  reorderWidgets() {
    let widgets = this.widgetItems.map((widget, index) => {
      return { widgetType: widget?.widgetType, refid: widget?.refid, index: index }
    })

    this.HomeWidgetsService.reorderWidgets({ widgets: widgets }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
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
    this.HomeWidgetsService.homeWidgetDetails(widget?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.widgetDetails = res?.result;
          if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
            for (let widgetImage of this.widgetDetails?.widgetImages) {
              this.widgetImages.push({
                url: widgetImage?.media, title: widgetImage?.title,
                redirection: widgetImage?.redirection
              })
            }
          }
          if (this.widgetDetails?.widgetType == 'blog') {
            this.widgetBlogs = this.widgetDetails?.blogs
            this.getBlogs()
          }
          this.form.patchValue(this.widgetDetails)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  closeUpdate() {
    this.updateRef?.hide();
    this.widgetImages = []
    this.widgetImagePreviewIndex = null
    this.widgetImagePreview = null
    this.form.reset()
  }

  updateWidget() {
    let widgetPayload = { ...this.form.value, refid: this.widgetDetails?.refid }

    if (this.widgetImageTypes.includes(this.widgetDetails?.widgetType)) {
      let widgetImages = []
      for (let widgetImage of this.widgetImages) {
        widgetImages.push({ ...widgetImage, media: widgetImage?.url?._id })
      }
      widgetPayload['widgetImages'] = widgetImages
    } else if (this.widgetDetails?.widgetType == 'blogs') {
      let widgetBlogs = []
    } else if (this.widgetDetails?.widgetType == 'products') {
      widgetPayload = {
        visibility: this.form.get("visibility")?.value,
        refid: this.widgetDetails?.refid,
        widgetType: this.widgetDetails?.widgetType,
        ...this.productForm.value,
        products: this.widgetProducts.map((product) => product?._id)
      }
    }

    this.HomeWidgetsService.updateHomeWidget(widgetPayload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getHomeWidgets()
          this.widgetImages = []
          this.widgetImagePreviewIndex = null
          this.widgetImagePreview = null
          this.form.reset()
          this.closeUpdate()
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
  }

  ngOnInit(): void {
    this.focusedWidget = this.widgets[0]
    this.getHomeWidgets()
    this.form = new FormGroup({
      visibility: new FormControl("all"),
      title: new FormControl(""),
      description: new FormControl(""),
      html: new FormControl(""),
      htmlStyles: new FormControl(""),
    })

    this.widgetForm = new FormGroup({
      title: new FormControl(""),
      redirection: new FormControl(""),
      redirectionType: new FormControl(""),
      buttonText: new FormControl(""),
      buttonRedirection: new FormControl(""),
      redirectionQuery: new FormControl("")
    })

    this.productForm = new FormGroup({
      title: new FormControl("Check Before The Offer Ends"),
      description: new FormControl("Explore the trendy collection of best-selling fragrances with commendable discounts"),
      products: new FormControl(""),
      type: new FormControl("slider"),
      thumbnail: new FormControl(""),
      cover: new FormControl(""),
      count: new FormControl(0, Validators.pattern(/^-?(0|[1-9]\d*)?$/))
    })
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

  getBlogs() {
    this.BlogService.blogs({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.blogs = res?.result?.data
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

  }
}
