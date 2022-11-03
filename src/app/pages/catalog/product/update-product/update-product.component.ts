import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
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
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;
  filedata: File;
  type: any;
  uploadedimg: any;
  base: string;

  //Styling variables
  background: any
  border: any
  color: any

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

  tagCategoryInput() {
    if (!this.categoryArray.includes(this.productForm.get('categories')?.value)) {
      this.categoryArray.push(this.productForm.get('categories')?.value);
      for (let i = 0; i < this.categoryData.length; i++) {
        if (this.productForm.get('categories')?.value == this.categoryData[i]._id) {
          this.categoryNames.push(this.categoryData[i].name);
        }
      }
    } else {
      this.toastr.info('Category Already Added');
    }
    // this.productForm.get('categories')?.setValue('');
  }

  tagCategoryRemove(category: any) {
    const index = this.categoryNames.indexOf(category);
    if (index > -1) {
      this.categoryNames.splice(index, 1);
    }
    for (let i = 0; i < this.categoryData.length; i++) {
      if (this.categoryData[i].name == category) {
        this.categoryArray.pop(this.categoryData[i]._id);
      }
    }
  }

  tagInput() {
    if (this.productForm.get('searchKeywords')?.value != ' ' || '' || null) {
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
    this.brandService.getBrand().subscribe((res: any) => {
      this.brandData = res?.result;
    });
  }

  getCategoryDetail() {
    this.categoryService.getCategory().subscribe((res: any) => {
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
      this.uploadedimg = this.productData?.file;
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

      this.color = this.productData.style.text.color
      this.background = this.productData.style.background
      this.border = this.productData.style.border

      for (let i = 0; i < this.productData.categories.length; i++) {
        this.categoryArray.push(this.productData.categories[i]._id)
        this.categoryNames.push(this.productData.categories[i].name);
      }

      for (let i = 0; i < this.productData.relatedProducts.length; i++) {
        this.relProductIds.push(this.productData.relatedProducts[i]._id)
        this.relProductNames.push(this.productData.relatedProducts[i].name)
      }

      this.valueArray = this.productData.searchKeywords
      for (let brand of this.brandData) {
        if (this.productData.brandId == brand._id) {
          this.productForm.get('brandId')?.setValue(brand._id);
        }
      }
      for (let tax of this.taxClassData) {
        if (this.productData.taxClassId._id == tax._id) {
          this.productForm.get('taxClassId')?.setValue(tax._id);
        }
      }
      this.cod = this.productData.cod;
      if (this.cod == true) {
        this.isCod = true;
      }
      if (this.cod == false) {
        this.isCod = false;
      }
      this.method = this.productData.shippingMethod;
      if (this.method == 'paid') {
        this.isShipping = true;
      }
      if (this.method == 'unpaid' || this.method == 'external') {
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

  onOptionsSelected() {
    this.filtered = this.brandData.filter(
      (t: { value: any }) => t.value == this.selected
    );
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
      categories: this.categoryArray,
      brandId: this.productForm.get('brandId')?.value,
      additionalbutton: this.productForm.get('additionalbutton')?.value,
      buttonredireturl: this.productForm.get('buttonredireturl')?.value,
      isActive: this.productForm.get('isActive')?.value,
      isFeatured: this.productForm.get('isFeatured')?.value,
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
      relatedProducts: this.relProductIds,
      position: this.productForm.get('position')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      file: '',
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

    if (this.uploadedimg) {
      data.file = this.uploadedimg
    }

    this.productService
      .updateProduct(this.productSlug, data)
      .subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something Went Wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Product Added Successfully');
          this.router.navigate([this.appRoute.product.PRODUCT_LIST]);
        }
      });
  }
}
