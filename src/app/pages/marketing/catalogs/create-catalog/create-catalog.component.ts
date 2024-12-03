import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

interface Widget {
  name: string
  description: string;
  type: string
}

interface WidgetDetails {
  header: { title: string, position: string, family: string, weight: string, size: string, color: string };
  description: { title: string, position: string, family: string, weight: string, size: string, color: string };
  button: { isEnabled: boolean, title: string, redirection: string, position: string };
  type: string;
  content?: string;
  products?: any[];
  files?: any[];
  refid: number,
  visibility: string,
  style: {
    margin: { left: string, right: string, top: string, bottom: string },
    padding: { left: string, right: string, top: string, bottom: string },
    border: { width: string, color: string },
    background: { color: string, image: string },
  }
}

@Component({
  selector: 'app-create-catalog',
  templateUrl: './create-catalog.component.html',
  styleUrls: ['./create-catalog.component.scss']
})
export class CreateCatalogComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  productForm: FormGroup
  designForm: FormGroup
  isSubmitted: boolean = false
  items: Array<any> = []
  products: Array<any> = []
  widgets: Array<Widget> = [
    { name: 'Products grid', description: "This widget is designed for featuring products in a grid format, showcasing product cards with the same design as used on the website.", type: 'products-grid' },
    { name: 'Products slider', description: "This widget is designed for featuring products in a slider format, showcasing product cards with the same design as used on the website.", type: 'products-slider' },
    { name: 'Content description', description: "This widget is crafted to showcase dynamic content within the catalog.", type: 'description' },
    { name: 'Custom HTML', description: "This widget allows the inclusion of custom HTML to create a display element.", type: 'custom-html' },
    { name: 'Banner', description: "This widget is used to showcase banner and carousel with only image.", type: 'banner' },
    { name: 'Video', description: "This widget is used to showcase full width video only.", type: 'video' },
    
  ]
  positions: Array<{ key: String, value: String }> = [
    { key: 'Left', value: 'left' },
    { key: 'Right', value: 'right' },
    { key: 'Center', value: 'center' }
  ]
  families: Array<{ key: String, value: String }> = [
    { key: 'Arial', value: 'arial' },
    { key: 'Hellix', value: 'hellix' },
    { key: 'Sen', value: 'figtree' },
    { key: 'Sen', value: 'Sen' },
    { key: 'Poppins', value: 'poppins' }
  ]
  base: string = environment.base
  //Modals
  productRef?: BsModalRef
  designRef?: BsModalRef
  widgetRef?: BsModalRef
  @ViewChild('productTemplate') productTemplate: TemplateRef<any>
  //Modals
  activeWidget: Widget = { name: '', description: '', type: '' };
  productKeyword: FormControl = new FormControl('')
  activeDesignWidget: any = {
    details: {},
    index: Number
  };
  activeContentWidget: any;

  constructor(
    private BsModalService: BsModalService,
    private ProductService: ProductService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private FormBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('')
    })

    this.designForm = this.FormBuilder.group({
      header: this.FormBuilder.group({ title: [''], position: ['left'], family: [''], weight: ['400'], size: ['18'], color: ['#000000'] }),
      description: this.FormBuilder.group({ title: [''], position: ['left'], family: [''], weight: ['400'], size: ['16'], color: ['#000000'] }),
      button: this.FormBuilder.group({ isEnabled: ['false'], title: [''], position: ['left'], redirection: [''] }),
      style: this.FormBuilder.group({
        margin: this.FormBuilder.group({
          top: ['0'],
          bottom: ['0'],
          left: ['0'],
          right: ['0']
        }),
        padding: this.FormBuilder.group({
          top: ['0'],
          bottom: ['0'],
          left: ['0'],
          right: ['0']
        }),
        background: this.FormBuilder.group({ color: ['#ffffff'] }),
        border: this.FormBuilder.group({ width: ['0'], color: ['#ffffff'] })
      })
    })
  }

  updateWidgetDesign() {
    let details = {
      ...this.activeDesignWidget.details,
      ...this.designForm.value
    }
    this.items[this.activeDesignWidget.index] = details
    this.designRef?.hide()
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  getWidgetDetails(widget: Widget): WidgetDetails {
    return {
      header: { title: '', position: 'left', family: '', weight: '400', size: '18', color: '#000000' },
      description: { title: '', position: 'left', family: '', weight: '400', size: '16', color: '#000000' },
      button: { isEnabled: false, title: '', position: 'left', redirection: '' },
      type: widget.type,
      content: '',
      products: [],
      refid: Math.floor(Math.random() * 90) + 10,
      files: [],
      visibility: "both",
      style: {
        margin: { left: '0', right: '0', top: '0', bottom: '0' },
        padding: { left: '0', right: '0', top: '0', bottom: '0' },
        background: { color: '#ffffff', image: '' },
        border: { width: '0', color: '#ffffff' }
      }
    }
  }

  checkWidget(widget: Widget) {
    this.activeWidget = widget;
    let widgetDetails = this.getWidgetDetails(widget)
    this.items.push(widgetDetails)
    this.widgetRef?.hide()
    this.activeWidget = { name: '', description: '', type: '' };
  }

  deleteWidget(index: number) {
    this.items.splice(index, 1)
  }

  get formControls() {
    return this.form.controls
  }

  openDesignRef(template: TemplateRef<any>, index: number) {
    this.activeDesignWidget = { details: this.items[index], index: index }
    this.designRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
  }

  closeDesignRef() {
    this.designRef?.hide()
    this.activeDesignWidget = { details: {}, index: Number }
  }

  openWidgetRef(template: TemplateRef<any>) {
    this.widgetRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true })
  }

  close(type: string) {
    if (type == 'products-template') {
      this.productKeyword.reset()
      this.productRef?.hide()
    }
    this.activeWidget = { name: '', description: '', type: '' };
  }

  getProducts() {
    if (this.productKeyword.value) {
      this.ProductService.searchProducts({ page: 1, limit: 40, name: this.productKeyword.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.products = res?.result?.data
          }
        }
      })
    } else {
      this.products = []
    }
  }

  submit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

  }
}
