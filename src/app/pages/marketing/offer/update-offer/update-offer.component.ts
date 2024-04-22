import { ProductService } from 'src/app/includes/services/product.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { BrandService } from 'src/app/includes/services/brand.service';

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss'],
})
export class UpdateOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  editMode = false;
  task = PageTasks.UPDATE;
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
  isProceedable: boolean = true;
  base: string = environment.base;
  offer: string = ''
  offerDetails: any = {}

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private CategoryService: CategoryService,
    private CollectionService: CollectionService,
    private BrandService: BrandService
  ) { }

  ngOnInit(): void {
    const getDate = new Date().getDate()
    const date = new Date()
    this.fromDate = new Date(date.setDate(getDate)).toISOString().split('T')[0]
    this.toDate = new Date(date.setDate(getDate + 10)).toISOString().split('T')[0]

    this.base = environment.base
    this.offer = this.route.snapshot.queryParams.offer || '';
    this.initForm();
    this.managePage();
    this.getOffer();

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
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['percentage'],
      offerType: ['partial'],
      value: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      isActive: ['true'],
      isDelete: ['false']
    });

    this.offerForm.get('startDate')?.setValue(this.fromDate)
    this.offerForm.get('endDate')?.setValue(this.toDate)
  }

  get formControls() {
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

  compareFn(item: any, selected: any) {
    return item._id === selected;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateOffer();
    } else {
      this.addOffer();
    }
  }

  getOffer() {
    this.offerService.getOfferDetails(this.offer).subscribe((res: any) => {
      if (res.errorCode == 0) {
        this.offerDetails = res?.result;
        this.offerForm.get('title')?.setValue(this.offerDetails.title);
        this.offerForm.get('description')?.setValue(this.offerDetails.description);
        this.offerForm.get('isActive')?.setValue(this.offerDetails.isActive);
        this.offerForm.get('type')?.setValue(this.offerDetails.type);
        this.offerForm.get('value')?.setValue(this.offerDetails.value);
        this.offerForm.get('offerType')?.setValue(this.offerDetails.offerType);
        this.offerForm.get('isFeatured')?.setValue(this.offerDetails.isFeatured);
        this.offerForm.get('startDate')?.setValue(new Date(this.offerDetails.startDate).toISOString().split('T')[0]);
        this.offerForm.get('endDate')?.setValue(new Date(this.offerDetails.endDate).toISOString().split('T')[0]);
        this.products = this.offerDetails.products ? this.offerDetails.products : []
        this.categories = this.offerDetails.categories ? this.offerDetails.categories : []
        this.collections = this.offerDetails.collections ? this.offerDetails.collections : []
        this.brands = this.offerDetails.brands ? this.offerDetails.brands : []
        this.offerDetails.type == 'percentage' ? this.offerDetails.value > 100 ? this.isValidValue = false : this.isValidValue = true : this.isValidValue = true
        this.cdr.markForCheck()
      }
    });
  }

  addOffer() { }

  updateOffer() {
    if (!this.offerForm.valid) {
      return;
    }

    this.categories.length > 0 || this.products.length > 0 || this.collections.length > 0 || this.brands.length > 0 ? this.isProceedable = true : this.isProceedable = false
    if (this.isValidValue) {
      if (this.isProceedable) {
        this.offerService.updateOffer(this.offer, {
          ...this.offerForm.value,
          categories: this.categories.length > 0 ? this.categories : null,
          products: this.products.length > 0 ? this.products : null,
          collections: this.collections.length > 0 ? this.collections : null,
          brands: this.brands.length > 0 ? this.brands : null,
          filestring: this.croppedImage,
          filename: this.filename,
          refid: this.offer
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
}
