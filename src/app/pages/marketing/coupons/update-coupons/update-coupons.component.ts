import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CouponsService } from 'src/app/includes/services/coupons.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-update-coupons',
  templateUrl: './update-coupons.component.html',
  styleUrls: ['./update-coupons.component.scss']
})
export class UpdateCouponsComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  isSubmitted: boolean;
  appRoute = appRoutes;

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

  slug: string = '';
  error_message: string;
  fromDate: string;
  toDate: string
  isValidValue: boolean = true
  settings: any = {}
  startDate: string = new Date().toISOString().split('T')[0];
  isLimited: boolean = true;
  couponDetails: any;
  isOngoing: boolean = false;

  constructor(
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private CollectionService: CollectionService,
    private CouponsService: CouponsService,
    private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BrandService: BrandService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.slug = this.ActivatedRoute.snapshot.queryParams.coupon || ''
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
      criteriaType: ['partial'],
      minimumType: ['cart'],
      couponType: ['limited', Validators.required],
      couponValue: [10, Validators.required],
      isActive: ['true'],
      isDelete: ['false'],
      isVisibility: ['true'],
      countPerUser: ['', Validators.pattern("^[0-9]*$")],
      isMaxRedemptionEnabled: ['false'],
      maxRedemptionValue: ['', [Validators.pattern("^[0-9]*$")]],
    });
  }

  get formControls() {
    return this.form.controls;
  }

  getProducts() {
    this.ProductService.getActiveProduct().subscribe((res: any) => {
      this.productsData = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  getCollections() {
    this.CollectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsData = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  getCategories() {
    this.CategoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  getBrands() {
    this.BrandService.getActiveBrands().subscribe((res: any) => {
      this.brandsData = res?.result
    })
  }

  getCouponBySlug() {
    this.CouponsService.getCouponDetails({ refid: this.slug }).subscribe((res: any) => {
      this.couponDetails = res?.result
      this.form.get("title")?.setValue(this.couponDetails.title)
      this.form.get("code")?.setValue(this.couponDetails.code)
      this.form.get("type")?.setValue(this.couponDetails.type)
      this.form.get("value")?.setValue(this.couponDetails.value)
      this.form.get("fromDate")?.setValue(this.couponDetails.fromDate.split('T')[0])
      this.form.get("lastDate")?.setValue(this.couponDetails.lastDate.split('T')[0])
      this.form.get("maxDiscount")?.setValue(this.couponDetails.maxDiscount)
      this.form.get("minPurchase")?.setValue(this.couponDetails.minPurchase)
      this.form.get("minimumType")?.setValue(this.couponDetails.minimumType)
      this.form.get("couponType")?.setValue(this.couponDetails?.details?.type)
      this.form.get("couponValue")?.setValue(this.couponDetails?.details?.value)
      this.form.get("isActive")?.setValue(this.couponDetails.isActive)
      this.form.get("isVisibility")?.setValue(this.couponDetails.isVisibility)
      this.form.get("countPerUser")?.setValue(this.couponDetails.countPerUser)
      this.form.get('criteriaType')?.setValue(this.couponDetails.couponType)

      const today = new Date().toISOString()
      if (today > this.couponDetails?.fromDate) {
        this.isOngoing = true
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

      this.setCouponTypeIfNotEmpty(this.products, 'products');
      this.setCouponTypeIfNotEmpty(this.categories, 'categories');
      this.setCouponTypeIfNotEmpty(this.collections, 'collections');
      this.setCouponTypeIfNotEmpty(this.brands, 'brands');

      this.ChangeDetectorRef.markForCheck()
      this.isValidValue = true

      this.form.get('isMaxRedemptionEnabled')?.setValue(this.couponDetails.maxRedemptionAmount?.isEnabled ? 'true' : 'false');
      this.form.get('maxRedemptionValue')?.setValue(this.couponDetails.maxRedemptionAmount?.value || '');
    })
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

  setCouponTypeIfNotEmpty(array: any[], type: string = 'complete') {
    if (array.length > 0) {
      this.form.get('criteriaType')?.setValue(type);
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.CouponsService.updateCoupon({
      title: this.form.get('title')?.value,
      code: this.form.get('code')?.value,
      fromDate: this.form.get('fromDate')?.value,
      lastDate: this.form.get('lastDate')?.value,
      minPurchase: this.form.get('minPurchase')?.value,
      minimumType: this.form.get('minimumType')?.value,
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
      couponType: this.form.get('criteriaType')?.value == 'complete' ? 'complete' : 'partial',
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
      },
      maxRedemptionAmount: {
        isEnabled: this.form.get('isMaxRedemptionEnabled')?.value === 'true',
        value: this.form.get('maxRedemptionValue')?.value || null
      },
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.coupons.COUPONS_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }
}
