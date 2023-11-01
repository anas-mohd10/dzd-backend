import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BrandService } from 'src/app/includes/services/brand.service';
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
  form: FormGroup;
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
  errors: any
  categories: any = []; //Array of category ids
  categoriesData: any = []; //Data fetched from database
  category: any = []; //Array of categorty name and id
  products: any = []; //Array of product ids
  productsData: any = []; //Data fetched from database
  product: any = []; //Array of product name and id
  collections: any = []; //Array of collection ids
  collectionsData: any = []; //Data fetched from database
  brands: any = []; //Array of collection ids
  brandsData: any = []; //Data fetched from database
  collection: any = []; //Array of collection name and id
  error_message: string;
  from_date: string;
  to_date: string
  isValidValue: boolean = true
  settings: any = {}
  startDate: string = new Date().toISOString().split('T')[0];
  isLimited: boolean = true

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private couponsService: CouponsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BrandService: BrandService
  ) { }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    const getDate = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(getDate + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(getDate + 3)).toISOString().split('T')[0]

    this.initForm();
    this.managePage();
    this.getProducts()
    this.getCategories()
    this.getCollections()
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
      countPerUser: ['1', Validators.pattern("^[0-9]*$")]
    });

    this.form.get('fromDate')?.setValue(this.from_date)
    this.form.get('lastDate')?.setValue(this.to_date)
    this.form.get('background')?.setValue(AppSettings.BACKGROUND)
    this.form.get('border')?.setValue(AppSettings.BORDER)
    this.form.get('color')?.setValue(AppSettings.COLOR)
    this.form.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.form.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.form.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
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
    })
  }

  getCollections() {
    this.collectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsData = res?.result
    })
  }

  getCategories() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
    })
  }

  getBrands() {
    this.BrandService.getActiveBrands().subscribe((res: any) => {
      this.brandsData = res?.result
    })
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

  imageLoaded() { }

  cropperReady() { }

  loadImageFailed() { }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  applyCoupon(type: string) {
    switch (type) {
      case 'product':
        this.categories = []
        this.collections = []
        this.brands = []
        break
      case 'collection':
        this.categories = []
        this.products = []
        this.brands = []
        break
      case 'category':
        this.products = []
        this.collections = []
        this.brands = []
        break
      case 'brand':
        this.products = []
        this.collections = []
        this.categories = []
        break
    }
  }

  validateValue(_val: any) {
    const type = this.form.get('type')?.value
    if (type == "percent") {
      if (_val?.value <= 100) {
        this.isValidValue = true
      } else {
        this.isValidValue = false
      }
    } else {
      this.isValidValue = true
    }
  }

  handleCouponType() {
    let type = this.form.get('couponType')?.value
    type == 'limited' ? this.isLimited = true : this.isLimited = false
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
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.couponsService.addCoupon(payload).subscribe((res: any) => {
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
    if (this.isValidValue) {
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
        details: {
          type: this.form.get('couponType')?.value,
          value: this.form.get('couponValue')?.value,
        },
        filestring: this.croppedImage,
        filename: this.filename,
        countPerUser: this.form.get('countPerUser')?.value,
        isActive: this.form.get('isActive')?.value,
        isVisibility: this.form.get('isVisibility')?.value,
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

      return data
    }
  }
}
