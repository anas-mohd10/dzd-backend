import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

interface Widget {
  name: string
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
    { name: 'Products grid', type: 'products-grid' },
    { name: 'Products slider', type: 'products-slider' },
    { name: 'Content description', type: 'description' },
  ]
  positions: Array<{ key: String, value: String }> = [
    { key: 'Left', value: 'left' },
    { key: 'Right', value: 'right' },
    { key: 'Center', value: 'center' }
  ]
  families: Array<{ key: String, value: String }> = [
    { key: 'Arial', value: 'arial' },
    { key: 'Hellix', value: 'hellix' },
    { key: 'Figtree', value: 'figtree' },
    { key: 'Outfit', value: 'outfit' },
    { key: 'Poppins', value: 'poppins' }
  ]
  base: string = environment.base
  //Modals
  productRef?: BsModalRef
  designRef?: BsModalRef
  @ViewChild('productTemplate') productTemplate: TemplateRef<any>
  //Modals
  activeWidget: Widget = { name: '', type: '' };
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

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.previousIndex, event.currentIndex);
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
    if (['products-grid', 'products-slider'].includes(widget.type)) {
      delete widgetDetails.files
      delete widgetDetails.content
      this.productRef = this.BsModalService.show(this.productTemplate, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    }
    this.items.push(widgetDetails)
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

  close(type: string) {
    if (type == 'products-template') {
      this.productKeyword.reset()
      this.productRef?.hide()
    }
    this.activeWidget = { name: '', type: '' };
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
