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
  productData: any;
  categoryNames: any = [];
  categoryArray: any = [];
  slug: any;
  parentProductId: any;

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


  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.slug = this.route.snapshot.queryParams.product || '';
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();
    this.getProductBySlug()
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: [''],
      sku: [''],
      hsn: [''],
      mrpPrice: [''],
      offerprice: ['',],
      stock: [''],
      moq: [''],
      stockWarning: ['',],
      description: ['',],
      features: ['',],
      categories: [], //Array with category id's
      brandId: ['',],
      additionalbutton: ['',],
      buttonredireturl: ['',],
      isFeatured: ['',],
      returnable: ['',],
      returnDays: ['',],
      shippingMethod: ['',],
      shippingCost: ['',],
      weight: ['',],
      taxClassId: ['',],
      cod: ['',],
      codCharge: ['',],
      searchKeywords: [], //Array with user entered search keywords
      relatedProducts: ['',],
      position: ['',],
    });
  }

  handleProductType() {
    this.productType = this.productForm.get('isSingle')?.value;
    console.log(this.productType)
    if (this.productType == 'true') {
      this.isSingle = true;
    } else if (this.productType == 'false') {
      this.isSingle = false;
    }
  }

  tagCategoryInput() {
    if (!this.categoryArray.includes(this.productForm.get('categories')?.value)) {
      this.categoryArray.push(this.productForm.get('categories')?.value);
      for(let i=0; i<this.categoryData.length; i++){
        if(this.productForm.get('categories')?.value == this.categoryData[i]._id){
          this.categoryNames.push(this.categoryData[i].name)
        }
      }
    }else{
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
    if (this.productForm.get('searchKeywords')?.value != ' ' || '' || this.productForm.get('searchKeywords')?.value == null) {
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
      this.productData = res?.result;
    });
  }

  getProductBySlug(){
    this.productService.getProductBySlug(this.slug).subscribe((res: any)=>{
      this.parentProductId = res?.result[0]._id
    })
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

  updateProduct() {}

  addProduct() {
    if (!this.productForm.valid) {
      return;
    }

    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }

    for (const data of Object.keys(this.productForm.value)) {
      if(data != "values"  || "categories"){
        formData.append(data, this.productForm.value[data]);
      }
    }
   
    formData.append("searchKeywords", this.valueArray)
    formData.append("categories", this.categoryArray)
    formData.append("parentId", this.parentProductId)

    this.variantProductService.addVariantProduct(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Product Added Successfully');
        this.router.navigate([this.appRoute.product.PRODUCT_LIST]);
        this.ngOnInit();
      }
    });
  }
}
