import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { VariantProductService } from 'src/app/includes/services/variant.product.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-variant-product',
  templateUrl: './add-variant-product.component.html',
  styleUrls: ['./add-variant-product.component.scss'],
})
export class AddVariantProductComponent implements OnInit {
  productForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;

  filedata: File;
  fileThumbnaildata: File
  type: any;
  isSingle: boolean = true;

  brandData: any;
  categoryData: any;
  taxClassData: any;
  productsData: any;

  searchKeyowrds: any = [];
  categoryNames: any = [];
  categoryid: any = [];

  returnValue: any;
  isReturn: boolean = false;
  isShipping: boolean = false;
  isCod: boolean = false;
  method: any;
  cod: any;

  relProductNames: any = [];
  relProductIds: any = [];

  croppedImage: string | null | undefined;
  thumbnailImage: string | null | undefined;
  loadImage: boolean;
  loadThumbnailImage: boolean;
  imageChangedEvent: Event | undefined;
  imageThumbnailChangedEvent: Event | undefined;
  filename: any;
  thumbnailFilename: any

  //Styling variables
  background: any
  border: any
  color: any

  selectedCategories: any = []
  selectedBrand: any = ''
  selectedProducts: any = []
  imageFiles: any = []
  files: any = []

  errors: any
  validError: any
  // url: any;
  format: string | undefined;
  url: string | ArrayBuffer | null | undefined;
  playVideo: boolean;
  video: string | ArrayBuffer | null;
  videoFile: any = {}
  disableButton: boolean = false;

