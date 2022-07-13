import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';

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
  isConfigurable: boolean = false;
  brandData: any;
  selected: any;
  filtered: any;
  categoryData: any;
  taxClassData: any;
  valueArray: any = []
  productData: any;
  slug: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService
  ) {}

  get pf() {
    return this.productForm.controls;
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer? fileInput.dataTransfer.files[0]: fileInput.target.files[0];
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
    this.slug = this.route.snapshot.queryParams.product || ''
    this.params = this.route.snapshot;
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail()
    this.getTaxClassDetail()
    this.getProducts()
    this.getProductBySlug()
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      productType: ['Configurable'],
      name: [''],
      sku: [''],
      hsn: [''],
      mrpPrice: [''],
      offerprice: [''],
      stock: [''],
      moq: [''],
      stockwarning: [''],
      productdescription: [''],
      featuredescription: [''],
      category: ['example'],
      brand: ['example'],
      additionalbutton: [''],
      buttonredireturl: [''],
      featured: [''],
      returnable: [''],
      cod: [''],
      shippingCost: [''],
      taxClass: ['example'],
      returndays: [''],
      weight: [''],
      position: [''],
      productDescription: [''],
      featuredDescription: [''],
      shippingMethod: [''],
      codCharge: [''],
      values: [''],
      relatedProducts: ['example']
    });
  }

  handleProductType() {
    this.productType = this.productForm.get('productType');
    if (this.productType.value == 'single') {
      this.isSingle = true;
    } else if (this.productType.value == 'configurable') {
      this.isSingle = false;
    }
  }

  tagInput(){
    if ((this.productForm.get('values')?.value != ' ' || '') || (this.productForm.get('values')?.value == null )) {
      this.valueArray.push(this.productForm.get('values')?.value);
      this.productForm.get('values')?.setValue('');
    }
  }

  tagRemove(value: any){
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
    this.productService.getProductBySlug(this.slug).subscribe((res: any) => {
      this.productData = res?.result[0]
      if(this.productData.productType == "Single"){
        this.isConfigurable = false
      }else if (this.productData.productType == "Configurable"){
        this.isConfigurable = true
      }
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
    console.log(this.productForm.value)
  }
}
