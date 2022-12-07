import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  selector: 'app-update-variant-product',
  templateUrl: './update-variant-product.component.html',
  styleUrls: ['./update-variant-product.component.scss'],
})
export class UpdateVariantProductComponent implements OnInit {
  productForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  params: any;
  fileData: File;
  isChecked = false;
  productType: any;
  isSingle: boolean = false;
  brandData: any;
  selected: any;
  filtered: any;
  categoryData: any;
  taxClassData: any;
  valueArray: any;
  productData: any;
  categoryNames: any = [];
  categoryArray: any = [];
  productSlug: any;
  productsData: any;
  uploadedImg: any = '';
  isReturn: boolean = false;
  isShipping: boolean = false;
  isCod: boolean = false;
  method: any;
  cod: any;
  relProductNames: any = [];
  relProductIds: any = [];
  returnValue: any;

  croppedImage: string | null | undefined;
  thumbnailImage: string | null | undefined;

  loadImage: boolean;
  loadThumbnailImage: boolean;

  imageChangedEvent: Event | undefined;
  imageThumbnailChangedEvent: Event | undefined;

  filename: any;
  thumbnailFilename: any

  filedata: File;
  fileThumbnaildata: File

  type: any;
  uploadedimg: any;
  uploadedThumbnailImg: any
  base: string;
  //Styling variables
  background: any
  border: any
  color: any
  selectedCategories: any = []
  selectedBrand: any = ''
  selectedProducts: any = []
  errors: any
  validError: any
  isArchived: any

  restore = new FormControl('false');

  p_img: any
  tp_img: any

  format: string | undefined;
  url: string | ArrayBuffer | null | undefined;
  playVideo: boolean;
  video: string | ArrayBuffer | null;
  videoFile: any = {}
  files: any = [];
  imageFiles: any = [];

  showLoader: Boolean = false
  slug: any;
  parentName: any;
  parent: any;
  refid: any;
  disableButton: boolean;
  searchKeyowrds: any;

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
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.slug = this.route.snapshot.queryParams.id || ''
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();

    this.VariantProductService.getVariantProductBySlug(this.slug).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.parent = res?.result[0]?._id
        this.refid = res?.result[0]?.prodid
        this.parentName = res?.result[0]?.name
        //Form values start
        this.uploadedImg = res?.result[0]?.file;
        this.productForm.get('name')?.setValue(res?.result[0]?.name);
        this.productForm.get('sku')?.setValue(res?.result[0]?.sku);
        this.productForm.get('hsn')?.setValue(res?.result[0]?.hsn);
        this.productForm.get('mrpPrice')?.setValue(res?.result[0]?.mrpPrice);
        this.productForm.get('offerPrice')?.setValue(res?.result[0]?.offerPrice);
        this.productForm.get('stock')?.setValue(res?.result[0]?.stock);
        this.productForm.get('moq')?.setValue(res?.result[0]?.moq);
        this.productForm.get('additionalbutton')?.setValue(res?.result[0]?.additionalbutton);
        this.productForm.get('buttonredireturl')?.setValue(res?.result[0]?.buttonredireturl);
        this.productForm.get('isFeatured')?.setValue(res?.result[0]?.isFeatured);
        this.productForm.get('isActive')?.setValue(res?.result[0]?.isActive);
        this.productForm.get('returnable')?.setValue(res?.result[0]?.returnable);
        this.productForm.get('returnDays')?.setValue(res?.result[0]?.returnDays);
        this.productForm.get('shippingMethod')?.setValue(res?.result[0]?.shippingMethod);
        this.productForm.get('value')?.setValue(res?.result[0]?.value);
        this.productForm.get('unit')?.setValue(res?.result[0]?.unit);
        this.productForm.get('cod')?.setValue(res?.result[0]?.cod);
        this.productForm.get('codCharge')?.setValue(res?.result[0]?.codCharge);
        this.productForm.get('shippingCost')?.setValue(res?.result[0]?.shippingCost);
        this.productForm.get('position')?.setValue(res?.result[0]?.position);
        this.productForm.get('cod')?.setValue(res?.result[0]?.cod);
        this.productForm.get('codCharge')?.setValue(res?.result[0]?.codCharge);
        this.productForm.get('stockWarning')?.setValue(res?.result[0]?.stockWarning);
        this.productForm.get('description')?.setValue(res?.result[0]?.description);
        this.productForm.get('features')?.setValue(res?.result[0]?.features);
        this.productForm.get('relatedProducts')?.setValue(res?.result[0]?.relatedProducts);
        this.productForm.get('taxClassId')?.setValue(res?.result[0]?.tax);
        this.color = res?.result[0]?.text.color
        this.background = res?.result[0]?.background
        this.border = res?.result[0]?.border
        this.selectedCategories = res?.result[0]?.categories
        this.selectedBrand = res?.result[0]?.brand
        this.selectedProducts = res?.result[0]?.relatedProducts
        this.cod = res?.result[0]?.cod;

        for (let i = 0; i < res?.result[0]?.categories.length; i++) {
          this.categoryArray.push(res?.result[0]?.categories[i]._id)
          this.categoryNames.push(res?.result[0]?.categories[i].name);
        }

        for (let i = 0; i < res?.result[0]?.relatedProducts.length; i++) {
          this.relProductIds.push(res?.result[0]?.relatedProducts[i]._id)
          this.relProductNames.push(res?.result[0]?.relatedProducts[i].name)
        }

        this.valueArray = res?.result[0]?.searchKeywords

        this.returnValue = res?.result[0]?.returnable;
        if (this.returnValue == true) {
          this.isReturn = true;
        }
        if (this.returnValue == false) {
          this.isReturn = false;
        }

        this.method = res?.result[0]?.shippingMethod;
        if (this.method == 'paid') {
          this.isShipping = true;
        }
        if (this.method == 'unpaid' || this.method == 'external') {
          this.isShipping = false;
        }
        if (this.cod == true) {
          this.isCod = true;
        }
        if (this.cod == false) {
          this.isCod = false;
        }
        //Form values end

        this.cdr.markForCheck()
      }
    })
  }

  compareFn(item: any, selected: any) {
    return item._id === selected._id;
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

  tagInput(event: any) {
    let _value = event.value
    if (_value) {
      this.valueArray.push(this.productForm.get('searchKeywords')?.value);
      this.productForm.get('searchKeywords')?.setValue('');
    }
  }

  tagRemove(value: any) {
    const index = this.valueArray.indexOf(value);
    if (index > -1) {
      this.valueArray.splice(index, 1);
    }
    for (let i = 0; i < this.valueArray.length; i++) {
      if (this.valueArray[i] == value) {
        this.valueArray.pop(value);
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
      this.cdr.markForCheck()
    });
  }

  getCategoryDetail() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
      this.cdr.markForCheck()
    });
  }

  getTaxClassDetail() {
    this.taxClassService.getTaxClasses().subscribe((res: any) => {
      this.taxClassData = res?.result;
      this.cdr.markForCheck()
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
  }

  handleInputThumbnailChange(event: any) {
    this.fileThumbnaildata = <File>event.target.files[0];
    this.thumbnailFilename = this.fileThumbnaildata.name
    this.imageThumbnailChangedEvent = event;
    this.loadThumbnailImage = true
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

  imageThumbnailCropped(event: ImageCroppedEvent) {
    this.thumbnailImage = event.base64;
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

  restoreProduct() { }
}
