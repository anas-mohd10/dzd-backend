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
  selector: 'app-update-coupons',
  templateUrl: './update-coupons.component.html',
  styleUrls: ['./update-coupons.component.scss']
})
export class UpdateCouponsComponent implements OnInit {
  couponForm: FormGroup;
  task = PageTasks.UPDATE;
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
  slug: any;
  couponData: any;
  uploadedImg: any;
  isGreater: boolean = false;

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
    this.slug = this.route.snapshot.queryParams.coupon || ''
    this.getProducts()
    this.getCategories()
    this.getCollections()
    this.getCouponBySlug()
  }

  initForm() {
    this.couponForm = this.formBuilder.group({
      title: [''],
      code: [''],
      type: [''],
      value: [''],
      fromDate: [''],
      lastDate: [''],
      file: [''],
      maxDiscount: [''],
      minPurchase: [''],
      categories: [],
      products: [],
      collections: [['']],
      isMultiple: ['false'],
      isActive: ['true'],
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

  getCouponBySlug() {
    this.couponsService.getCouponBySlug(this.slug).subscribe((res: any) => {
      this.couponData = res?.result[0]
      this.uploadedImg = this.couponData?.file
      this.couponForm.get("title")?.setValue(this.couponData.title)
      this.couponForm.get("code")?.setValue(this.couponData.code)
      this.couponForm.get("type")?.setValue(this.couponData.type)
      this.couponForm.get("value")?.setValue(this.couponData.value)
      this.couponForm.get("fromDate")?.setValue(this.couponData.fromDate)
      this.couponForm.get("lastDate")?.setValue(this.couponData.lastDate)
      this.couponForm.get("maxDiscount")?.setValue(this.couponData.maxDiscount)
      this.couponForm.get("minPurchase")?.setValue(this.couponData.minPurchase)
      this.couponForm.get("isActive")?.setValue(this.couponData.isActive)
      this.couponForm.get("isMultiple")?.setValue(this.couponData.isMultiple)

      for (let product of this.couponData.products) {
        this.productsId.push(product._id)
        this.productNames.push(product.name)
      }

      for (let category of this.couponData.categories) {
        this.categoriesId.push(category._id)
        this.categoryNames.push(category.name)
      }

      for (let collection of this.couponData.collections) {
        this.collectionsId.push(collection._id)
        this.collectionNames.push(collection.name)
      }
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


  tagCollectionRemove(collection: any) {
    const index = this.collectionNames.indexOf(collection);
    if (index > -1) {
      this.collectionNames.splice(index, 1);
    }
    for (let i = 0; i < this.collectionsData.length; i++) {
      if (this.collectionsData[i].name == collection) {
        this.collectionsId.pop(this.collectionsData[i]._id);
      }
    }
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  checkPercentage() {
    let type = this.couponForm.get("type")?.value
    let value = this.couponForm.get("value")?.value
    if (type == "%") {
      if (value > 100) {
        this.toastr.warning("Value should be between 0 and 100")
        this.isGreater = true
      }else{
        this.isGreater = false
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCoupon();
    } else {
      this.addCoupon();
    }
  }

  updateCoupon() {
    if (!this.couponForm.valid) {
      console.error("Validation error")
      return;
    }
    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    } else {
      formData.append('file', this.uploadedImg);
    }

    for (const data of Object.keys(this.couponForm.value)) {
      if (data != 'collections' || 'categories' || 'products') {
        formData.append(data, this.couponForm.value[data]);
      }
    }

    formData.append('categories', JSON.stringify(this.categoriesId));
    formData.append('products', JSON.stringify(this.productsId));
    formData.append('collections', JSON.stringify(this.collectionsId));

    if (this.isGreater == false) {
      this.couponsService.updateCoupon(this.slug, formData).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Coupons added successfully');
          this.router.navigate([this.appRoute.coupons.COUPONS_LIST]);
        }
      })
    } else if (this.isGreater == true) {
      this.toastr.warning("Value should be between 0 and 100")
    }
  }

  addCoupon() {
  }
}
