import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})

export class UpdateProductComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private attributeService: AttributeService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  get pf() {
    return this.productForm.controls;
  }

  handleCheckBox() {
    if (this.isChecked == false) {
      this.isChecked = true;
    } else if (this.isChecked == true) {
      this.isChecked = false;
    }
  }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.productSlug = this.route.snapshot.queryParams.product || '';
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();
    this.getProductBySlug();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      isSingle: [''],
      name: [''],
      sku: [''],
      hsn: [''],
      mrpPrice: ['0'],
      offerPrice: ['0'],
      stock: ['0'],
      moq: ['0'],
      stockWarning: [''],
      description: [''],
      features: [''],
      categories: [],
      brandId: [''],
      additionalbutton: [''],
      buttonredireturl: [''],
      isFeatured: [''],
      isActive: [''],
      isArchive: [''],
      returnable: [''],
      returnDays: [''],
      shippingMethod: [''],
      shippingCost: [''],
      value: [''],
      unit: [''],
      taxClassId: [''],
      cod: [''],
      codCharge: [''],
      searchKeywords: [],
      relatedProducts: [''],
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

  //Check whether the product is single or configurable
  handleProductType(event: any) {
    this.type = event.value;
    if (this.type == 'true') {
      this.isSingle = true;
    } else if (this.type == 'false') {
      this.isSingle = false;
    }
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
    this.method = event.value;
    if (this.method == 'paid') {
      this.isShipping = true;
    }
    if (this.method == 'unpaid' || this.method == 'external') {
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
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.productsData = res?.result;
      this.cdr.markForCheck()
    });
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

  getProductBySlug() {
    this.productService.getProductBySlug(this.productSlug).subscribe((res: any) => {
      this.productData = res?.result[0];
      this.cdr.markForCheck()
      this.productType = this.productData.isSingle;
      if (this.productType == true) {
        this.isSingle = true;
      } else if (this.productType == false) {
        this.isSingle = false;
      }
      for (let i = 0; i < this.productData?.files?.length; i++) {
        this.imageFiles.push({ url: this.base + "/" + this.productData?.files[i], id: i })
        this.files.push({ url: this.productData?.files[i], id: i })
      }
      if (this.productData?.video) {
        this.video = this.base + "/" + this.productData?.video
        this.videoFile = this.productData?.video
      }
      if (this.productData.isArchive == true) {
        this.isArchived = true
      }
      this.uploadedThumbnailImg = this.productData?.thumbnail
      this.tp_img = this.base + "/" + this.productData?.thumbnail
      this.productForm.get('isSingle')?.setValue(this.productType);
      this.productForm.get('name')?.setValue(this.productData.name);
      this.productForm.get('sku')?.setValue(this.productData.sku);
      this.productForm.get('hsn')?.setValue(this.productData.hsn);
      this.productForm.get('mrpPrice')?.setValue(this.productData.mrpPrice);
      this.productForm.get('offerPrice')?.setValue(this.productData.offerPrice);
      this.productForm.get('stock')?.setValue(this.productData.stock);
      this.productForm.get('moq')?.setValue(this.productData.moq);
      this.productForm.get('additionalbutton')?.setValue(this.productData.additionalbutton);
      this.productForm.get('buttonredireturl')?.setValue(this.productData.buttonredireturl);
      this.productForm.get('isFeatured')?.setValue(this.productData.isFeatured);
      this.productForm.get('isActive')?.setValue(this.productData.isActive);
      this.productForm.get('isArchive')?.setValue(this.productData.isArchive);
      this.productForm.get('returnable')?.setValue(this.productData.returnable);
      this.productForm.get('returnDays')?.setValue(this.productData.returnDays);
      this.productForm.get('shippingMethod')?.setValue(this.productData.shippingMethod);
      this.productForm.get('unit')?.setValue(this.productData.unit);
      this.productForm.get('value')?.setValue(this.productData.value);
      this.productForm.get('cod')?.setValue(this.productData.cod);
      this.productForm.get('codCharge')?.setValue(this.productData.codCharge);
      this.productForm.get('shippingCost')?.setValue(this.productData.shippingCost);
      this.productForm.get('position')?.setValue(this.productData.position);
      this.productForm.get('cod')?.setValue(this.productData.cod);
      this.productForm.get('codCharge')?.setValue(this.productData.codCharge);
      this.productForm.get('stockWarning')?.setValue(this.productData.stockWarning);
      this.productForm.get('description')?.setValue(this.productData.description);
      this.productForm.get('features')?.setValue(this.productData.features);
      this.productForm.get('background')?.setValue(this.productData.style.background);
      this.productForm.get('border')?.setValue(this.productData.style.border);
      this.productForm.get('radius')?.setValue(this.productData.style.radius);
      this.productForm.get('color')?.setValue(this.productData.style.text.color);
      this.productForm.get('fontSize')?.setValue(this.productData.style.text.fontSize);
      this.productForm.get('fontWeight')?.setValue(this.productData.style.text.fontWeight);
      this.productForm.get('taxClassId')?.setValue(this.productData.tax);
      this.color = this.productData.style.text.color
      this.background = this.productData.style.background
      this.border = this.productData.style.border
      this.selectedCategories = this.productData.categories
      this.selectedBrand = this.productData.brand
      this.selectedProducts = this.productData.relatedProducts
      for (let i = 0; i < this.productData.categories.length; i++) {
        this.categoryArray.push(this.productData.categories[i]._id)
        this.categoryNames.push(this.productData.categories[i].name);
      }
      for (let i = 0; i < this.productData.relatedProducts.length; i++) {
        this.relProductIds.push(this.productData.relatedProducts[i]._id)
        this.relProductNames.push(this.productData.relatedProducts[i].name)
      }
      this.valueArray = this.productData.searchKeywords
      this.cod = this.productData.cod;
      if (this.cod == true) {
        this.isCod = true;
      }
      if (this.cod == false) {
        this.isCod = false;
      }
      this.method = this.productData.shippingMethod;
      if (this.method == 'Paid') {
        this.isShipping = true;
      }
      if (this.method == 'Unpaid' || this.method == 'External') {
        this.isShipping = false;
      }
      this.returnValue = this.productData.returnable;
      if (this.returnValue == true) {
        this.isReturn = true;
      }
      if (this.returnValue == false) {
        this.isReturn = false;
      }
    });
  }

  compareFn(item: any, selected: any) {
    return item._id === selected._id;
  }

  onOptionsSelected() {
    this.filtered = this.brandData.filter((t: { value: any }) => t.value == this.selected);
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
    }, 800)
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
    }, 800)
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
        this.toastr.info('Video uploading in progress', '', { timeOut: 2000 })
        setTimeout(() => {
          this.video = e.target.result
          this.toastr.success('Video successfully uploaded', '', { timeOut: 2000 })
          this.videoFile = {
            video: this.video,
            name: event.target.files[0].name
          }
          this.cdr.markForCheck()
        }, 2000)
      }
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

  addProduct() { }

  updateProduct() {
    if (!this.productForm.valid) {
      return;
    }
    const payload = this.createPayload()
    if (payload) {
      this.showLoader = true
      this.toastr.info('Updating product...', '', { timeOut: 2000 })
      setTimeout(() => {
        this.productService.updateProduct(this.productSlug, payload).subscribe((res: any) => {
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
      isSingle: this.productForm.get('isSingle')?.value,
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
      isFeatured: this.productForm.get('isFeatured')?.value,
      isArchive: this.productForm.get('isArchive')?.value,
      returnable: this.productForm.get('returnable')?.value,
      returnDays: this.productForm.get('returnDays')?.value,
      shippingMethod: this.productForm.get('shippingMethod')?.value,
      shippingCost: this.productForm.get('shippingCost')?.value,
      value: this.productForm.get('value')?.value,
      unit: this.productForm.get('unit')?.value,
      taxClassId: this.productForm.get('taxClassId')?.value,
      cod: this.productForm.get('cod')?.value,
      codCharge: this.productForm.get('codCharge')?.value,
      searchKeywords: this.valueArray,
      relatedProducts: this.selectedProducts,
      position: this.productForm.get('position')?.value,
      files: this.files,
      video: this.videoFile,
      thumbFilename: this.thumbnailFilename,
      thumbFilestring: this.thumbnailImage,
      thumbnail: this.uploadedThumbnailImg,
      style: {
        background: this.productForm.get('background')?.value,
        border: this.productForm.get('border')?.value,
        radius: this.productForm.get('radius')?.value,
        text: {
          color: this.productForm.get('color')?.value,
          fontSize: this.productForm.get('fontSize')?.value,
          fontWeight: this.productForm.get('fontWeight')?.value,
        }
      },
      prodid: this.productData.prodid
    }
    if (data.thumbFilename == '' && data.thumbFilestring == '') {
      data.thumbnail = this.uploadedThumbnailImg
    }

    return data
  }

  restoreProduct() {
    if (this.restore.value == "true") {
      this.productService.restoreProducts({ prodid: this.productData?.prodid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.product.ARCHIVED_PRODUCT]);
        } else {
          this.toastr.error(res?.message);
        }
      })
    } else {
      this.router.navigate([this.appRoute.product.ARCHIVED_PRODUCT]);
    }
  }
}
