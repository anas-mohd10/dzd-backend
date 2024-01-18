import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BlogService } from 'src/app/includes/services/blog.service';
import { CatalogService } from 'src/app/includes/services/catalog.service';
import { environment } from 'src/environments/environment';
interface WidgetProps {
  title: string;
  type: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

export class CatalogComponent implements OnInit {
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
  ]
  catalogPage: FormControl = new FormControl("");
  isCopy: FormControl = new FormControl(false);

  catalogPages: Array<any> = [];
  catalogPageDetails: any = {};

  catalogForm: FormGroup;

  createRef?: BsModalRef
  deleteRef?: BsModalRef
  updateRef?: BsModalRef
  widgetsRef?: BsModalRef
  widgetDetailsRef?: BsModalRef

  widgetItems: Array<any> = []
  focusedWidget: any = {}
  widgetDetails: any;
  widgetImageTypes: Array<any> = ["image-slider", "classic-banners", "magestic-mosaic", "glamour-glaze", "dazzle-design", "grandeur-gallery", "celestial-canvas"]
  widgetImages: Array<any> = []
  widgetBlogs: Array<any> = []
  form: any;
  confirmedWidget: any;
  confirmRef?: BsModalRef;
  duplicatedWidget: any;
  duplicateRef?: BsModalRef;
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
  widgetImagePreviewIndex: any;
  widgetForm: FormGroup;
  base: string = environment.base + '/'
  previewDetails: string = ''
  widgetImagePreview: any;
  widgetPreviewDetails: any

  constructor(
    private BsModalService: BsModalService,
    private CatalogService: CatalogService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BlogService: BlogService
  ) { }

  //Catalog create starts here
  openCreate(template: TemplateRef<any>): void {
    this.createRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeCreate(): void {
    this.createRef?.hide()
    this.catalogForm.reset()
    this.catalogForm.get("isCopy")?.setValue(false)
  }

  createCatalog() {
    this.CatalogService.createCatalog(this.catalogForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeCreate()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.getCatalogs()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Catalog create ends here

  //Catalog update starts here
  openUpdate(template: TemplateRef<any>): void {
    this.updateRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.catalogForm.patchValue(this.catalogPageDetails)
  }

  closeUpdate(): void {
    this.updateRef?.hide()
    this.catalogForm.reset()
    this.catalogForm.get("isCopy")?.setValue(false)
  }

  updateCatalog() {
    this.CatalogService.updateCatalog(this.catalogForm.value, this.catalogPageDetails?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeUpdate()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.getCatalogs()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Catalog update ends here

  //Catalog delete starts here
  openDelete(template: TemplateRef<any>): void {
    this.deleteRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeDelete(): void {
    this.deleteRef?.hide()
  }

  deleteCatalog() {
    this.CatalogService.deleteCatalog(this.catalogPageDetails?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeDelete()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.getCatalogs()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }
  //Catalog delete ends here

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
    this.CatalogService.addCatalogWidget({
      index: this.widgetItems.length,
      widgetName: widget.title,
      widgetType: widget.type,
      catalog: this.catalogPageDetails?._id
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getCatalogDetails()
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

  //Update widgets starts here
  openWidgetUpdate(template: TemplateRef<any>, widget: any) {
    this.widgetDetailsRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
    this.CatalogService.catalogWidgetDetails(widget?.refid).subscribe({
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

  closeWidgetUpdate() {
    this.widgetDetailsRef?.hide();
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

    }

    this.CatalogService.updateCatalogWidget(widgetPayload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getCatalogDetails()
          this.widgetImages = []
          this.widgetImagePreviewIndex = null
          this.widgetImagePreview = null
          this.form.reset()
          this.closeWidgetUpdate()
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
    this.CatalogService.deleteWidget(this.confirmedWidget?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getCatalogDetails()
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
    this.CatalogService.duplicateCatalogWidget({ widget: this.duplicatedWidget?.refid, index: this.widgetItems.length }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getCatalogDetails()
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

  reorderWidgets() {
    let widgets = this.widgetItems.map((widget, index) => {
      return { widgetType: widget?.widgetType, refid: widget?.refid, index: index }
    })

    this.CatalogService.reorderWidgets({ widgets: widgets }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
          this.getCatalogDetails()
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.widgetItems, event.previousIndex, event.currentIndex);
    this.reorderWidgets()
  }

  addWidgetDetails() {
    this.widgetImages[this.widgetImagePreviewIndex] = { ...this.widgetImages[this.widgetImagePreviewIndex], ...this.widgetForm.value }
  }

  getCatalogs() {
    this.CatalogService.getCatalogs().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.catalogPages = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }, complete: () => {
        if (this.catalogPages.length > 0) {
          this.catalogPage.setValue(this.catalogPages[0].slug)
          this.getCatalogDetails()
        }
      }
    })
  }

  getCatalogDetails() {
    this.CatalogService.getCatalogDetails(this.catalogPage.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.catalogPageDetails = res?.result?.catalogDetails
          this.widgetItems = res?.result?.catalogWidgets
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  ngOnInit(): void {
    this.getCatalogs()
    this.catalogForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl(""),
      isCopy: new FormControl(false),
      catalogReference: new FormControl(""),
      seoTitle: new FormControl(""),
      seoDescription: new FormControl(""),
      seoKeywords: new FormControl(""),
    })

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
