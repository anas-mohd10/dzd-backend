import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/includes/services/product.service'
import { LayoutService } from 'src/app/includes/services/layout.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-layout-list',
  templateUrl: './update-layout-list.component.html',
  styleUrls: ['./update-layout-list.component.scss']
})
export class UpdateLayoutListComponent implements OnInit {
  task = PageTasks.UPDATE;
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
  slug: any = ''
  layoutData: any
  base: any

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.managePage()
    this.getProducts()
    this.slug = this.route.snapshot.queryParams.layout || '';
    this.getLayoutBySlug()
  }

  initForm() {
    this.layoutForm = this.formBuilder.group({
      title: ['', Validators.required],
      validFrom: [''],
      validTo: [''],
      isActive: ['true'],
      gridCount: ['1'],
      type: ['slider'],
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
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.productsData = res?.result
    })
  }

  getLayoutBySlug() {
    this.layoutService.getLayoutBySlug(this.slug).subscribe((res: any) => {
      this.layoutData = res?.result[0]
      this.layoutForm.get("title")?.setValue(res?.result[0].title)
      this.layoutForm.get("validFrom")?.setValue(res?.result[0].validFrom)
      this.layoutForm.get("validTo")?.setValue(res?.result[0].validTo)
      this.layoutForm.get("isActive")?.setValue(res?.result[0].isActive)
      this.layoutForm.get("gridCount")?.setValue(res?.result[0].gridCount)
      this.layoutForm.get("type")?.setValue(res?.result[0].type)
      this.cdr.markForCheck();
      for (let file of res?.result[0].files) {
        this.dataFiles.push({
          id: file.id,
          product: file.product,
          refid: file.refid,
          redirect: file.redirectionURL,
          url: file.file,
          file: file.file
        })
      }
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
          this.selectedProduct = ''
        }
      } else {
        this.toastr.warning(`No.of files that can be uploaded is ${maxVal}.To upload more, change grid count value`);
      }
    } else {
      this.toastr.error(`Kindly fill required fields`);
    }
  }

  removeFile(id: any) {
    this.dataFiles = this.dataFiles.filter((_data: any) => _data.product != id)
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateLayout();
    } else {
      this.addLayout();
    }
  }

  updateLayout() {
    if (!this.layoutForm.valid) {
      this.toastr.error('Kindly fill required fields...');
      return;
    }
    const payload = this.createPayload()
    if (payload) {
      this.layoutService.updateLayout(this.slug, payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Layout updated successfully');
          this.router.navigate([this.appRoute.layout.LAYOUT_LIST]);
        }
      })
    }
  }

  createPayload() {
    const data = {
      title: this.layoutForm.get('title')?.value,
      validFrom: this.layoutForm.get('validFrom')?.value,
      validTo: this.layoutForm.get('validTo')?.value,
      isActive: this.layoutForm.get('isActive')?.value,
      gridCount: this.layoutForm.get('gridCount')?.value,
      type: this.layoutForm.get('type')?.value,
      files: this.dataFiles,
      layid: this.slug
    }
    console.log(this.dataFiles);

    return data
  }

  addLayout() {
  }
}
