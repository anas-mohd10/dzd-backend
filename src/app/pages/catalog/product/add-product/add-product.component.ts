import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;

  filedata: File;
  type: any;
  isSingle: boolean = false;

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
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;

  //Styling variables
  background: any
  border: any
  color: any

  selectedCategories: any = []
  selectedBrand: any = ''
  selectedProducts: any = []

  errors: any
  validError: any

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private toastr: ToastrService
  ) { }

  get pf() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      isSingle: ['false'],
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
      returnable: ['', Validators.required],
      returnDays: [''],
      shippingMethod: ['', Validators.required],
      shippingCost: [''],
      value: ['', Validators.required],
      unit: ['', Validators.required],
      taxClassId: ['', Validators.required],
      cod: ['', Validators.required],
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

  //Category tag input
  tagCategoryInput() {
    if (!this.categoryid.includes(this.productForm.get('categories')?.value)) {
      this.categoryid.push(this.productForm.get('categories')?.value);
      for (let i = 0; i < this.categoryData.length; i++) {
        if (this.productForm.get('categories')?.value == this.categoryData[i]._id) {
          this.categoryNames.push(this.categoryData[i].name);
        }
      }
    } else {
      this.toastr.info('Category Already Added');
    }
    this.productForm.get('categories')?.setValue('');
  }

  //Category tag remove
  tagCategoryRemove(category: any) {
    const index = this.categoryNames.indexOf(category);
    if (index > -1) {
      this.categoryNames.splice(index, 1);
    }
    for (let i = 0; i < this.categoryData.length; i++) {
      if (this.categoryData[i].name == category) {
        this.categoryid.pop(this.categoryData[i]._id);
      }
    }
  }

  //Search keywords input
  tagInput() {
    if (this.productForm.get('searchKeywords')?.value != ' ' || '' || null) {
      this.searchKeyowrds.push(this.productForm.get('searchKeywords')?.value);
      this.productForm.get('searchKeywords')?.setValue('');
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

  handleInputChange(event: any) {
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
    console.log(this.selectedCategories);

    if (!this.productForm.valid) {
      return;
    }

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
      filestring: this.croppedImage,
      filename: this.filename,
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

    this.productService.addProduct(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Product added successfully');
        this.router.navigate([this.appRoute.product.PRODUCT_LIST]);
        this.ngOnInit();
      }
    });
  }
}
