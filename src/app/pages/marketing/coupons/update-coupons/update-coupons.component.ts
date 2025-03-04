import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CouponsService } from 'src/app/includes/services/coupons.service';
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
  dropdownInputs: Array<any> = []

  constructor(
    private CouponsService: CouponsService,
    private formBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.slug = this.ActivatedRoute.snapshot.queryParams.coupon || ''
    this.getCouponBySlug()
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
    const isExists = this.dropdownInputs.some((input: any) => input._id === item._id)
    if (isExists) {
      this.HotToastService.info("Item removed successfully")
      this.dropdownInputs = this.dropdownInputs.filter((input: any) => input._id !== item._id);
    } else {
      this.HotToastService.success("Item added successfully")
      this.dropdownInputs.push(item);
    }

    this.assignDropdownInputs(this.dropdownInputs)
    this.ChangeDetectorRef.markForCheck()
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
      platformType: ['both'],
    });
  }

  get formControls() {
    return this.form.controls;
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
      this.form.get("couponType")?.setValue(this.couponDetails?.details?.type)
      this.form.get("couponValue")?.setValue(this.couponDetails?.details?.value)
      this.form.get("maxDiscount")?.setValue(this.couponDetails.maxDiscount)
      this.form.get("minPurchase")?.setValue(this.couponDetails.minPurchase)
      this.form.get("minimumType")?.setValue(this.couponDetails.minimumType)
      this.form.get("isActive")?.setValue(this.couponDetails.isActive)
      this.form.get("isVisibility")?.setValue(this.couponDetails.isVisibility)
      this.form.get("countPerUser")?.setValue(this.couponDetails.countPerUser)
      this.form.get('criteriaType')?.setValue(this.couponDetails.couponType)
      this.form.get('platformType')?.setValue(this.couponDetails.platformType || 'both');

      const today = new Date().toISOString()
      if (today > this.couponDetails?.fromDate) {
        this.isOngoing = true
        this.form.get('fromDate')?.disable()
      }

      this.collections = this.couponDetails.collections
      this.products = this.couponDetails.products
      this.categories = this.couponDetails.categories
      this.brands = this.couponDetails.brands

      this.setCouponTypeIfNotEmpty(this.products, 'products');
      this.setCouponTypeIfNotEmpty(this.categories, 'categories');
      this.setCouponTypeIfNotEmpty(this.collections, 'collections');
      this.setCouponTypeIfNotEmpty(this.brands, 'brands');

      const typeKeys: { [key: string]: any[] } = {
        "products": this.products,
        "collections": this.collections,
        "categories": this.categories,
        "brands": this.brands
      }

      this.dropdownInputs = typeKeys[this.form.get('criteriaType')?.value]
      
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
    if (!type) return;
    if (type !== this.form.get('criteriaType')?.value) {
      switch (type) {
        case 'complete':
          this.products = [];
          this.collections = [];
          this.categories = [];
          this.brands = [];
          break;
        case 'products':
          this.collections = [];
          this.categories = [];
          this.brands = [];
          break;
        case 'collections':
          this.products = [];
          this.categories = [];
          this.brands = [];
          break;
        case 'categories':
          this.products = [];
          this.collections = [];
          this.brands = [];
          break;
        case 'brands':
          this.products = [];
          this.collections = [];
          this.categories = [];
          break;
      }
    }
    this.dropdownInputs = []
    this.form.get('criteriaType')?.setValue(type);
    this.ChangeDetectorRef.markForCheck();
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

    // Get the current criteria type
    const criteriaType = this.form.get('criteriaType')?.value;

    // Ensure arrays are cleared based on criteria type before submission
    if (criteriaType === 'complete') {
      this.products = [];
      this.collections = [];
      this.categories = [];
      this.brands = [];
    }

    // Create the payload
    const payload = {
      title: this.form.get('title')?.value,
      code: this.form.get('code')?.value,
      fromDate: this.form.get('fromDate')?.value,
      lastDate: this.form.get('lastDate')?.value,
      minPurchase: this.form.get('minPurchase')?.value,
      minimumType: this.form.get('minimumType')?.value,
      value: this.form.get('value')?.value,
      type: this.form.get('type')?.value,
      categories: criteriaType === 'categories' ? this.categories?.map((category: any) => category?._id) : [],
      products: criteriaType === 'products' ? this.products?.map((product: any) => product?._id) : [],
      collections: criteriaType === 'collections' ? this.collections?.map((colection: any) => colection?._id) : [],
      brands: criteriaType === 'brands' ? this.brands?.map((brand: any) => brand?._id) : [],
      countPerUser: this.form.get('countPerUser')?.value,
      details: {
        type: this.form.get('couponType')?.value,
        value: this.form.get('couponValue')?.value,
      },
      refid: this.slug,
      couponType: criteriaType === 'complete' ? 'complete' : 'partial',
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
      platformType: this.form.get('platformType')?.value,
    };

    // Submit the payload
    this.CouponsService.updateCoupon(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.coupons.COUPONS_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    });
  }
}
