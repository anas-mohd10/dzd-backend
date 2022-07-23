import { Component, OnInit } from '@angular/core';
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
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { VariantProductService } from 'src/app/includes/services/variant.product.service';
import { ProductService } from 'src/app/includes/services/product.service';

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
  valueArray: any = [];
  variantProductValues: any;
  categoryNames: any = [];
  categoryArray: any = [];
  slug: any;
  parentProductId: any;
  parentValues: any;
  uploadedImg: any;
  productsData: any;
  returnValue: any;
  isReturn: boolean = false;
  isShipping: boolean = false;
  isCod: boolean = false;
  method: any;
  cod: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private variantProductService: VariantProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private toastr: ToastrService
  ) {}

  get pf() {
    return this.productForm.controls;
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  handleCheckBox() {
    if (this.isChecked == false) {
      this.isChecked = true;
    } else if (this.isChecked == true) {
      this.isChecked = false;
    }
  }

  checkReturnable() {
    this.returnValue = this.productForm.get('returnable')?.value;
    if (this.returnValue == true) {
      this.isReturn = true;
    }
    if (this.returnValue == false) {
      this.isReturn = false;
    }
  }

  checkShippingMethod() {
    this.method = this.productForm.get('shippingMethod')?.value;
    if (this.method == 'paid') {
      this.isShipping = true;
    }
    if (this.method == 'unpaid' || this.method == 'external') {
      this.isShipping = false;
    }
  }

  checkCod() {
    this.cod = this.productForm.get('cod')?.value;
    if (this.cod == true) {
      this.isCod = true;
    }
    if (this.cod == false) {
      this.isCod = false;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.slug = this.route.snapshot.queryParams.product || '';
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();
    this.getVariantProductBySlug();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: [''],
      sku: [''],
      hsn: [''],
      mrpPrice: [''],
      offerPrice: [''],
      stock: [''],
      moq: [''],
      stockWarning: [''],
      description: [''],
      features: [''],
      categories: [], //Array with category id's
      brandId: [''],
      additionalbutton: [''],
      buttonredireturl: [''],
      isFeatured: [''],
      isActive: [''],
      returnable: [''],
      returnDays: [''],
      shippingMethod: [''],
      shippingCost: [''],
      weight: [''],
      taxClassId: [''],
      cod: [''],
      codCharge: [''],
      searchKeywords: [], //Array with user entered search keywords
      relatedProducts: [''],
      position: [''],
      file: [''],
    });
  }

  handleProductType() {
    this.productType = this.productForm.get('isSingle')?.value;
    console.log(this.productType);
    if (this.productType == 'true') {
      this.isSingle = true;
    } else if (this.productType == 'false') {
      this.isSingle = false;
    }
  }

  tagCategoryInput() {
    if (
      !this.categoryArray.includes(this.productForm.get('categories')?.value)
    ) {
      this.categoryArray.push(this.productForm.get('categories')?.value);
      for (let i = 0; i < this.categoryData.length; i++) {
        if (
          this.productForm.get('categories')?.value == this.categoryData[i]._id
        ) {
          this.categoryNames.push(this.categoryData[i].name);
        }
      }
    } else {
      this.toastr.info('Category Already Added');
    }
    this.productForm.get('categories')?.setValue('');
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
    if (
      this.productForm.get('searchKeywords')?.value != ' ' ||
      '' ||
      this.productForm.get('searchKeywords')?.value == null
    ) {
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

  getVariantProductBySlug() {
    this.variantProductService
      .getVariantProductBySlug(this.slug)
      .subscribe((res: any) => {
        this.variantProductValues = res?.result[0];
        this.uploadedImg = this.variantProductValues?.file;
        this.productForm.get('name')?.setValue(this.variantProductValues.name);
        this.productForm.get('sku')?.setValue(this.variantProductValues.sku);
        this.productForm.get('hsn')?.setValue(this.variantProductValues.hsn);
        this.productForm
          .get('mrpPrice')
          ?.setValue(this.variantProductValues.mrpPrice);
        this.productForm
          .get('offerPrice')
          ?.setValue(this.variantProductValues.offerPrice);
        this.productForm
          .get('stock')
          ?.setValue(this.variantProductValues.stock);
        this.productForm.get('moq')?.setValue(this.variantProductValues.moq);
        this.productForm
          .get('additionalbutton')
          ?.setValue(this.variantProductValues.additionalbutton);
        this.productForm
          .get('buttonredireturl')
          ?.setValue(this.variantProductValues.buttonredireturl);
        this.productForm
          .get('isFeatured')
          ?.setValue(this.variantProductValues.isFeatured);
        this.productForm
          .get('isActive')
          ?.setValue(this.variantProductValues.isActive);
        this.productForm
          .get('returnable')
          ?.setValue(this.variantProductValues.returnable);
        this.productForm
          .get('returnDays')
          ?.setValue(this.variantProductValues.returnDays);
        this.productForm
          .get('shippingMethod')
          ?.setValue(this.variantProductValues.shippingMethod);
        this.productForm
          .get('weight')
          ?.setValue(this.variantProductValues.weight);
        this.productForm.get('cod')?.setValue(this.variantProductValues.cod);
        this.productForm
          .get('codCharge')
          ?.setValue(this.variantProductValues.codCharge);
        this.productForm
          .get('shippingCost')
          ?.setValue(this.variantProductValues.shippingCost);
        this.productForm
          .get('position')
          ?.setValue(this.variantProductValues.position);
        this.productForm.get('cod')?.setValue(this.variantProductValues.cod);
        this.productForm
          .get('codCharge')
          ?.setValue(this.variantProductValues.codCharge);
        this.productForm
          .get('stockWarning')
          ?.setValue(this.variantProductValues.stockWarning);
        this.productForm
          .get('description')
          ?.setValue(this.variantProductValues.description);
        this.productForm
          .get('features')
          ?.setValue(this.variantProductValues.features);
        this.productForm
          .get('relatedProducts')
          ?.setValue(this.variantProductValues.relatedProducts);
        this.productForm
          .get('brandId')
          ?.setValue(this.variantProductValues.brandId._id);
        this.productForm
          .get('taxClassId')
          ?.setValue(this.variantProductValues.taxClassId._id);
        for (let category of this.variantProductValues.categories) {
          this.categoryArray.push(category._id);
          this.categoryNames.push(category.name);
        }
        for (let search of this.variantProductValues.searchKeywords) {
          this.valueArray.push(search);
        }
        this.returnValue = this.variantProductValues.returnable;
        if (this.returnValue == true) {
          this.isReturn = true;
        }
        if (this.returnValue == false) {
          this.isReturn = false;
        }

        this.method = this.variantProductValues.shippingMethod;
        if (this.method == 'paid') {
          this.isShipping = true;
        }
        if (this.method == 'unpaid' || this.method == 'external') {
          this.isShipping = false;
        }

        this.cod = this.variantProductValues.cod;
        if (this.cod == true) {
          this.isCod = true;
        }
        if (this.cod == false) {
          this.isCod = false;
        }
      });
  }

  onOptionsSelected() {
    this.filtered = this.brandData.filter(
      (t: { value: any }) => t.value == this.selected
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  updateProduct() {
    if (!this.productForm.valid) {
      return;
    }

    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    } else {
      formData.append('file', this.uploadedImg);
    }

    for (const data of Object.keys(this.productForm.value)) {
      if (data != 'values' || 'categories') {
        formData.append(data, this.productForm.value[data]);
      }
    }

    formData.append('searchKeywords', this.valueArray);
    formData.append('categories', this.categoryArray);
    formData.append('parentId', this.variantProductValues.parentId._id);

    this.variantProductService
      .updateVariantProduct(this.slug, formData)
      .subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something Went Wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Product Added Successfully');
          this.router.navigate(
            [this.appRoute.variantProduct.VARIANT_PRODUCT_LIST],
            {
              queryParams: { product: this.variantProductValues.parentId.slug },
            }
          );
          this.ngOnInit();
        }
      });
  }

  addProduct() {}

  btnClick() {}
}
