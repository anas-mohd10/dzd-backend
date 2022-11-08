import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/includes/services/product.service'
import { LayoutService } from 'src/app/includes/services/layout.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-layout-list',
  templateUrl: './add-layout-list.component.html',
  styleUrls: ['./add-layout-list.component.scss']
})
export class AddLayoutListComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  layoutForm: FormGroup
  isSubmitted = false;
  productsData: any;
  images: any = [];
  files: any = []
  localData: any = []
  dataFiles: any = []
  url: any;
  filedata: any
  imageChangedEvent: any = '';
  croppedImage: any = '';
  filename: any
  loadImage: boolean = false;
  productName: any
  selectedProduct: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private layoutService: LayoutService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getProducts()
  }

  initForm() {
    this.layoutForm = this.formBuilder.group({
      title: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      isActive: ['true'],
      gridCount: ['1'],
      type: ['Slider'],
      product: [''],
      redirectionURL: [''],
      file: ['']
    });
  }

  get lf() {
    return this.layoutForm.controls;
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  getProducts() {
    this.productService.getProductNames().subscribe((res: any) => {
      this.productsData = res?.result
      this.cdr.markForCheck()
    })
  }

  addFile() {
    let maxVal = this.layoutForm.get("gridCount")?.value
    if (this.selectedProduct && this.url != '') {
      if (maxVal > this.dataFiles.length) {
        for (let prod of this.productsData) {
          if (prod?.prodid == this.selectedProduct) {
            this.productName = prod?.name
          }
        }
        let prevlen = this.dataFiles.length
        this.dataFiles.push({
          filestring: this.croppedImage,
          url: this.url,
          redirect: this.layoutForm.get("redirectionURL")?.value,
          filename: this.filename,
          id: this.dataFiles.length,
          product: this.selectedProduct,
          prodName: this.productName
        })
        this.croppedImage = ''
        this.filename = ''
        let newlen = this.dataFiles.length
        if (prevlen < newlen) {
          this.loadImage = false
          this.layoutForm.get("redirectionURL")?.setValue('')
          this.layoutForm.get("file")?.setValue('')
        }
      } else {
        this.toastr.warning(`No. of files that can be uploaded is ${maxVal}. To upload more, change grid count value`);
      }
    } else {
      this.toastr.error(`Kindly fill required fields`);
    }
  }

  removeFile(id: any) {
    this.localData = this.localData.filter((_data: any) => _data.id != id)
    this.files = this.files.filter((_data: any) => _data.id != id)
  }

  handleInputChange(event: any) {
    if (event.target.files.length > 0) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.url = e.target.result
      }
    }
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateLayout();
    } else {
      this.addLayout();
    }
  }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  updateLayout() { }

  addLayout() {
    if (!this.layoutForm.valid) {
      this.toastr.error('Kindly fill required fields');
      return;
    }
    const data = {
      title: this.layoutForm.get('title')?.value,
      validFrom: this.layoutForm.get('validFrom')?.value,
      validTo: this.layoutForm.get('validTo')?.value,
      isActive: this.layoutForm.get('isActive')?.value,
      gridCount: this.layoutForm.get('gridCount')?.value,
      type: this.layoutForm.get('type')?.value,
      files: this.dataFiles
    }
    this.layoutService.addLayout(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.layout.LAYOUT_LIST]);
      }
    })
  }
}
