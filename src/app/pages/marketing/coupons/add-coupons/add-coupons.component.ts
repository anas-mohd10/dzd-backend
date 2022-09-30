import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
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
  filedata: File;
  isSubmitted: boolean;
  appRoute = appRoutes;
  categoriesId: any = [];
  productsId: any = [];
  collectionsId: any = [];
  categoryNames: any = []
  productNames: any = []
  collectionNames: any = []
  croppedImage: string | null | undefined;
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;

  categories: any = []; //Array of category ids
  categoriesData: any = []; //Data fetched from database
  category: any = []; //Array of categorty name and id

  products: any = []; //Array of product ids
  productsData: any = []; //Data fetched from database
  product: any = []; //Array of product name and id

  collections: any = []; //Array of collection ids
  collectionsData: any = []; //Data fetched from database
  collection: any = []; //Array of collection name and id

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
    this.getCollections()
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
      categories: [[]],
      products: [[]],
      collections: [[]],
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

  //Tag input add function
  tagInput(event: any, type: any) {
    let value = event.value
    if (type == "category") {
      if (!this.categories.includes(value)) {
        this.categories.push(value)
        for (let category of this.categoriesData) {
          if (category?._id == value) {
            this.category.push({
              name: category?.name,
              id: category?._id
            })
          }
        }
      } else {
        this.toastr.info('Category already added')
      }
      this.couponForm.get("categories")?.setValue('')
    } else if (type == "product") {
      if (!this.products.includes(value)) {
        this.products.push(value)
        for (let product of this.productsData) {
          if (product?._id == value) {
            this.product.push({
              name: product?.name,
              id: product?._id
            })
          }
        }
      } else {
        this.toastr.info('Product already added')
      }
      this.couponForm.get("products")?.setValue('')
    } else if (type == "collection") {
      if (!this.collections.includes(value)) {
        this.collections.push(value)
        for (let collection of this.collectionsData) {
          if (collection?._id == value) {
            this.collection.push({
              name: collection?.name,
              id: collection?._id
            })
          }
        }
      } else {
        this.toastr.info('Collection already added')
      }
      this.couponForm.get("collections")?.setValue('')
    }
  }

  tagRemove(name: any, id: any, type: any) {
    if (type == "category") {
      this.categories = this.categories.filter((_data: any) => _data != id)
      this.category = this.category.filter((_data: any) => _data.name != name)
      this.couponForm.get("categories")?.setValue('')
    }
    if (type == "product") {
      this.products = this.products.filter((_data: any) => _data != id)
      this.product = this.product.filter((_data: any) => _data.name != name)
      this.couponForm.get("products")?.setValue('')
    }
    if (type == "collection") {
      this.collections = this.collections.filter((_data: any) => _data != id)
      this.collection = this.collection.filter((_data: any) => _data.name != name)
      this.couponForm.get("collections")?.setValue('')
    }
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
    const data = {
      title: this.couponForm.get('title')?.value,
      code: this.couponForm.get('code')?.value,
      fromDate: this.couponForm.get('fromDate')?.value,
      lastDate: this.couponForm.get('toDate')?.value,
      maxDiscount: this.couponForm.get('maxDiscount')?.value,
      minDiscount: this.couponForm.get('minDiscount')?.value,
      value: this.couponForm.get('value')?.value,
      type: this.couponForm.get('type')?.value,
      categories: JSON.stringify(this.categories),
      products: JSON.stringify(this.products),
      collections: JSON.stringify(this.collections),
      filestring: this.croppedImage,
      filename: this.filename,
      isMultiple: this.couponForm.get('isMultiple')?.value,
      isActive: this.couponForm.get('isActive')?.value,
    }
    this.couponsService.addCoupon(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Coupons added successfully');
        this.router.navigate([this.appRoute.coupons.COUPONS_LIST]);
      }
    })
  }
}
