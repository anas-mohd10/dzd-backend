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
  form: FormGroup = new FormGroup({});
  editMode = false;
  isSubmitted: boolean;
  isLoading: boolean = false;
  appRoute = appRoutes;
  categories: any = []; //Array of category ids
  products: any = []; //Array of product ids
  collections: any = []; //Array of collection ids
  brands: any = []; //Array of collection ids
  slug: string = '';
  fromDate: string;
  toDate: string
  isValidValue: boolean = true
  startDate: string = new Date().toISOString().split('T')[0];
  couponDetails: any;
  isOngoing: boolean = false;
  settings: any = {}
  isLimited: boolean = true
  dropdownInputs: Array<any> = []

  constructor(
    private couponsService: CouponsService,
    private router: Router,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
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
      platformType: new FormControl('both', Validators.required),
    });

    this.form.get('fromDate')?.setValue(this.fromDate)
    this.form.get('lastDate')?.setValue(this.toDate)
  }

  get formControls() {
    return this.form.controls;
  }

  onSelect(event: { dropdownInputs: any[] }) {
    this.assignDropdownInputs(event.dropdownInputs)
    this.ChangeDetectorRef.markForCheck()
  }

  assignDropdownInputs(dropdownInputs: any[]) {
    switch (this.form.get('criteriaType')?.value) {
      case 'products':
        this.products = dropdownInputs
        break;
      case 'collections':
        this.collections = dropdownInputs
        break;
      case 'categories':
        this.categories = dropdownInputs
        break;
      case 'brands':
        this.brands = dropdownInputs
        break;
    }
  }

  onRemoveSelected(item: any) {
    const criteriaType = this.form.get('criteriaType')?.value;
    
    switch (criteriaType) {
      case 'products':
        this.products = this.products.filter((product: any) => product._id !== item._id);
        this.dropdownInputs = this.products;
        break;
      case 'collections':
        this.collections = this.collections.filter((collection: any) => collection._id !== item._id);
        this.dropdownInputs = this.collections;
        break;
      case 'categories':
        this.categories = this.categories.filter((category: any) => category._id !== item._id);
        this.dropdownInputs = this.categories;
        break;
      case 'brands':
        this.brands = this.brands.filter((brand: any) => brand._id !== item._id);
        this.dropdownInputs = this.brands;
        break;
    }
  
    this.HotToastService.info("Item removed successfully");
    this.ChangeDetectorRef.markForCheck();
  }

  applyCoupon(type: string) {
    switch (type) {
      case 'products':
        this.categories = []
        this.collections = []
        this.brands = []
        break
      case 'collections':
        this.categories = []
        this.products = []
        this.brands = []
        break
      case 'categories':
        this.products = []
        this.collections = []
        this.brands = []
        break
      case 'brands':
        this.products = []
        this.collections = []
        this.categories = []
        break
    }
    this.dropdownInputs = []
    this.form.get('criteriaType')?.setValue(type);
    this.ChangeDetectorRef.markForCheck();
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
        categories: this.categories ? this.categories?.map((category:any) => category?._id) : [],
        products: this.products ? this.products?.map((product:any) => product?._id) : [],
        collections: this.collections ? this.collections?.map((collection:any) => collection?._id) : [],
        brands: this.brands ? this.brands?.map((brand:any) => brand?._id) : [],
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
        platformType: this.form.get('platformType')?.value,
      }

      return data
    }
  }
}
