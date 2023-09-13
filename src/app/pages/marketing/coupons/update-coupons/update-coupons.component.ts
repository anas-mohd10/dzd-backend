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
import { BrandService } from 'src/app/includes/services/brand.service';

@Component({
  selector: 'app-update-coupons',
  templateUrl: './update-coupons.component.html',
  styleUrls: ['./update-coupons.component.scss']
})
export class UpdateCouponsComponent implements OnInit {
  form: FormGroup;
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
  croppedImage: string | null | undefined;
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;
  errors: any
  couponDetails: any = {}
  categories: any = []; //Array of category ids
  categoriesData: any = []; //Data fetched from database
  category: any = []; //Array of categorty name and id
  products: any = []; //Array of product ids
  productsData: any = []; //Data fetched from database
  product: any = []; //Array of product name and id
  startDate: string = new Date().toISOString().split('T')[0];
  collections: any = []; //Array of collection ids
  collectionsData: any = []; //Data fetched from database
  collection: any = []; //Array of collection name and id
  brands: any = []; //Array of collection ids
  brandsData: any = [];
  error_message: string;
  slug: string = ''
  base: string = environment.base
  from_date: string;
  to_date: string
  image: any = ''
  isValidValue: boolean = true
  settings: any = {}
  couponStarted: boolean = false
  validDate: boolean = false

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private couponsService: CouponsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private BrandService: BrandService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.managePage();
    this.slug = this.route.snapshot.queryParams.coupon || ''
    this.getProducts()
    this.getCategories()
    this.getCollections()
    this.getCouponBySlug()
    this.getBrands()
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      file: [''],
      minPurchase: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      categories: [],
      products: [],
      collections: [],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: [''],
      couponType: ['limited', Validators.required],
      couponValue: [10, Validators.required],
      isActive: ['true'],
      isDelete: ['false'],
      isVisibility: ['true'],
      countPerUser: ['', Validators.pattern("^[0-9]*$")]
    });
  }

  get cf() {
    return this.form.controls;
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
      this.cdr.markForCheck()
    })
  }

  getCollections() {
    this.collectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsData = res?.result
      this.cdr.markForCheck()
    })
  }

  getCategories() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
      this.cdr.markForCheck()
    })
  }

  getBrands() {
    this.BrandService.getActiveBrands().subscribe((res: any) => {
      this.brandsData = res?.result
    })
  }

  getCouponBySlug() {
    this.couponsService.getCouponDetails({ refid: this.slug }).subscribe((res: any) => {
      this.couponDetails = res?.result
      this.image = this.base + "/" + this.couponDetails?.file;
      this.form.get("title")?.setValue(this.couponDetails.title)
      this.form.get("code")?.setValue(this.couponDetails.code)
      this.form.get("type")?.setValue(this.couponDetails.type)
      this.form.get("value")?.setValue(this.couponDetails.value)
      this.form.get("fromDate")?.setValue(this.couponDetails.fromDate.split('T')[0])
      this.form.get("lastDate")?.setValue(this.couponDetails.lastDate.split('T')[0])
      this.form.get("maxDiscount")?.setValue(this.couponDetails.maxDiscount)
      this.form.get("minPurchase")?.setValue(this.couponDetails.minPurchase)
      this.form.get("couponType")?.setValue(this.couponDetails?.details?.type)
      this.form.get("couponValue")?.setValue(this.couponDetails?.details?.value)
      this.form.get("isActive")?.setValue(this.couponDetails.isActive)
      this.form.get("isVisibility")?.setValue(this.couponDetails.isVisibility)
      this.form.get("countPerUser")?.setValue(this.couponDetails.countPerUser)

      const today = new Date().toISOString()
      if (today > this.couponDetails?.fromDate) {
        this.couponStarted = true
        this.form.get('fromDate')?.disable()
      }

      this.form.get('background')?.setValue(this.couponDetails.style.background);
      this.form.get('border')?.setValue(this.couponDetails.style.border);
      this.form.get('radius')?.setValue(this.couponDetails.style.radius);
      this.form.get('color')?.setValue(this.couponDetails.style.text.color);
      this.form.get('fontSize')?.setValue(this.couponDetails.style.text.fontSize);
      this.form.get('fontWeight')?.setValue(this.couponDetails.style.text.fontWeight);
      this.collections = this.couponDetails.collections
      this.products = this.couponDetails.products
      this.categories = this.couponDetails.categories
      this.brands = this.couponDetails.brands
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
    const type = this.form.get('type')?.value
    if (type == "%") {
      if (_val.value <= 100) {
        this.isValidValue = true
      } else {
        this.isValidValue = false
      }
    }
  }

  validateDate(e: any) {
    const today = new Date().toISOString()
    const fromDate = this.form.get('fromDate')?.value
    if (e.value < fromDate || e.value < today) {
      this.validDate = false
      this.toastr.error('Inavlid date')
    }
    else {
      this.validDate = true
    }
  }

  applyCoupon(type: string) {
    switch (type) {
      case 'product':
        this.categories = []
        this.collections = []
        break
      case 'collection':
        this.categories = []
        this.products = []
        break
      case 'category':
        this.products = []
        this.collections = []
        break
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCoupon();
    }
  }

  updateCoupon() {
    if (!this.form.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.couponsService.updateCoupon(payload).subscribe((res: any) => {
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
        title: this.form.get('title')?.value,
        code: this.form.get('code')?.value,
        fromDate: this.form.get('fromDate')?.value,
        lastDate: this.form.get('lastDate')?.value,
        minPurchase: this.form.get('minPurchase')?.value,
        value: this.form.get('value')?.value,
        type: this.form.get('type')?.value,
        categories: this.categories ? this.categories : [],
        products: this.products ? this.products : [],
        collections: this.collections ? this.collections : [],
        brands: this.brands ? this.brands : [],
        countPerUser: this.form.get('countPerUser')?.value,
        details: {
          type: this.form.get('couponType')?.value,
          value: this.form.get('couponValue')?.value,
        },
        refid: this.slug,
        filestring: this.croppedImage,
        filename: this.filename,
        file: '',
        isVisibility: this.form.get('isVisibility')?.value,
        isActive: this.form.get('isActive')?.value,
        couponid: this.slug,
        style: {
          background: this.form.get('background')?.value,
          border: this.form.get('border')?.value,
          radius: this.form.get('radius')?.value,
          text: {
            color: this.form.get('color')?.value,
            fontSize: this.form.get('fontSize')?.value,
            fontWeight: this.form.get('fontWeight')?.value,
          }
        }
      }
      if (this.couponDetails?.file) {
        data.file = this.couponDetails?.file
      }
      return data
    } else {
      this.error_message = 'Value should be always less than or equal to 100'
      this.toastr.error(this.error_message)
    }
  }
}
