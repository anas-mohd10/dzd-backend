import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-coupons',
  templateUrl: './update-coupons.component.html',
  styleUrls: ['./update-coupons.component.scss']
})
export class UpdateCouponsComponent implements OnInit {
  couponForm: FormGroup;
  task = PageTasks.UPDATE;
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
  slug: any;
  couponData: any;
  valueInvalid: boolean = false;

  categories: any = []; //Array of category ids
  categoriesData: any = []; //Data fetched from database
  category: any = []; //Array of categorty name and id

  products: any = []; //Array of product ids
  productsData: any = []; //Data fetched from database
  product: any = []; //Array of product name and id

  collections: any = []; //Array of collection ids
  collectionsData: any = []; //Data fetched from database
  collection: any = []; //Array of collection name and id
  filename: string;
  imageChangedEvent: any;
  loadImage: boolean;
  croppedImage: string | null | undefined;
  uploadedimg: any;
  base: any

  isValidValue: Boolean = false
  error_message: string;

  //Styling variables
  background: any
  border: any
  color: any

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private couponsService: CouponsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base
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
      title: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      file: [''],
      maxDiscount: [''],
      minPurchase: [''],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: [''],
      categories: [],
      products: [],
      collections: [],
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
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
    })
  }

  getCouponBySlug() {
    this.couponsService.getCouponBySlug(this.slug).subscribe((res: any) => {
      this.couponData = res?.result[0]
      this.uploadedimg = this.base + "/" + this.couponData?.file
      this.couponForm.get("title")?.setValue(this.couponData.title)
      this.couponForm.get("code")?.setValue(this.couponData.code)
      this.couponForm.get("type")?.setValue(this.couponData.type)
      this.couponForm.get("value")?.setValue(this.couponData.value)
      this.couponForm.get("fromDate")?.setValue(this.couponData.fromDate.split('T')[0])
      this.couponForm.get("lastDate")?.setValue(this.couponData.lastDate.split('T')[0])
      this.couponForm.get("maxDiscount")?.setValue(this.couponData.maxDiscount)
      this.couponForm.get("minPurchase")?.setValue(this.couponData.minPurchase)
      this.couponForm.get("isActive")?.setValue(this.couponData.isActive)
      this.couponForm.get("isMultiple")?.setValue(this.couponData.isMultiple)

      this.couponForm.get('background')?.setValue(this.couponData.style.background);
      this.couponForm.get('border')?.setValue(this.couponData.style.border);
      this.couponForm.get('radius')?.setValue(this.couponData.style.radius);
      this.couponForm.get('color')?.setValue(this.couponData.style.text.color);
      this.couponForm.get('fontSize')?.setValue(this.couponData.style.text.fontSize);
      this.couponForm.get('fontWeight')?.setValue(this.couponData.style.text.fontWeight);
      this.border = this.couponData.style.border
      this.background = this.couponData.style.background
      this.color = this.couponData.style.text.color
      this.collections = this.couponData.collections
      this.products = this.couponData.products
      this.categories = this.couponData.categories
      this.cdr.markForCheck()
      this.isValidValue = true
    })
  }

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  compareFn(item: any, selected: any) {
    return item._id === selected;
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

  validateValue(_val: any) {
    const type = this.couponForm.get('type')?.value
    if (type == "%") {
      if (_val.value <= 100) {
        this.isValidValue = true
      } else {
        this.isValidValue = false
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
      this.updateCoupon();
    }
  }

  updateCoupon() {
    if (!this.couponForm.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.couponsService.updateCoupon(this.slug, payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.coupons.COUPONS_LIST]);
        }
      })
    }
  }

  createPayload() {
    if (this.isValidValue == true) {
      const data = {
        title: this.couponForm.get('title')?.value,
        code: this.couponForm.get('code')?.value,
        fromDate: this.couponForm.get('fromDate')?.value,
        lastDate: this.couponForm.get('lastDate')?.value,
        maxDiscount: this.couponForm.get('maxDiscount')?.value,
        minDiscount: this.couponForm.get('minDiscount')?.value,
        value: this.couponForm.get('value')?.value,
        type: this.couponForm.get('type')?.value,
        categories: JSON.stringify(this.categories),
        products: JSON.stringify(this.products),
        collections: JSON.stringify(this.collections),
        filestring: this.croppedImage,
        filename: this.filename,
        file: '',
        isMultiple: this.couponForm.get('isMultiple')?.value,
        isActive: this.couponForm.get('isActive')?.value,
        couponid: this.slug,
        style: {
          background: this.couponForm.get('background')?.value,
          border: this.couponForm.get('border')?.value,
          radius: this.couponForm.get('radius')?.value,
          text: {
            color: this.couponForm.get('color')?.value,
            fontSize: this.couponForm.get('fontSize')?.value,
            fontWeight: this.couponForm.get('fontWeight')?.value,
          }
        }
      }
      if (this.couponData?.file) {
        data.file = this.couponData?.file
      }
      console.log(data);
      return data
    } else {
      this.error_message = 'Value should be always less than or equal to 100'
      this.toastr.error(this.error_message)
    }
  }
}
