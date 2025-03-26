import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { environment } from 'src/environments/environment';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss'],
})
export class UpdateOfferComponent implements OnInit {
  form: FormGroup;
  appRoute = appRoutes;
  isLoading: boolean = true;
  isSubmitted: boolean;
  minDate: string = new Date().toISOString().split('T')[0];
  fromDate: string;
  toDate: string;
  validDate: boolean = true;
  products: Array<any> = [];
  categories: Array<any> = [];
  collections: Array<any> = [];
  parents: Array<any> = [];
  brands: Array<any> = [];
  isValidValue: boolean = true;
  isProceedable: boolean = true;
  base: string = environment.base;
  offerId: string = '';
  offerDetails: any = {};
  modalRef?: BsModalRef;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalResults: number = 0;
  productDocs: Array<any> = [];
  productsModalRef?: BsModalRef
  dropdownInputs: any = []
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private HotToastService: HotToastService,
    private offerService: OfferService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BsModalService: BsModalService
  ) { }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
  }

  confirm() {
    this.onDelete();
  }

  decline() {
    this.modalRef?.hide();
  }

  openProducts(template: TemplateRef<any>){
    this.productsModalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
  }

  navigateToProduct(productId: string) {
    this.router.navigate([this.appRoute.product.UPDATE_PRODUCT], { queryParams: { product: productId } });
    this.productsModalRef?.hide();
  }

  onRemoveSelected(item: any) {
    const offerType = this.form.get('offerType')?.value;
    
    let currentList: any[];
    switch (offerType) {
      case 'products':
        currentList = this.products;
        this.dropdownInputs = this.products;
        break;
      case 'collections':
        currentList = this.collections;
        this.dropdownInputs = this.collections;
        break;
      case 'categories':
        currentList = this.categories;
        this.dropdownInputs = this.categories;
        break;
      case 'brands':
        currentList = this.brands;
        this.dropdownInputs = this.brands;
        break;
      case 'parents':
        currentList = this.parents;
        this.dropdownInputs = this.parents;
        break;
      default:
        return;
    }
  
    const itemIndex = currentList.findIndex(i => i._id === item._id);
    
    if (itemIndex !== -1) {
      currentList.splice(itemIndex, 1);
      this.HotToastService.info("Item removed successfully");
    } else {
      currentList.push(item);
      this.HotToastService.success("Item added successfully");
    }
  
    switch (offerType) {
      case 'products':
        this.products = [...currentList];
        break;
      case 'collections':
        this.collections = [...currentList];
        break;
      case 'categories':
        this.categories = [...currentList];
        break;
      case 'brands':
        this.brands = [...currentList];
        break;
      case 'parents':
        this.parents = [...currentList];
        break;
    }
  
    this.dropdownInputs = [...currentList];
    this.ChangeDetectorRef.markForCheck();
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
  }

  ngOnInit(): void {
    const getDate = new Date().getDate();
    const date = new Date();
    this.fromDate = new Date(date.setDate(getDate)).toISOString().split('T')[0];
    this.toDate = new Date(date.setDate(getDate + 10))
      .toISOString()
      .split('T')[0];

    this.base = environment.base;
    this.offerId = this.route.snapshot.params.offerId || '';
    this.initForm();
    // 1. Offer details
    this.offerService.getOfferDetails(this.offerId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.offerDetails = res?.result;
          this.form.patchValue({
            title: this.offerDetails.title,
            description: this.offerDetails.description,
            isActive: this.offerDetails.isActive,
            type: this.offerDetails.type,
            value: this.offerDetails.value,
            offerType: this.offerDetails.offerType,
            isFeatured: this.offerDetails.isFeatured,
            startDate: new Date(this.offerDetails.startDate).toISOString().split('T')[0],
            endDate: new Date(this.offerDetails.endDate).toISOString().split('T')[0],
          })
          this.products = this.offerDetails.products
            ? this.offerDetails.products
            : [];
          this.categories = this.offerDetails.categories
            ? this.offerDetails.categories
            : [];
          this.collections = this.offerDetails.collections
            ? this.offerDetails.collections
            : [];
          this.brands = this.offerDetails.brands ? this.offerDetails.brands : [];
          this.parents = this.offerDetails.parents
            ? this.offerDetails.parents
            : [];
          this.setOfferTypeIfNotEmpty(this.products, 'products');
          this.setOfferTypeIfNotEmpty(this.categories, 'categories');
          this.setOfferTypeIfNotEmpty(this.collections, 'collections');
          this.setOfferTypeIfNotEmpty(this.brands, 'brands');
          this.setOfferTypeIfNotEmpty(this.parents, 'parents');
          this.offerDetails.type == 'percentage'
            ? this.offerDetails.value > 100
              ? (this.isValidValue = false)
              : (this.isValidValue = true)
            : (this.isValidValue = true);
          this.ChangeDetectorRef.markForCheck();
        }
      },
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['percentage'],
      offerType: ['complete'],
      value: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      isActive: ['true'],
      isDelete: ['false'],
    });

    this.form.get('startDate')?.setValue(this.fromDate);
    this.form.get('endDate')?.setValue(this.toDate);
  }

  get formControls() {
    return this.form.controls;
  }

  validateValue() {
    let type = this.form.get('type')?.value;
    let value = this.form.get('value')?.value;
    type == 'percentage'
      ? value > 100
        ? (this.isValidValue = false)
        : (this.isValidValue = true)
      : (this.isValidValue = true);
  }

  onDelete() {
    this.offerService.updateOffer({ isDelete: true, slug: this.offerId }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.decline();
          this.router.navigate([this.appRoute.offer.OFFER_LIST]);
        } else {
          this.HotToastService.error(res?.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    })
  }

  getTypes(type: string) {
    if (!type) return;
    if (type !== this.form.get('offerType')?.value) {
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
        case 'parents':
          this.products = [];
          this.categories = [];
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
    this.form.get('offerType')?.setValue(type);
    this.ChangeDetectorRef.markForCheck();
  }

  compareFn(item: any, selected: any) {
    return item?._id === selected;
  }

  onSelect(event: { dropdownInputs: any[] }) {
    // Get the current array based on offer type
    let currentArray: any[] = [];
    switch (this.form.get('offerType')?.value) {
      case 'products':
        currentArray = [...this.products];
        break;
      case 'collections':
        currentArray = [...this.collections];
        break;
      case 'categories':
        currentArray = [...this.categories];
        break;
      case 'parents':
        currentArray = [...this.parents];
        break;
      case 'brands':
        currentArray = [...this.brands];
        break;
    }
    
    // Merge the dropdown inputs with the current array
    this.assignDropdownInputs(event.dropdownInputs, currentArray);
    this.ChangeDetectorRef.markForCheck();
  }

  assignDropdownInputs(dropdownInputs: any[], currentArray: any[] = []) {
    // Create a merged array with unique items (no duplicates)
    const mergedArray = [...currentArray];
    
    // Add new items that aren't already in the array
    for (const item of dropdownInputs) {
      const exists = mergedArray.some(existing => existing._id === item._id);
      if (!exists) {
        mergedArray.push(item);
      }
    }
    
    // Assign the merged array to the appropriate collection
    switch (this.form.get('offerType')?.value) {
      case 'products':
        this.products = mergedArray;
        break;
      case 'collections':
        this.collections = mergedArray;
        break;
      case 'categories':
        this.categories = mergedArray;
        break;
      case 'parents':
        this.parents = mergedArray;
        break;
      case 'brands':
        this.brands = mergedArray;
        break;
    }
    
    // Update the dropdown inputs for the dropdown component
    this.dropdownInputs = mergedArray;
  }

  setOfferTypeIfNotEmpty(array: any[], type: string = 'complete') {
    if (array.length > 0) {
      this.form.get('offerType')?.setValue(type);
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    if (this.form.get('offerType')?.value == 'complete') {
      this.products = [];
      this.categories = [];
      this.collections = [];
      this.brands = [];
      this.parents = [];
    }

    this.offerService
      .updateOffer({
        ...this.form.value,
        offerType:
          this.form.get('offerType')?.value == 'complete'
            ? 'complete'
            : 'partial',
        categories: this.categories.length > 0 ? this.categories?.map((item: any) => item._id) : null,
        products: this.products.length > 0 ? this.products?.map((item: any) => item._id) : null,
        collections: this.collections.length > 0 ? this.collections?.map((item: any) => item._id) : null,
        brands: this.brands.length > 0 ? this.brands?.map((item: any) => item._id) : null,
        parents: this.parents.length > 0 ? this.parents?.map((item: any) => item._id) : null,
        slug: this.offerId,
      })
      .subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.message);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.router.navigate([this.appRoute.offer.OFFER_LIST]);
        }
      });
  }
}