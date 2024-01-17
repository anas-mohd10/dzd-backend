import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CatalogService } from 'src/app/includes/services/catalog.service';

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
  catalogPage: FormControl = new FormControl("");
  catalogPages: Array<any> = [];
  catalogPageDetails: any = {};
  metaForm: FormGroup;
  catalogForm: FormGroup;
  createRef?: BsModalRef
  isCopy: FormControl = new FormControl(false);
  catalogTitle: FormControl = new FormControl("");
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
  widgetItems: Array<any> = []
  focusedWidget: WidgetProps = { title: '', type: '', icon: '', description: '' }
  widgetsRef?: BsModalRef;

  constructor(
    private BsModalService: BsModalService,
    private CatalogService: CatalogService,
    private Toast: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
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
  //Add widgets ends here

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
          this.catalogPageDetails = res?.result
          if (res?.result?.seoTitle || res?.result?.seoDescription || res?.result?.seoKeyword) {
            this.metaForm.patchValue(res?.result)
          } else {
            this.metaForm.reset()
          }
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  updateCatalog() {
    this.catalogForm.get("title")?.setValue(this.catalogTitle?.value)
    this.CatalogService.updateCatalog(this.catalogForm.value, this.catalogPageDetails?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.closeCreate()
          this.Toast.success(res?.message)
          this.ChangeDetectorRef.markForCheck()
          this.getCatalogs()
          if (this.catalogTitle?.value) this.catalogTitle.reset()
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err?.error?.message)
      }
    })
  }

  updateCatalogSeo() {
    this.CatalogService.updateCatalog(this.metaForm.value, this.catalogPageDetails?.slug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
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
    this.metaForm = new FormGroup({
      seoTitle: new FormControl(""),
      seoDescription: new FormControl(""),
      seoKeywords: new FormControl(""),
    })

    this.catalogForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl(""),
      isCopy: new FormControl(false),
      catalogReference: new FormControl(""),
    })
  }

}
