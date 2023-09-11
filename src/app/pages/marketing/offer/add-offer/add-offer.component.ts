import { ProductService } from 'src/app/includes/services/product.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { BrandService } from 'src/app/includes/services/brand.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  editMode = false;
  task = PageTasks.ADD;
  filedata: File;
  isSubmitted: boolean;
  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;
  minDate: string = new Date().toISOString().split('T')[0];
  fromDate: string;
  toDate: string;
  validDate: boolean = true;
  productsdata: Array<any> = [];
  products: Array<any> = []
  categoriesdata: Array<any> = []
  categories: Array<any> = []
  collectionsdata: Array<any> = []
  collections: Array<any> = []
  brandsdata: Array<any> = []
  brands: Array<any> = []
  isValidValue: boolean = true;
  isProceedable: boolean = true

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private CategoryService: CategoryService,
    private CollectionService: CollectionService,
    private BrandService: BrandService
  ) { }

  ngOnInit(): void {
    const getDate = new Date().getDate()
    const date = new Date()
    this.fromDate = new Date(date.setDate(getDate)).toISOString().split('T')[0]
    this.toDate = new Date(date.setDate(getDate + 10)).toISOString().split('T')[0]

    this.initForm();
    this.managePage();

    this.productService.getActiveProduct().subscribe((res: any) => {
      this.productsdata = res?.result
      this.cdr.markForCheck()
    })

    this.CategoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesdata = res?.result
      this.cdr.markForCheck()
    })

    this.CollectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsdata = res?.result
      this.cdr.markForCheck()
    })

    this.BrandService.getActiveBrands().subscribe((res: any) => {
      this.brandsdata = res?.result
      this.cdr.markForCheck()
    })
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      title: ['', Validators.required],
      file: [''],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['percentage'],
      value: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      isActive: ['true'],
    });

    this.offerForm.get('startDate')?.setValue(this.fromDate)
    this.offerForm.get('endDate')?.setValue(this.toDate)
  }

  get of() {
    return this.offerForm.controls;
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

  validateValue() {
    let type = this.offerForm.get('type')?.value
    let value = this.offerForm.get('value')?.value
    type == 'percentage' ? value > 100 ? this.isValidValue = false : this.isValidValue = true : this.isValidValue = true
  }

  getTypes(type: any) {
    switch (type) {
      case 'products':
        this.categories = []
        this.collections = []
        this.brands = []
        break
      case 'categories':
        this.products = []
        this.collections = []
        this.brands = []
        break
      case 'collections':
        this.products = []
        this.categories = []
        this.brands = []
        break
      case 'brands':
        this.products = []
        this.categories = []
        this.collections = []
        break
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
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  addBrand() {
    if (!this.offerForm.valid) {
      this.isSubmitted = true
      return;
    }

    this.categories.length > 0 || this.products.length > 0 || this.collections.length > 0 || this.brands.length > 0 ? this.isProceedable = true : this.isProceedable = false
    if (this.isValidValue) {
      if (this.isProceedable) {
        this.offerService.addOffer({
          ...this.offerForm.value,
          categories: this.categories.length > 0 ? this.categories : null,
          products: this.products.length > 0 ? this.products : null,
          collections: this.collections.length > 0 ? this.collections : null,
          brands: this.brands.length > 0 ? this.brands : null,
          filestring: this.croppedImage,
          filename: this.filename,
        }).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.offer.OFFER_LIST]);
          }
        });
      }
    }
  }

  updateBrand() { }
}
