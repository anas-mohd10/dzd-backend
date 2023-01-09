import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
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
  errors: any

  categories: any = []; //Array of category ids
  categoriesData: any = []; //Data fetched from database
  category: any = []; //Array of categorty name and id

  products: any = []; //Array of product ids
  productsData: any = []; //Data fetched from database
  product: any = []; //Array of product name and id

  collections: any = []; //Array of collection ids
  collectionsData: any = []; //Data fetched from database
  collection: any = []; //Array of collection name and id

  isValidValue: Boolean = false
  error_message: string;
  from_date: string;
  to_date: string

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
  ) { }

  ngOnInit(): void {
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]

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
      minPurchase: [''],
      categories: [],
      products: [],
      collections: [],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: [''],
      isMultiple: ['false', Validators.required],
      isActive: ['true', Validators.required],
    });
    this.couponForm.get('fromDate')?.setValue(this.from_date)
    this.couponForm.get('lastDate')?.setValue(this.to_date)

    this.couponForm.get('background')?.setValue(AppSettings.BACKGROUND)
    this.background = AppSettings.BACKGROUND
    this.couponForm.get('border')?.setValue(AppSettings.BORDER)
    this.border = AppSettings.BORDER
    this.couponForm.get('color')?.setValue(AppSettings.COLOR)
    this.color = AppSettings.COLOR
    this.couponForm.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.couponForm.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.couponForm.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
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
    this.collectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsData = res?.result
    })
  }

  getCategories() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
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

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
    }
  }

  validateValue(_val: any) {
    const type = this.couponForm.get('type')?.value
    if (type == "%") {
      if (_val.value <= 100) {
        this.isValidValue = true
      } else {
        this.isValidValue = false
      }
    } else {
      this.isValidValue = true
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

  updateCoupon() { }

  addCoupon() {
    if (!this.couponForm.valid) {
      console.error("Validation error")
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
    if (this.isValidValue == true) {
      const data = {
        title: this.couponForm.get('title')?.value,
        code: this.couponForm.get('code')?.value,
        fromDate: this.couponForm.get('fromDate')?.value,
        lastDate: this.couponForm.get('lastDate')?.value,
        minPurchase: this.couponForm.get('minPurchase')?.value,
        value: this.couponForm.get('value')?.value,
        type: this.couponForm.get('type')?.value,
        categories: JSON.stringify(this.categories),
        products: JSON.stringify(this.products),
        collections: JSON.stringify(this.collections),
        filestring: this.croppedImage,
        filename: this.filename,
        isMultiple: this.couponForm.get('isMultiple')?.value,
        isActive: this.couponForm.get('isActive')?.value,
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
      return data
    } else {
      this.error_message = 'Value should be always less than or equal to 100'
      this.toastr.error(this.error_message)
    }
  }
}
