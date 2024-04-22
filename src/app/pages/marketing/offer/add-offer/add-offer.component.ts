import { ProductService } from 'src/app/includes/services/product.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { HotToastService } from '@ngneat/hot-toast';

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
    private FormBuilder: FormBuilder,
    private Router: Router,
    private HotToastService: HotToastService,
    private offerService: OfferService,
    private productService: ProductService,
    private ChangeDetectorRef: ChangeDetectorRef,
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
      this.ChangeDetectorRef.markForCheck()
    })

    this.CategoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesdata = res?.result
      this.ChangeDetectorRef.markForCheck()
    })

    this.CollectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsdata = res?.result
      this.ChangeDetectorRef.markForCheck()
    })

    this.BrandService.getActiveBrands().subscribe((res: any) => {
      this.brandsdata = res?.result
      this.ChangeDetectorRef.markForCheck()
    })
  }

  initForm() {
    this.offerForm = this.FormBuilder.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['percentage'],
      offerType: ['partial'],
      value: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      isActive: ['true'],
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

    this.offerService.addOffer({
      ...this.offerForm.value,
      categories: this.categories.length > 0 ? this.categories : null,
      products: this.products.length > 0 ? this.products : null,
      collections: this.collections.length > 0 ? this.collections : null,
      brands: this.brands.length > 0 ? this.brands : null,
    }).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.HotToastService.error(res?.message);
      } else if (res.errorCode == 0) {
        this.HotToastService.success(res?.message);
        this.Router.navigate([this.appRoute.offer.OFFER_LIST]);
      }
    })
  }

  updateBrand() { }
}