  slug: any
  parent: any
  parentName: any;
  refid: any

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private VariantProductService: VariantProductService
  ) { }

  get pf() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.slug = this.route.snapshot.queryParams.id || ''
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();

    this.productService.getProductbyId({ prodid: this.slug }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.parent = res?.result[0]?._id
        this.refid = res?.result[0]?.prodid
        this.parentName = res?.result[0]?.name
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      hsn: ['', Validators.required],
      mrpPrice: [''],
      offerPrice: [''],
      stock: [''],
      moq: [''],
      stockWarning: [''],
      description: [''],
      features: [''],
      categories: [],
      brandId: [''],
      additionalbutton: [''],
      buttonredireturl: [''],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      returnable: ['false', Validators.required],
      returnDays: [''],
      shippingMethod: ['', Validators.required],
      shippingCost: [''],
      value: ['', Validators.required],
      unit: ['', Validators.required],
      taxClassId: ['', Validators.required],
      cod: ['false', Validators.required],
      codCharge: [''],
      searchKeywords: [],
      relatedProducts: [],
      position: [''],
      file: [''],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });
  }

  //Check whether the product is returnable or not
  checkReturnable(event: any) {
    this.returnValue = event.value;
    if (this.returnValue == 'true') {
      this.isReturn = true;
    }
    if (this.returnValue == 'false') {
      this.isReturn = false;
    }
  }

  //Check the shipping method
  checkShippingMethod(event: any) {
    console.log(event.value);
    this.method = event.value;
    if (this.method === 'Paid') {
      this.isShipping = true;
    }
    if (this.method == 'Unpaid' || this.method == 'External') {
      this.isShipping = false;
    }
  }

  //Check whether cod is available or not
  checkCod(event: any) {
    this.cod = event.value;
    if (this.cod == 'true') {
      this.isCod = true;
    }
    if (this.cod == 'false') {
      this.isCod = false;
    }
  }

  //Search keywords input
  tagInput(event: any) {
    let _value = event.value
    if (_value) {
      if (this.productForm.get('searchKeywords')?.value != ' ' || '' || null) {
        this.searchKeyowrds.push(this.productForm.get('searchKeywords')?.value);
        this.productForm.get('searchKeywords')?.setValue('');
      }
    }
  }

  //Search keywords remove
  tagRemove(value: any) {
    this.searchKeyowrds = this.searchKeyowrds.filter((_data: any) => _data != value)
  }

  //Related products tag
  tagProductAdd(event: any) {
    let rProduct = event.value
    if (!this.relProductIds.includes(rProduct)) {
      this.relProductIds.push(rProduct)
      for (let i = 0; i < this.productsData.length; i++) {
        if (this.productsData[i]._id == rProduct) {
          this.relProductNames.push(this.productsData[i].name)
        }
      }
    } else {
      this.toastr.info('Product already added');
    }
    this.productForm.get("relatedProducts")?.setValue('')
  }

  //Related product remove
  tagProductRemove(_val: any) {
    this.relProductNames = this.relProductNames.filter((_data: any) => _data != _val)
    for (let i = 0; i < this.productsData.length; i++) {
      if (this.productsData[i].name == _val) {
        this.relProductIds = this.relProductIds.filter((_data: any) => _data != this.productsData[i]._id)
      }
    }
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

  getBrandDetail() {
    this.brandService.getActiveBrands().subscribe((res: any) => {
      this.brandData = res?.result;
    });
  }

  getCategoryDetail() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
    });
  }

  getTaxClassDetail() {
    this.taxClassService.getTaxClasses().subscribe((res: any) => {
      this.taxClassData = res?.result;
    });
  }

  getProducts() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result;
    });
  }

  addImage() {
    this.imageFiles.push({
      fileString: this.croppedImage,
      filename: this.filename,
      url: this.url,
      id: this.imageFiles.length
    })

    this.files.push({
      id: this.files.length,
      file: this.croppedImage,
      name: this.filename
    })


    this.croppedImage = ''
    this.filename = ''
    this.loadImage = false
  }

  removeFile(id: any) {
    this.imageFiles = this.imageFiles.filter((_data: any) => _data.id != id)
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
    this.cdr.markForCheck()
  }

  handleInputThumbnailChange(event: any) {
    this.fileThumbnaildata = <File>event.target.files[0];
    this.thumbnailFilename = this.fileThumbnaildata.name
    this.imageThumbnailChangedEvent = event;
    this.loadThumbnailImage = true
    this.cdr.markForCheck()
  }

  imageCropped(event: ImageCroppedEvent) {
    setTimeout(() => {
      this.croppedImage = event.base64;
    }, 1500)
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

  imageThumbnailCropped(event: ImageCroppedEvent) {
    setTimeout(() => {
      this.thumbnailImage = event.base64;
    }, 1500)
  }

  thumbnailImageLoaded() {
    // show cropper
  }

  cropperThumbnailReady() {
    // cropper ready
  }

  loadThumbnailImageFailed() {
    // show message
  }

  removeThumbnailImage() {
    this.thumbnailImage = ''
    this.loadThumbnailImage = false
  }

  videoUpload(event: any) {
    if (event.target.files.length > 0) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.toastr.info('Video Uploading in Progress', '', { timeOut: 2000 })
        setTimeout(() => {
          this.video = e.target.result
          this.toastr.success('Video Successfully Uploaded', '', { timeOut: 2000 })
          this.videoFile = {
            video: this.video,
            name: event.target.files[0].name
          }
          this.cdr.markForCheck()
        }, 2000)
      }
    }
  }

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  updateProduct() { }

  addProduct() {
    if (!this.productForm.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.disableButton = true
      this.toastr.info('Adding product...', '', { timeOut: 2000 })
      setTimeout(() => {
        this.VariantProductService.addVariantProduct(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.product.PRODUCT_LIST]);
          }
        });
      }, 2000)
    }
  }

  createPayload() {
    const data = {
      parent: {
        id: this.parent,
        refid: this.refid
      },
      name: this.productForm.get('name')?.value,
      sku: this.productForm.get('sku')?.value,
      hsn: this.productForm.get('hsn')?.value,
      mrpPrice: this.productForm.get('mrpPrice')?.value,
      offerPrice: this.productForm.get('offerPrice')?.value,
      stock: this.productForm.get('stock')?.value,
      moq: this.productForm.get('moq')?.value,
      stockWarning: this.productForm.get('stockWarning')?.value,
      description: this.productForm.get('description')?.value,
      features: this.productForm.get('features')?.value,
      categories: this.selectedCategories,
      brand: this.selectedBrand,
      additionalbutton: this.productForm.get('additionalbutton')?.value,
      buttonredireturl: this.productForm.get('buttonredireturl')?.value,
      isActive: this.productForm.get('isActive')?.value,
      isArchive: this.productForm.get('isArchive')?.value,
      isFeatured: this.productForm.get('isFeatured')?.value,
      returnable: this.productForm.get('returnable')?.value,
      returnDays: this.productForm.get('returnDays')?.value,
      shippingMethod: this.productForm.get('shippingMethod')?.value,
      shippingCost: this.productForm.get('shippingCost')?.value,
      value: this.productForm.get('value')?.value,
      unit: this.productForm.get('unit')?.value,
      tax: this.productForm.get('taxClassId')?.value,
      cod: this.productForm.get('cod')?.value,
      codCharge: this.productForm.get('codCharge')?.value,
      searchKeywords: this.searchKeyowrds,
      relatedProducts: this.selectedProducts,
      position: this.productForm.get('position')?.value,
      files: this.files,
      video: this.videoFile,
      thumbFilename: this.thumbnailFilename,
      thumbFilestring: this.thumbnailImage,
      style: {
        background: this.productForm.get('background')?.value,
        border: this.productForm.get('border')?.value,
        radius: this.productForm.get('radius')?.value,
        text: {
          color: this.productForm.get('color')?.value,
          fontSize: this.productForm.get('fontSize')?.value,
          fontWeight: this.productForm.get('fontWeight')?.value,
        }
      }
    }

    return data
  }
}
