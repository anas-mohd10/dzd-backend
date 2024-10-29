import { ProductService } from 'src/app/includes/services/product.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { environment } from 'src/environments/environment.prod';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss'],
})
export class UpdateOfferComponent implements OnInit {
  form: FormGroup;
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
  parentsData: Array<any> = []
  parents: Array<any> = []
  brandsdata: Array<any> = []
  brands: Array<any> = []
  isValidValue: boolean = true;
  isProceedable: boolean = true;
  base: string = environment.base;
  offerId: string = ''
  offerDetails: any = {}

  constructor(
    private ProductHeadService: ProductHeadService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private HotToastService: HotToastService,
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
    this.offerId = this.route.snapshot.params.offerId || '';
    this.initForm();
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

    this.ProductHeadService.activeParents().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.parentsData = res?.result
          this.cdr.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['percentage'],
      offerType: ['complete'],
      value: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      isActive: ['true'],
      isDelete: ['false']
    });

    this.form.get('startDate')?.setValue(this.fromDate)
    this.form.get('endDate')?.setValue(this.toDate)
  }

  get formControls() {
    return this.form.controls;
  }

  validateValue() {
    let type = this.form.get('type')?.value
    let value = this.form.get('value')?.value
    type == 'percentage' ? value > 100 ? this.isValidValue = false : this.isValidValue = true : this.isValidValue = true
  }

  getTypes(type: any) {
    switch (type) {
      case 'products':
        this.categories = []
        this.collections = []
        this.brands = []
        this.parents = []
        break
      case 'categories':
        this.products = []
        this.collections = []
        this.brands = []
        this.parents = []
        break
      case 'collections':
        this.products = []
        this.categories = []
        this.brands = []
        this.parents = []
        break
      case 'brands':
        this.products = []
        this.categories = []
        this.collections = []
        this.parents = []
        break
      case 'parents':
        this.products = []
        this.categories = []
        this.collections = []
        this.brands = []
        break
    }
  }

  compareFn(item: any, selected: any) {
    return item._id === selected;
  }

  setOfferTypeIfNotEmpty(array: any[], type: string = 'complete') {
    if (array.length > 0) {
      this.form.get('offerType')?.setValue(type);
    }
  }

  getOffer() {
    this.offerService.getOfferDetails(this.offerId).subscribe((res: any) => {
      if (res.errorCode == 0) {
        this.offerDetails = res?.result;
        this.form.get('title')?.setValue(this.offerDetails.title);
        this.form.get('description')?.setValue(this.offerDetails.description);
        this.form.get('isActive')?.setValue(this.offerDetails.isActive);
        this.form.get('type')?.setValue(this.offerDetails.type);
        this.form.get('value')?.setValue(this.offerDetails.value);
        this.form.get('offerType')?.setValue(this.offerDetails.offerType);
        this.form.get('isFeatured')?.setValue(this.offerDetails.isFeatured);
        this.form.get('startDate')?.setValue(new Date(this.offerDetails.startDate).toISOString().split('T')[0]);
        this.form.get('endDate')?.setValue(new Date(this.offerDetails.endDate).toISOString().split('T')[0]);
        this.products = this.offerDetails.products ? this.offerDetails.products : []
        this.categories = this.offerDetails.categories ? this.offerDetails.categories : []
        this.collections = this.offerDetails.collections ? this.offerDetails.collections : []
        this.brands = this.offerDetails.brands ? this.offerDetails.brands : []
        this.parents = this.offerDetails.parents ? this.offerDetails.parents : []
        this.setOfferTypeIfNotEmpty(this.products, 'products');
        this.setOfferTypeIfNotEmpty(this.categories, 'categories');
        this.setOfferTypeIfNotEmpty(this.collections, 'collections');
        this.setOfferTypeIfNotEmpty(this.brands, 'brands');
        this.setOfferTypeIfNotEmpty(this.parents, 'parents');
        this.offerDetails.type == 'percentage' ? this.offerDetails.value > 100 ? this.isValidValue = false : this.isValidValue = true : this.isValidValue = true
        this.cdr.markForCheck()
      }
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    if(this.form.get('offerType')?.value == 'complete') {
      this.products = []
      this.categories = []
      this.collections = []
      this.brands = []
      this.parents = []
    }

    this.offerService.updateOffer({
      ...this.form.value,
      offerType: this.form.get('offerType')?.value == 'complete' ? 'complete' : 'partial',
      categories: this.categories.length > 0 ? this.categories : null,
      products: this.products.length > 0 ? this.products : null,
      collections: this.collections.length > 0 ? this.collections : null,
      brands: this.brands.length > 0 ? this.brands : null,
      parents: this.parents.length > 0 ? this.parents : null,
      slug: this.offerId
    }).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.HotToastService.error(res?.message);
      } else if (res.errorCode == 0) {
        this.HotToastService.success(res?.message);
        this.router.navigate([this.appRoute.offer.OFFER_LIST]);
      }
    });
  }
}
