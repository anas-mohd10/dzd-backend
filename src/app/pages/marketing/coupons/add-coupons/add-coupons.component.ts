import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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

  error_message: string;
  fromDate: string;
  toDate: string
  isValidValue: boolean = true
  settings: any = {}
  startDate: string = new Date().toISOString().split('T')[0];
  isLimited: boolean = true

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private couponsService: CouponsService,
    private router: Router,
    private HotToastService: HotToastService,
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

    this.fromDate = new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0]
    this.toDate = new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      type: new FormControl('percent', Validators.required),
      value: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      fromDate: new FormControl('', Validators.required),
      lastDate: new FormControl('', Validators.required),
      file: new FormControl(''),
      minPurchase: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      categories: new FormControl([]),
      products: new FormControl([]),
      collections: new FormControl([]),
      background: new FormControl(''),
      border: new FormControl(''),
      radius: new FormControl(''),
      color: new FormControl(''),
      fontSize: new FormControl(''),
      criteriaType: new FormControl('complete'),
      fontWeight: new FormControl(''),
      couponType: new FormControl('limited', Validators.required),
      couponValue: new FormControl(10, [Validators.required, Validators.pattern("^[0-9]*$")]),
      isActive: new FormControl('true'),
      minimumType: new FormControl('cart'),
      isDelete: new FormControl('false'),
      isVisibility: new FormControl('true'),
      countPerUser: new FormControl('1', [Validators.required, Validators.pattern("^[0-9]*$")]),
      isMaxRedemptionEnabled: new FormControl('false'),
      maxRedemptionValue: new FormControl('', [Validators.pattern("^[0-9]*$")]),
    });

    this.getProducts()
    this.getCategories()
    this.getCollections()
    this.getBrands()

    this.form.get('fromDate')?.setValue(this.fromDate)
    this.form.get('lastDate')?.setValue(this.toDate)
  }

  get formControls() {
    return this.form.controls;
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
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.couponsService.addCoupon(payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.HotToastService.success(res?.message);
            this.router.navigate([this.appRoute.coupons.COUPONS_LIST]);
          } else {
            this.HotToastService.error(res?.message || 'Failed to add coupon');
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err?.message || 'Failed to add coupon');
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
        minimumType: this.form.get('minimumType')?.value,
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
        couponType: this.form.get('criteriaType')?.value == 'complete' ? 'complete' : 'partial',
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
        },
        maxRedemptionAmount: {
          isEnabled: this.form.get('isMaxRedemptionEnabled')?.value === 'true',
          value: this.form.get('maxRedemptionValue')?.value || null
        },
      }

      return data
    }
  }
}
