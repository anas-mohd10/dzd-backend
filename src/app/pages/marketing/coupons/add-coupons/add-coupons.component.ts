import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-add-coupons',
  templateUrl: './add-coupons.component.html',
  styleUrls: ['./add-coupons.component.scss']
})
export class AddCouponsComponent implements OnInit {
  couponForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  fileData: File;
  isSubmitted: boolean;
  appRoute = appRoutes;
  categoriesData: any
  productsData: any
  collectionsData: any
  categoriesId: any = [];
  productsId: any = [];
  collectionsId: any = [];
  categoryNames: any = []
  productNames: any = []
  collectionNames: any = []

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private couponsService: CouponsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.managePage();
    this.getProducts()
    this.getCategories()
    this.getCollections
  }

  initForm() {
    this.couponForm = this.formBuilder.group({
      title: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      file: [''],
      maxDiscount: [''],
      minPurchase: [''],
      categories: [Validators.required],
      products: [Validators.required],
      collections: [Validators.required],
      isMultiple: ['false', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get cf() {
    return this.couponForm.controls;
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

  getCollections() {
    this.collectionService.getCollection().subscribe((res: any) => {
      this.collectionsData = res?.result
    })
  }

  getCategories() {
    this.categoryService.getCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
    })
  }

  tagCategoryInput() {
    let category = this.couponForm.get('categories')?.value
    if (!this.categoriesId.includes(category)) {
      this.categoriesId.push(category)
      for (let i = 0; i < this.categoriesData.length; i++) {
        if (category == this.categoriesData[i]._id) {
          this.categoryNames.push(this.categoriesData[i].name);
        }
      }
    } else {
      this.toastr.info('Category Already Added');
    }
    this.couponForm.get('categories')?.setValue('');
  }

  tagCategoryRemove(category: any) {
    const index = this.categoryNames.indexOf(category);
    if (index > -1) {
      this.categoryNames.splice(index, 1);
    }
    for (let i = 0; i < this.categoriesData.length; i++) {
      if (this.categoriesData[i].name == category) {
        this.categoriesId.pop(this.categoriesData[i]._id);
      }
    }
  }

  tagProductInput() {
    let product = this.couponForm.get('products')?.value
    if (!this.productsId.includes(product)) {
      this.productsId.push(product)
      for (let i = 0; i < this.productsData.length; i++) {
        if (product == this.productsData[i]._id) {
          this.productNames.push(this.productsData[i].name);
        }
      }
    } else {
      this.toastr.info("Product already added");
    }
    this.couponForm.get('products')?.setValue('');
  }

  tagProductRemove(product: any) {
    const index = this.productNames.indexOf(product);
    if (index > -1) {
      this.productNames.splice(index, 1);
    }
    for (let i = 0; i < this.productsData.length; i++) {
      if (this.productsData[i].name == product) {
        this.productsId.pop(this.productsData[i]._id);
      }
    }
  }

  tagCollectionInput() {
    let collection = this.couponForm.get('collections')?.value
    if (!this.collectionsId.includes(collection)) {
      this.collectionsId.push(collection)
      for (let i = 0; i < this.collectionsData.length; i++) {
        if (collection == this.collectionsData[i]._id) {
          this.collectionNames.push(this.collectionsData[i].name);
        }
      }
    } else {
      this.toastr.info("Collection already added");
    }
    this.couponForm.get('collections')?.setValue('');
  }

  tagCollectionRemove(collection: any) { }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCoupon();
    } else {
      this.addCoupon();
    }
  }

  updateCoupon() { }

  addCoupon() {
    if (!this.couponForm.valid) {
      console.error("Validation error")
      return;
    }
    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    formData.append('title', this.couponForm.value?.title);
    formData.append('code', this.couponForm.value?.code);
    formData.append('type', this.couponForm.value?.type);
    formData.append('value', this.couponForm.value?.value);
    formData.append('fromDate', new Date(this.couponForm.value?.fromDate).toDateString());
    formData.append('lastDate', new Date(this.couponForm.value?.lastDate).toDateString());
    formData.append('maxDiscount', this.couponForm.value?.maxDiscount);
    formData.append('minPurchase', this.couponForm.value?.minPurchase);
    formData.append('categories', this.categoriesId);
    formData.append('products', this.productsId);
    formData.append('collections', this.collectionsId);
    formData.append('isMultiple', this.couponForm.value?.isMultiple);
    formData.append('isActive', this.couponForm.value?.isActive);

    console.log("Form data values :: " + formData);

    // this.couponsService.addCoupon(formData).subscribe((res: any) => {
    //   if (res.errorCode != 0) {
    //     this.toastr.error('Something went wrong');
    //   } else if (res.errorCode == 0) {
    //     this.toastr.success('Coupons added successfully');
    //     this.router.navigate([this.appRoute.coupons.COUPONS_LIST]);
    //   }
    // })
  }
}
