import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { environment } from 'src/environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { HotToastService } from '@ngneat/hot-toast';
import { debounceTime, retry } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BrandService } from 'src/app/includes/services/brand.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface StoreField {
  title: string;
  description: string;
  isFilter: boolean;
  isVisible: boolean;
}
interface BusinessField {
  title: string;
  description: string;
}

interface AddOnOption {
  _id: string;
  name: string;
  product: Product;
  description: string;
  price: number;
  isEditable: boolean;
  discountMethod: string;
  discountAmount: number;
}

interface AddOns {
  _id: string;
  title: string;
  description: string;
  isRequired: boolean;
  addOnType: string;
  options: AddOnOption[];
}

interface Product {
  name: string;
  sku: string;
  thumbnail: string;
  overview: string;
  price: {
    mrp: number;
    selling: number;
  };
  _id: string;
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  task = PageTasks.ADD;
  isSaving: boolean = false;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted: boolean = false;
  searchKeyowrds: any = [];
  tumbnail: any;
  attributes: any = [];
  slug: string = '';
  base: string;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Type here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Sen' },
      { class: 'Sen', name: 'Sen' },
      { class: 'noto-naskh-arabic', name: 'Noto Naskh Arabic' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ],
  };
  productIcons: Array<any> = [];
  settings: any = {};
  parentForm: FormGroup;
  taxClassDetails: Array<any> = [];
  brand: FormControl = new FormControl('', Validators.required);

  brands: Array<any> = [];
  selectedBrand: any = null;
  brandsMap: any = {};
  businessFields: BusinessField[] = [];


  productCategories: Array<any> = [];
  images: Array<any> = [];
  defaultCategories: Array<any> = [];
  form: FormGroup;
  parentDetails: any;
  parentSlug: string;
  brandDetails: any;
  previewDetails: any;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  activeTabIndex: number = 0; // Track active tab for conditional loading
  searchKeywords: Array<string> = [];
  searchKeyword: FormControl = new FormControl('');
  relatedProducts: Array<{ name: string, thumbnail: string, sku: string, _id: string }> = [];
  categories: Array<any> = [];
  selectedCategories: Array<string> = [];
  primaryCategory: FormControl = new FormControl('', Validators.required);
  productCategory: FormControl = new FormControl('');
  productAttributes: Array<any> = [];
  isCategoryMultiple: boolean = true;
  isBrandMultiple: boolean = false;
  isProductMultiple: boolean = true;
  tagsForm: FormGroup;
  icons: Array<any> = [];
  productTags: any = {
    topRightTag: '',
    topLeftTag: '',
    bottomRightTag: '',
    bottomLeftTag: '',
  };
  addOnItemsForm: FormGroup;
  productSlug: string = ''; // Store product slug
  productDetails: any; // Store product details
  addOnItems: Array<any> = [];
  thumbnailPreview: string = '';
  videoThumbnailPreview: string = '';
  activeRelatedProducts: Array<any> = [];
  relatedProduct: FormControl = new FormControl('');
  storeFields: Array<StoreField> = [];
  storeFieldForm: FormGroup = new FormGroup({});
  isStoreSubmitted: boolean = false;
  modalRef?: BsModalRef;
  attributeForm: FormGroup = new FormGroup({});
  isAttributeSubmitted: boolean = false;
  attributeImages: Array<any> = [];
  attributeTypes: Array<any> = [
    { title: 'Text', value: 'text' },
    { title: 'Color', value: 'color' },
    { title: 'Image', value: 'image' },
  ];
  siblings: Array<any> = [];
  productBannerDetails: string = '';
  languages: Array<string> = [];
  tagIcons: Array<string> = [];
  siblingsRef?: BsModalRef;
  @ViewChild('siblingsTemplate') siblingsTemplateModal: TemplateRef<any>;
  isSkipUpdate: FormControl = new FormControl(false);


  historyRef?: BsModalRef;
  historyPageIndex: number = 1;
  historyPageSize: number = 5;
  historyLists: Array<any> = [];
  totalResults: number = 0;
  totalPages: number = 1;
  isLoadingHistory: boolean = false;

  // Add-Ons starts here
  addOnsRef?: BsModalRef;
  manageAddOnsRef?: BsModalRef;
  addOnsKeyword: FormControl = new FormControl('', Validators.required);
  addOnSearchResults: Array<any> = [];
  addOnProducts: Array<any> = [];
  addOnForm: FormGroup = new FormGroup({});
  addOnOptionForm: FormGroup = new FormGroup({});
  addOnTypes: Array<{ key: string; value: string }> = [
    { key: 'Select', value: 'select' },
    { key: 'Radio', value: 'radio' },
    { key: 'Checkbox', value: 'checkbox' },
  ];
  isProductSelected: boolean = false;
  addOnDoc: Product | null;
  addOnTabIndex: number = 0;
  isOptionSubmitted: boolean = false;
  isItemSubmitted: boolean = false;
  addOnOptions: AddOnOption[] = [];
  addOns: AddOns[] = [];
  addOnPageIndex: number = 1;
  addOnPageSize: number = 10;
  totalAddOnResults: number = 0;
  totalAddOnPages: number = 1;
  isEditAddOnOption: boolean = false;
  editAddOnOptionIndex: number = 0;
  isEditAddOn: boolean = false;
  editAddOnIndex: number = 0;
  // Add-Ons ends here
  storeFieldIndex: number | null;

  slugHistoryRef?: BsModalRef;
  @ViewChild('slugHistoryTemplate') slugHistoryTemplateModal: TemplateRef<any>;
  isLoadingSlugHistory: boolean = false;

  slugConfirmationRef?: BsModalRef;
  newSlugValue: string = '';
  @ViewChild('slugConfirmation') slugConfirmationTemplate: TemplateRef<any>;

  relatedProductsRef: BsModalRef | null = null
  relatedProductsKeyword: FormControl = new FormControl('');
  relatedProductItems: Array<{ name: string, sku: string, thumbnail: string, _id: string }> = [];

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private ProductService: ProductService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private BrandService: BrandService
  ) {
    this.addOnsKeyword.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.searchProducts();
    });

    this.relatedProductsKeyword.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      if (!this.relatedProductsKeyword.value) {
        this.addOnSearchResults = [];
      }

      if (!this.relatedProductsKeyword.valid) {
        return;
      }

      this.ProductService.searchProducts({
        name: this.relatedProductsKeyword.value,
        page: 1,
        limit: 40,
      }).subscribe({
        next: (res: any) => {
          if (res && res.errorCode == 0) {
            this.relatedProductItems = res.result.data;
            this.ChangeDetectorRef.markForCheck();
          } else { }
        },
        error: (err: any) => { },
      });
    })
  }
  addBusinessField(): void {
    this.businessFields.push({
      title: '',
      description: '',
    });
  }
  removeBusinessField(index: number): void {
    this.businessFields.splice(index, 1);
  }


  openRltdProducts(template: TemplateRef<any>) {
    this.relatedProductsRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });
  }

  closeRltdProducts() {
    this.relatedProductsKeyword.setValue('')
    this.relatedProductsRef?.hide()
  }

  updateRltdProducts(productDoc: { name: string, thumbnail: string, sku: string, _id: string }) {
    const isExists: boolean = this.relatedProducts.some((relatedProduct) => relatedProduct._id == productDoc._id)
    if (isExists) {
      this.relatedProducts = this.relatedProducts.filter((relatedProduct) => relatedProduct._id !== productDoc._id)
      this.HotToastService.info('Product removed')
    } else {
      this.relatedProducts.push(productDoc)
      this.HotToastService.info('Product added')
    }
  }

  isRltProductExists(productId: string): boolean {
    return this.relatedProducts.some((relatedProduct) => relatedProduct._id == productId)
  }

  openHistory(template: TemplateRef<any>) {
    this.historyRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });

    this.fetchHistory();
  }

  onHistoryPageChange(event: { pageIndex: number; pageSize: number }) {
    this.historyPageIndex = event.pageIndex;
    this.historyPageSize = event.pageSize;
    this.fetchHistory();
  }

  fetchHistory() {
    this.isLoadingHistory = true;
    this.ChangeDetectorRef.markForCheck();


    this.ProductService.getProductHistory(
      this.productDetails._id,
      this.historyPageIndex,
      this.historyPageSize
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.historyLists = res?.result?.results;
          this.totalResults = res?.result?.totalResults;
          this.totalPages = res?.result?.totalPages;
        } else {
          this.HotToastService.error(res?.message || 'Failed to load history');
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message || 'Failed to load history');
      },
      complete: () => {
        this.isLoadingHistory = false;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  dropProductImages(event: any) {
    let items = [...this.images];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.images = [...items];
  }
  closeHistory() {
    this.historyRef?.hide();
  }

  openSlugHistory(template: TemplateRef<any>) {
    this.slugHistoryRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-md',
      ignoreBackdropClick: true,
    });
    this.fetchHistory();
  }

  closeSlugHistory() {
    this.slugHistoryRef?.hide();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.HotToastService.success('Slug copied to clipboard!');
    }).catch(err => {
      this.HotToastService.error('Failed to copy slug.');
      console.error('Failed to copy: ', err);
    });
  }

  getFormatDate(date: any) {
    return new Date(date).toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  }

  getFormatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  // Add-Ons starts here
  // This function is used to search for products
  searchProducts() {
    if (!this.addOnsKeyword.value) {
      this.addOnSearchResults = [];
    }

    if (!this.addOnsKeyword.valid) {
      return;
    }

    this.ProductService.searchProducts({
      name: this.addOnsKeyword.value,
      page: this.addOnPageIndex,
      limit: this.addOnPageSize
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.addOnSearchResults = res?.result?.data;
          this.totalAddOnResults = res?.result?.totalResults;
          this.totalAddOnPages = res?.result?.totalPages;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  // This function is used to trigger the add-on page
  addOnPageTrigger(event: { pageIndex: number; pageSize: number }) {
    this.addOnPageIndex = event.pageIndex;
    this.addOnPageSize = event.pageSize;
    this.searchProducts();
  }

  // This function is used to toggle the add-on product
  toggleAddOnProduct(product: Product, type: 'add' | 'remove') {
    const isExists: boolean = this.addOnProducts.some(item => item?._id == product?._id);
    if (isExists) {
      this.addOnProducts = this.addOnProducts.filter(item => item?._id != product?._id);
    } else {
      this.addOnProducts.push(product);
    }

    if (type == 'add') {
      this.isProductSelected = true;
      this.addOnTabIndex = 1;
      this.addOnDoc = product;
      this.addOnOptionForm.patchValue({
        name: product.name,
        product: product._id,
        description: product.overview,
        price: product.price.selling,
      })
    }

    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to get the add-on option controls
  get addOnOptionControls() {
    return this.addOnOptionForm.controls;
  }

  // This function is used to reset the add-on variables
  resetVars() {
    this.addOnTabIndex = 0;
    this.editAddOnOptionIndex = 0;
    this.addOnProducts = [];
    this.addOnOptionForm.reset();
    this.addOnOptionForm.patchValue({ 'isEditable': false, discountMethod: 'amount' });
    this.addOnsKeyword.setValue('');
    this.isEditAddOnOption = false;
    this.isOptionSubmitted = false;
    this.isProductSelected = false;
    this.addOnDoc = null;
  }

  // This function is used to handle the discount method
  handleDiscountMethod() {
    if (this.addOnOptionForm.value.discountMethod == 'amount') {
      this.addOnOptionForm.get('discountAmount')?.removeValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);
      this.addOnOptionForm.get('discountAmount')?.updateValueAndValidity();
      this.addOnOptionForm.patchValue({ discountAmount: 0, price: this.addOnDoc?.price?.selling })
    } else {
      // Add validation for the discount amount
      let validators = [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)];
      if (this.addOnDoc && this.addOnOptionForm.value.discountMethod == 'flat') {
        validators.push(Validators.max(this.addOnDoc?.price?.selling));
      }

      if (this.addOnOptionForm.value.discountMethod == 'percentage') {
        validators.push(Validators.max(100));
      }

      this.addOnOptionForm.get('discountAmount')?.setValidators(validators);
      this.addOnOptionForm.get('discountAmount')?.updateValueAndValidity();
      this.addOnOptionForm.patchValue({ price: 0, discountAmount: 0 })
    }
  }

  // This function is used to handle the discount amount
  handleDiscountAmount() {
    if (this.addOnOptionForm.value.discountMethod == 'flat') {
      if (this.addOnDoc && this.addOnOptionForm.value.discountAmount > this.addOnDoc?.price?.selling) {
        this.addOnOptionForm.get('discountAmount')?.setErrors({ pattern: true });
        this.HotToastService.error('Discount amount cannot be greater than the price');
      }
    } else if (this.addOnOptionForm.value.discountMethod == 'percentage') {
      if (this.addOnDoc && this.addOnOptionForm.value.discountAmount > 100) {
        this.addOnOptionForm.get('discountAmount')?.setErrors({ pattern: true });
        this.HotToastService.error('Discount amount cannot be greater than 100');
      }
    }
  }

  // This function is used to get the add-on option price
  getAddOnOptionPrice() {
    if (!this.addOnDoc) {
      return 0;
    }

    if (this.addOnOptionForm.value.discountMethod == 'flat') {
      return this.addOnDoc?.price.selling - this.addOnOptionForm.value.discountAmount;
    }

    if (this.addOnOptionForm.value.discountMethod == 'percentage') {
      return this.addOnDoc?.price.selling - (this.addOnDoc?.price.selling * this.addOnOptionForm.value.discountAmount / 100);
    }
  }

  // This function is used to add the add-on option to the addOnOptions array
  addAddOnOption() {
    // if (!this.addOnOptionForm.valid) {
    //   this.isOptionSubmitted = true;
    //   this.HotToastService.error('Please fill all the fields');
    //   return;
    // }

    // console.log(this.addOnOptionForm.value);

    if (this.isEditAddOnOption) {
      this.addOnOptions[this.editAddOnOptionIndex] = { ...this.addOnOptionForm.value, product: this.addOnDoc };
    } else {
      this.addOnOptions.push({ ...this.addOnOptionForm.value, product: this.addOnDoc });
    }

    this.HotToastService.success(`Option ${this.isEditAddOnOption ? 'updated' : 'added'} successfully`);
    this.resetVars()
    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to edit the add-on option
  editAddOnOption(index: number) {
    console.log(this.addOnOptions[index]);
    this.addOnOptionForm.patchValue(this.addOnOptions[index]);
    this.addOnTabIndex = 1;
    this.isProductSelected = true;
    this.addOnDoc = this.addOnOptions[index].product;
    this.isEditAddOnOption = true;
    this.editAddOnOptionIndex = index;
    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to remove the add-on option from the addOnOptions array
  removeAddOnOption(index: number) {
    this.addOnOptions.splice(index, 1);
    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to cancel the add-on item
  cancelAddOnItem() {
    this.addOnForm.reset();
    this.addOnForm.patchValue({ isRequired: false, addOnType: 'select' });
    this.manageAddOnsRef?.hide();
    this.addOnOptions = [];
    this.isItemSubmitted = false;
    this.resetVars();
    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to add the add-on to the addOns array
  addAddOnItem() {
    // Force validation update
    this.addOnForm.updateValueAndValidity();

    // Check specific required fields instead of overall form validity
    const titleControl = this.addOnForm.get('title');
    if (!titleControl?.value || titleControl?.invalid) {
      this.isItemSubmitted = true;
      this.HotToastService.error('Please fill the title field');
      return;
    }

    if (this.addOnOptions?.length == 0) {
      this.HotToastService.error('Please add at least one option');
      return;
    }

    this.addOnForm.patchValue({ options: this.addOnOptions })

    if (this.isEditAddOn) {
      this.addOns[this.editAddOnIndex] = this.addOnForm.value;
    } else {
      this.addOns.push(this.addOnForm.value);
    }

    this.HotToastService.success(`Add-On ${this.isEditAddOn ? 'updated' : 'added'} successfully`);
    this.cancelAddOnItem();
  }

  // This function is used to remove the add-on from the addOns array
  removeAddOn(index: number) {
    this.addOns.splice(index, 1);
    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to open the manage add-on modal
  openManageAddOns(template: TemplateRef<any>, type: 'add' | 'edit', index: number | null) {
    this.manageAddOnsRef = this.BsModalService.show(template, { class: 'modal-dialog-centered modal-xl', ignoreBackdropClick: true });

    if (type == 'edit' && index !== null) {
      // Edit mode: populate form with existing data
      this.addOnForm.patchValue({ ...this.addOns[index] });
      this.addOnOptions = this.addOns[index].options;
      this.isEditAddOn = true;
      this.editAddOnIndex = index;
    } else {
      // Add mode: reset all form data and flags
      this.addOnForm.reset();
      this.addOnForm.patchValue({ isRequired: false, addOnType: 'select' });
      this.addOnOptions = [];
      this.isEditAddOn = false;
      this.editAddOnIndex = 0;
      this.isItemSubmitted = false;
      this.resetVars();
    }

    this.ChangeDetectorRef.markForCheck();
  }

  // This function is used to get the add-on form controls
  get addOnFormControls() {
    return this.addOnForm.controls;
  }

  // This function is used to get the add-on option form controls
  get addOnOptionFormControls() {
    return this.addOnOptionForm.controls;
  }

  // This function is used to trigger the add-on switch
  onTriggerAddOns(event: { toggleState: boolean, switchId: string }, type: string) {
    if (type == 'isRequired') {
      this.addOnForm.get('isRequired')?.setValue(event.toggleState);
    }

    if (type == 'isEditable') {
      this.addOnOptionForm.get('isEditable')?.setValue(event.toggleState);
    }
  }
  // Add-Ons ends here

  onBrandChange(event: any) {
    if (event) {
      this.selectedBrand = event;
      this.form.patchValue({
        brand: event.slug,
      });
    } else {
      this.selectedBrand = null;
      this.form.patchValue({
        brand: null,
      });
    }
  }

  onBrandTriggered(event: any) {
    this.parentForm.get('brand')?.setValue(event?._id);
  }

  get storeFieldControls() {
    return this.storeFieldForm.controls;
  }

  onCategoryTriggered(event: any) {
    const isIdPresent = this.productCategories.some(
      (category) => category?._id == event?._id
    );
    if (isIdPresent) {
      this.HotToastService.info('Category already added');
    } else {
      this.productCategories.push(event);
      this.getDefaultCategories();
    }
    this.parentForm.get('parentCategories')?.setValue(this.productCategories);
  }

  onProductsTriggered(productId?: any) {
    let productDetails: any = null;
    if (productId) {
      productDetails = productId;
    } else {
      let productRef = this.activeRelatedProducts.filter(
        (item: any) => item?._id == this.relatedProduct.value
      );
      productDetails = productRef[0];
    }
    const isIdPresent: boolean = this.relatedProducts.some(
      (product) => product?._id == productDetails?._id
    );
    if (isIdPresent) {
      this.HotToastService.error('Product removed from list');
      this.relatedProducts = this.relatedProducts.filter(
        (item: any) => item?._id != productDetails?._id
      );
    } else {
      this.relatedProducts.push(productDetails);
      this.HotToastService.success('Product added to list');
    }
    this.relatedProduct.setValue('');
    this.parentForm.get('relatedProducts')?.setValue(this.relatedProducts);
  }

  onTagsTriggered(event: any, type: string, method: string) {
    switch (type) {
      case 'topright':
        if (method == 'add') {
          this.tagsForm.get('topRightTag')?.setValue(event?._id);
          this.productTags.topRightTag = event.path;
        } else {
          this.tagsForm.get('topRightTag')?.setValue(null);
          this.productTags.topRightTag = '';
        }
        break;
      case 'topleft':
        if (method == 'add') {
          this.tagsForm.get('topLeftTag')?.setValue(event?._id);
          this.productTags.topLeftTag = event.path;
        } else {
          this.tagsForm.get('topLeftTag')?.setValue(null);
          this.productTags.topLeftTag = '';
        }
        break;
      case 'bottomright':
        if (method == 'add') {
          this.tagsForm.get('bottomRightTag')?.setValue(event?._id);
          this.productTags.bottomRightTag = event.path;
        } else {
          this.tagsForm.get('bottomRightTag')?.setValue(null);
          this.productTags.bottomRightTag = '';
        }
        break;
      case 'bottomleft':
        if (method == 'add') {
          this.tagsForm.get('bottomLeftTag')?.setValue(event?._id);
          this.productTags.bottomLeftTag = event.path;
        } else {
          this.tagsForm.get('bottomLeftTag')?.setValue(null);
          this.productTags.bottomLeftTag = '';
        }
        break;
    }
  }

  getDefaultCategories() {
    this.categoryService.getCategories({}, '').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => { },
    });
  }

  handleThumbnail(event: any) {
    this.parentForm.get('thumbnail')?.setValue(event.path);
  }

  productMediaClicked(event: any) {
    // For update product view, we need to check for both _id and path
    const eventPath = event.path;
    const eventId = event._id;

    // Check if the item already exists in our images array
    let isExists: boolean = this.images.some(
      (item: any) => (item._id && item._id === eventId) || (item.path && item.path === eventPath)
    );

    if (isExists) {
      // If it exists, remove it
      this.images = this.images.filter(
        (item: any) => !((item._id && item._id === eventId) || (item.path && item.path === eventPath))
      );
      this.HotToastService.info('Image removed from product');
    } else {
      // If it doesn't exist, add it
      this.images.push(event);
      this.HotToastService.success('Image added to product');
    }

    // Update form control with the current images
    if (this.form && this.form.get('files')) {
      let files = this.images.map((item: any) => item.path) || [];
      this.form.get('files')?.setValue(files);
    }

    // Force change detection
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.markForCheck();
    }
  }

  productIconClicked(event: any, type: string = 'add') {
    const iconPath = type === 'remove' ? event : event.path;

    let isExists: boolean = this.icons.some(item => item === iconPath);

    if (isExists) {
      // Remove the icon
      const index = this.icons.findIndex(item => item === iconPath);
      if (index !== -1) {
        this.icons.splice(index, 1);
        this.HotToastService.info('Icon removed from product');
      }
    } else {
      // Add the icon
      this.icons.push(event.path);
      this.HotToastService.success('Icon added to product');
    }

    // Force change detection
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.markForCheck();
    }
  }


  removeProductMedia(image: any) {
    this.images = this.images?.filter((item: any) => item?._id != image?._id);
  }

  productThumbnailClicked(event: any) {
    this.form.get('thumbnail')?.setValue(event.path);
    this.thumbnailPreview = event.path;
  }

  removeThumbnail() {
    this.form.get('thumbnail')?.setValue('');
    this.thumbnailPreview = '';
  }

  productVideoThumbnailClicked(event: any) {
    this.form.get('videoThumbnail')?.setValue(event.path);
  }

  toggleProductCategory(event: any, type: string) {
    if (type === 'add') {
      // Handle single or multiple selections from ng-select
      if (Array.isArray(event)) {
        // Multiple categories selected
        this.categories = event;
      } else {
        // Single category selected
        const isExists = this.categories.some(
          (item) => item.slug === event.slug
        );
        if (isExists) {
          this.HotToastService.info('Category already added');
        } else {
          this.categories.push(event);
        }
      }
    } else {
      // Remove category
      this.categories = this.categories.filter((item) => item.slug !== event);
    }

    // Update selectedCategories
    this.selectedCategories = this.categories.map((cat) => cat.slug);

    // Update form value if needed
    if (this.form) {
      this.form.patchValue({
        category: {
          id: this.categories.map((cat) => cat._id),
          refid: this.categories.map((cat) => cat.catid),
        },
      });
    }
  }

  toggleAddOnItems() { }

  saveChanges() {
    this.ChangeDetectorRef.markForCheck();

    // ✅ Normalize slug
    const currentSlug = this.form.get('slug')?.value;
    if (currentSlug) {
      this.form.get('slug')?.setValue(this.formatSlugForSave(currentSlug), { emitEvent: false });
    }

    // ✅ Ensure selling price sync if offer changes
    const formPrice = this.form.get('price')?.value;
    const productOffer = this.productDetails?.price?.offer;
    if (formPrice?.offer !== productOffer) {
      this.form.get('price')?.setValue(
        { ...formPrice, selling: formPrice.offer },
        { emitEvent: false }
      );
    }

    // ✅ Validate categories
    if (!this.categories?.length) {
      this.HotToastService.error('Please add at least one category');
      return;
    }

    // ✅ Validate form
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.isSaving = false;
      this.ChangeDetectorRef.markForCheck();
      return;
    }

    // ✅ Disable save button
    this.isSaving = true;

    // ✅ Sanitize addOns
    // Sanitize addOns
    this.addOns = (this.addOns || [])
      // ✅ Filter out invalid addOns (non-objects or null values)
      .filter((addOn: any) => typeof addOn === 'object' && addOn !== null)
      // ✅ Process each addOn
      .map((addOn: any) => {
        const sanitizedAddOn = { ...addOn };

        // Ensure options is an array
        sanitizedAddOn.options = Array.isArray(addOn.options)
          ? addOn.options.map((option: any) => {
            const sanitizedOption = {
              ...option,
              product:
                typeof option.product === 'string'
                  ? option.product
                  : option.product?._id,
            };

            // Remove _id if not present
            if (!sanitizedOption._id) {
              delete sanitizedOption._id;
            }

            return sanitizedOption;
          })
          : [];

        // Remove _id if not present
        if (!sanitizedAddOn._id) {
          delete sanitizedAddOn._id;
        }

        return sanitizedAddOn;
      });



    // ✅ Build payload (spread only once to avoid overwriting)
    const payload: any = {
      ...this.form.value,
      _id: this.productDetails?._id,
      prodid: this.productDetails?.prodid,
      slug: this.form.get('slug')?.value,
      addOns: this.addOns,
      files: this.images.map(file => file.path),
      relatedProducts: this.relatedProducts?.map(p => p?._id) || [],
      product: {
        id: this.productDetails?.parentId,
        refid: this.productDetails?.product?.refid,
      },
      brand: this.selectedBrand
        ? {
          name: this.selectedBrand.name,
          slug: this.selectedBrand.slug,
          thumbnail: this.selectedBrand.thumbnail,
          cover: this.selectedBrand.cover,
        }
        : null,
      parentId: this.productDetails?.parentId,
      tagIcons: this.tagIcons,
      attributes: this.attributes,
      storeFrontFields: this.storeFields,
      businessFields: this.businessFields,
      productIcons: this.icons,
      isSkipUpdate: this.isSkipUpdate.value,
      // ✅ Localized fields (merged carefully)
      localizedNames: {
        ...this.productDetails.localizedNames,
        [this.settings.primaryLang]: this.form.get('name')?.value,
      },
      localizedOverview: {
        ...this.productDetails.localizedOverview,
        [this.settings.primaryLang]: this.form.get('overview')?.value,
      },
      localizedOrigin: {
        ...this.productDetails.localizedOrigin,
        [this.settings.primaryLang]: this.form.get('origin')?.value,
      },
      localizedDetails: {
        description: {
          ...this.productDetails.localizedDetails?.description,
          [this.settings.primaryLang]: this.form.get('details.description')?.value,
        },
        features: {
          ...this.productDetails.localizedDetails?.features,
          [this.settings.primaryLang]: this.form.get('details.features')?.value,
        },
        longDescription: {
          ...this.productDetails.localizedDetails?.longDescription,
          [this.settings.primaryLang]: this.form.get('details.longDescription')?.value,
        },
      },
      localizedMetaTitles: {
        ...this.productDetails.localizedMetaTitles,
        [this.settings.primaryLang]: this.form.get('metaTitle')?.value,
      },
      localizedMetaDescriptions: {
        ...this.productDetails.localizedMetaDescriptions,
        [this.settings.primaryLang]: this.form.get('metaDescription')?.value,
      },
      localizedMetaKeywords: {
        ...this.productDetails.localizedMetaKeywords,
        [this.settings.primaryLang]: this.form.get('metaKeywords')?.value,
      },
      // ✅ Categories
      category: {
        id: this.categories.map(c => c?._id),
        refid: this.categories.map(c => c?.catid),
      },
      primaryCategory: this.primaryCategory.value
        ? {
          ...this.primaryCategory.value,
        }
        : null,
      categories: this.categories
        .filter(Boolean)
        .map(c => ({
          name: c.name,
          slug: c.slug,
          hierarchies: c.hierarchies,
          thumbnail: c.thumbnail,
          cover: c.cover,
        })),
      productTags: this.tagsForm.value,
    };

    // ✅ Remove redundant field
    delete payload.name;

    // ✅ API call
    this.ProductService.updateProduct(this.productDetails.slug, payload)
      .pipe(retry(3))
      .subscribe({
        next: (res: any) => {
          if (res?.errorCode === 0) {
            this.isSaving = false;
            this.Router.navigate(['/app/product']);
            this.siblingsRef?.hide();
            this.HotToastService.success(res?.message);
          } else if (res.errorCode === 2) {
            this.isSaving = false;
            this.ChangeDetectorRef.markForCheck();

            this.siblingsRef = this.BsModalService.show(this.siblingsTemplateModal, {
              class: 'modal-dialog-centered modal-lg',
              ignoreBackdropClick: true,
            });

            this.ProductService
              .getProducts({
                parentId: this.productDetails.parentId,
                productId: this.productDetails?._id,
              })
              .subscribe({
                next: (res: any) => {
                  if (res?.errorCode === 0) {
                    this.siblings = res?.result;
                    this.ChangeDetectorRef.markForCheck();
                  } else {
                    this.HotToastService.error(res?.message);
                  }
                },
                error: err => this.HotToastService.error(err?.message),
              });
          } else {
            this.isSaving = false;
            this.ChangeDetectorRef.markForCheck();
            this.HotToastService.error(res?.message);
          }
        },
        error: (err: any) => {
          this.isSaving = false;
          this.HotToastService.error(err?.message);
        },
      });
  }


  skipUpdate() {
    this.isSkipUpdate.setValue(true);
    this.saveChanges();
  }

  onTriggerSiblings(
    event: { switchId: string; toggleState: boolean },
    switchType: string
  ) {
    let payload: any = { prodid: event.switchId };
    if (switchType == 'isActive') {
      payload['isActive'] = event.toggleState;
    } else if (switchType == 'isVisible') {
      payload['isVisible'] = event.toggleState;
    }

    this.ProductService.updateProduct('', payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });
  }

  // skipUpdate() {
  //   this.isSkipUpdate.setValue(true);
  //   this.saveChanges();
  // }

  toggleTab(index: number) {
    if (this.staticTabs?.tabs[index]) {
      this.staticTabs.tabs[index].active = true;
      this.activeTabIndex = index;
      // Trigger conditional loading for assets components when "Product Medias" tab (index 1) is activated
      if (index === 1) {
        this.triggerMediasTabLoading();
      }
    }
  }

  // Method to trigger loading for assets components in the Product Medias tab
  private triggerMediasTabLoading(): void {
    // Use setTimeout to ensure the tab content is rendered before triggering loading
    setTimeout(() => {
      // This will be handled by the template using the activeTabIndex property
      this.ChangeDetectorRef.detectChanges();
    }, 100);
  }

  toggleSearchKeywords(event: any, type: string) {
    if (event?.key == 'Enter') {
      event?.preventDefault();
    }

    const inputValue = (event?.target as HTMLInputElement)?.value;
    if (type == 'add' && inputValue) {
      if (this.searchKeywords.includes(inputValue)) {
        this.HotToastService.info('Keyword already added');
      } else {
        this.searchKeywords.push(inputValue);
        this.searchKeyword?.setValue('');
      }
      this.form.get('searchKeywords')?.setValue(this.searchKeywords);
    } else {
      this.searchKeywords = this.searchKeywords.filter((item: any) => item != event);
      this.form.get('searchKeywords')?.setValue(this.searchKeywords);
    }
  }

  handleProductBanner(event: any) {
    this.form.get('productBanner')?.setValue(event.path);
    this.productBannerDetails = event.path;
  }

  removeProductBanner() {
    this.form.get('productBanner')?.setValue(null);
    this.productBannerDetails = '';
  }

  get formControls() {
    return this.form.controls;
  }
  generateSlug() {
    const name = this.productDetails?.name || '';
    let slug = name.toLowerCase().normalize('NFKD');
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\u0600-\u06FFa-z0-9-]/g, '');
    // Replace multiple hyphens with single hyphen
    slug = slug.replace(/-+/g, '-');

    // Trim hyphens from start and end
    slug = slug.replace(/^-+|-+$/g, '');

    const newSlug = `${slug}-${this.productDetails?.sku}`;

    // For manual generation, show confirmation
    this.openSlugConfirmation(newSlug);
  }

  private formatSlugForSave(value: string): string {
    let slug = value.toLowerCase().normalize('NFKD');

    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, '-');

    slug = slug.replace(/[^\u0600-\u06FFa-z0-9-]/g, '');
    // Replace multiple hyphens with single hyphen
    slug = slug.replace(/-+/g, '-');
    // Trim hyphens from start and end
    return slug.replace(/^-+|-+$/g, '');
  }

  openSlugConfirmation(newSlug: string) {
    this.newSlugValue = newSlug;
    this.slugConfirmationRef = this.BsModalService.show(this.slugConfirmationTemplate, {
      class: 'modal-sm',
      ignoreBackdropClick: true,
    });
  }

  confirmSlug() {
    this.form.patchValue({ slug: this.newSlugValue });
    this.slugConfirmationRef?.hide();
  }

  cancelSlug() {
    this.slugConfirmationRef?.hide();
  }

  onToggleStoreField(event: { toggleState: boolean, switchId: string }) {
    this.storeFieldForm.get('isVisible')?.setValue(event.toggleState);
  }


  // Fetch items
  fetchBrands() {
    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (
          res.errorCode === 0 &&
          Array.isArray(res.result) &&
          res.result.length > 0
        ) {
          this.brands = res.result.filter((brand: any) => brand && brand.slug);

          if (this.productDetails?.brand) {
            this.selectedBrand = this.brands.find(
              (brand) => brand.slug === this.productDetails.brand.slug
            );
          }

          this.ChangeDetectorRef.markForCheck();
        } else {
          this.brands = [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching brands:', err);
      },
    });
  }

  fetchCategories() {
    this.categoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  fetchSettings() {
    this.AppSettingsService.getSettings().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.languages = res?.result?.languages;

          this.settings.domain = this.settings?.domain?.endsWith('/') ? this.settings?.domain : `${this.settings?.domain}/`;

          // If product details are already loaded, update the form with correct localization
          if (this.productDetails) {
            this.updateFormWithLocalizedContent();
          }

          this.ChangeDetectorRef.markForCheck();
        } else {
          console.error('Failed to load settings:', res);
        }
      },
      error: (err: any) => {
        console.error('Error loading settings:', err);
      },
    });
  }

  fetchTax() {
    this.taxClassService.getTaxClasses().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.taxClassDetails = res?.result;
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  ngOnInit(): void {
    this.base = environment.base;

    Promise.all([
      this.fetchBrands(),
      this.fetchCategories(),
      this.fetchSettings(),
      this.fetchTax()
    ])

    this.addOnOptionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      _id: new FormControl(''),
      product: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.pattern('^\\d+(\\.\\d+)?$')]),
      description: new FormControl(''),
      discountMethod: new FormControl('amount'),
      discountAmount: new FormControl(0),
      isEditable: new FormControl(false),
    });

    this.addOnForm = new FormGroup({
      _id: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      isRequired: new FormControl(false),
      addOnType: new FormControl('select'),
      options: new FormControl([]),
    });

    this.attributeForm = new FormGroup({
      type: new FormControl('text'),
      title: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    });

    this.tagsForm = new FormGroup({
      topRightTag: new FormControl(null),
      topLeftTag: new FormControl(null),
      bottomRightTag: new FormControl(null),
      bottomLeftTag: new FormControl(null),
    });

    this.storeFieldForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isFilter: new FormControl(false),
      isVisible: new FormControl(true),
    });

    this.productSlug = this.ActivatedRoute.snapshot.queryParams.product || '';

    this.ProductService.getProductDetails(this.productSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          // Store the complete product details including all localized content
          this.productDetails = res?.result;

          // Basic form patching (non-localized fields)
          this.form.patchValue(res?.result);

          // Check if searchKeywords exist and are not empty
          this.searchKeywords = (res?.result?.searchKeywords || []).filter(Boolean);
          this.form.get('searchKeywords')?.setValue(this.searchKeywords);

          // Add-Ons
          this.addOns = res?.result?.addOns || [];

          // Process images
          if (res?.result?.files && Array.isArray(res?.result?.files)) {
            this.images = res?.result?.files
              .filter((item: any) => item !== null && item !== undefined)
              .map((item: any) => {
                // If the item is already an object with a path property, use it
                if (typeof item === 'object' && item !== null && item.path) {
                  return item;
                }
                // Otherwise, create a new object with a path property
                return {
                  path: typeof item === 'string' ? item : '',
                  _id: typeof item === 'object' && item !== null && item._id ? item._id : null
                };
              });
          } else {
            this.images = [];
          }

          // Set the primary category
          if (res?.result?.primaryCategory) {
            this.primaryCategory.setValue(res?.result?.primaryCategory);
          } else {
            if (res?.result?.categories && res?.result?.categories.length > 0) {
              const primaryCategoryDoc: any = res?.result?.categories[0];
              this.primaryCategory.setValue(primaryCategoryDoc);
            }
          }

          if (res.result?.brand) {
            this.selectedBrand = this.brands.find((brand) => brand.slug === res.result.brand.slug);
            this.form.patchValue({ brand: res.result.brand.slug });
          }

          // Set other details
          this.storeFields = res?.result?.storeFrontFields;
          this.businessFields = res?.result?.businessFields || [];
          this.tagIcons = res?.result?.tagIcons ? res?.result?.tagIcons : [];
          this.categories = res?.result?.categories || [];
          this.selectedCategories = this.categories.map((cat) => cat.slug);
          this.parentDetails = res?.result?.product?.id;
          this.productBannerDetails = res?.result?.productBanner && res?.result?.productBanner;
          this.attributes = res?.result?.attributes;
          this.relatedProducts = res?.result?.relatedProducts;
          this.icons = res?.result?.productIcons || [];
          this.thumbnailPreview = res?.result?.thumbnail;
          this.videoThumbnailPreview = res?.result?.videoThumbnail;

          // If settings are already loaded, update the form with localized content
          if (this.settings) {
            this.updateFormWithLocalizedContent();
          }

          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.message);
      },
    });

    this.parentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      brand: new FormControl(''),
      category: new FormControl(null), // Default category
      parentCategories: new FormControl('', Validators.required), //Main category
      thumbnail: new FormControl(null),
      videoThumbnail: new FormControl(null),
      isActive: new FormControl('true'),
      sku: new FormControl('', Validators.required),
      tax: new FormControl(''),
      hsn: new FormControl(''),
      cod: new FormGroup({
        isPresent: new FormControl('false'),
        value: new FormControl(0),
      }),
      shipping: new FormGroup({
        isPresent: new FormControl('false'),
        value: new FormControl(0),
      }),
      return: new FormGroup({
        isPresent: new FormControl('false'),
        value: new FormControl(0),
      }),
      replace: new FormGroup({
        isPresent: new FormControl('false'),
        value: new FormControl(0),
      }),
    });

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormGroup({
        mrp: new FormControl('', [
          Validators.required,
          Validators.pattern('^\\d+(\\.\\d+)?$'),
        ]),
        offer: new FormControl(
          '',
          Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')
        ),
        selling: new FormControl(
          '',
          Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')
        ),
      }),
      slug: new FormControl('', [Validators.required]),
      stock: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\\.\\d+)?$'),
      ]),
      moq: new FormControl(1, [
        Validators.required,
        Validators.pattern('^\\d+(\\.\\d+)?$'),
      ]),
      sku: new FormControl('', Validators.required),
      maxOrderQuantity: new FormControl(1, [
        Validators.required,
        Validators.pattern('^\\d+(\\.\\d+)?$'),
      ]),
      thumbnail: new FormControl(''),
      videoThumbnail: new FormControl(''),
      files: new FormControl(''),
      video: new FormControl(''),
      unit: new FormControl(''),
      productBanner: new FormControl(null),
      boostScore: new FormControl(0, [
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
      ]),
      brand: new FormControl(''),
      origin: new FormControl(''),
      overview: new FormControl(''),
      details: new FormGroup({
        description: new FormControl(''),
        features: new FormControl(''),
        longDescription: new FormControl(''),
      }),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      stockWarning: new FormControl(10),
      searchKeywords: new FormControl(''),
      relatedProducts: new FormControl(''),
      isActive: new FormControl('true'),
      isVisible: new FormControl('true'),
      isCodAvailable: new FormControl('true'),
      codCharges: new FormControl(0),
      deliveryDays: new FormControl(0),
      ean: new FormControl(''),
      mpn: new FormControl(''),
      isCompareEnabled: new FormControl('false'),
    });

    this.categoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });

    this.ProductService.getActiveProduct().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.activeRelatedProducts = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });

    this.taxClassService.getTaxClasses().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.taxClassDetails = res?.result;
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  generateMetaTitle() {
    const name = this.form.get('name')?.value || '';
    const metaTitle = `${name} - ${this.settings.name}`;
    this.form.patchValue({ metaTitle });
  }

  validateMetaDetails(type: 'metaTitle' | 'metaDescription') {
    const metaDoc = this.form.get(type)?.value;
    switch (type) {
      case 'metaTitle':
        if (metaDoc?.length < 50 || metaDoc?.length > 60) {
          return 'It is ideal to keep the meta title between 50 and 60 characters';
        }
        break;
      case 'metaDescription':
        if (metaDoc?.length < 100 || metaDoc?.length > 150) {
          return 'It is ideal to keep the meta description between 100 and 150 characters';
        }
        break;
    }
  }

  updateFormWithLocalizedContent() {
    if (!this.productDetails || !this.settings || !this.settings.primaryLang) {
      console.warn('Cannot update form with localized content, missing data:', {
        hasProductDetails: !!this.productDetails,
        hasSettings: !!this.settings,
        primaryLang: this.settings?.primaryLang
      });
      return;
    }

    const primaryLang = this.settings.primaryLang;

    // Patch the form with the localized content for the current language
    this.form.patchValue({
      name: this.productDetails.localizedNames?.[primaryLang] || this.productDetails.name,
      overview: this.productDetails.localizedOverview?.[primaryLang] || this.productDetails.overview,
      origin: this.productDetails.localizedOrigin?.[primaryLang] || this.productDetails.origin,
      details: {
        description: this.productDetails.localizedDetails?.description?.[primaryLang] ||
          this.productDetails.details?.description,
        features: this.productDetails.localizedDetails?.features?.[primaryLang] ||
          this.productDetails.details?.features,
        longDescription: this.productDetails.localizedDetails?.longDescription?.[primaryLang] ||
          this.productDetails.details?.longDescription,
      },
      metaTitle: this.productDetails.localizedMetaTitles?.[primaryLang] || this.productDetails.metaTitle || '',
      metaDescription: this.productDetails.localizedMetaDescriptions?.[primaryLang] || this.productDetails.metaDescription || '',
      metaKeywords: this.productDetails.localizedMetaKeywords?.[primaryLang] || this.productDetails.metaKeywords || '',
    });

  }

  onSaveStoreField() {
    if (!this.storeFieldForm.valid) {
      this.isStoreSubmitted = true;
      return;
    }

    // Get the form values
    const formValue = this.storeFieldForm.value;

    if (this.storeFieldIndex !== null) {
      formValue.isVisible = formValue.isVisible == 'true' ? true : false;
      this.storeFields[this.storeFieldIndex] = formValue;
      this.storeFieldIndex = null;
    } else {
      // Save the modified form value
      this.storeFields.push(formValue);
    }

    this.storeFieldForm.reset();
    this.storeFieldForm.get('isVisible')?.setValue(true);
    this.isStoreSubmitted = false;
  }

  removeStoreField(storeFieldIndex: number) {
    this.storeFields.splice(storeFieldIndex, 1);
  }

  editStoreField(storeFieldIndex: number) {
    this.storeFieldIndex = storeFieldIndex;
    this.storeFieldForm.patchValue(this.storeFields[storeFieldIndex]);
  }

  removeAttribute(attributeIndex: number) {
    this.HotToastService.info('Attribute removed successfully');
    this.attributes.splice(attributeIndex, 1);
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });
  }

  close() {
    this.modalRef?.hide();
    this.attributeForm.patchValue({ type: 'text', title: '', value: '' });
    this.isAttributeSubmitted = false;
  }

  get attributeControls() {
    return this.attributeForm.controls;
  }

  submitVariant() {
    if (!this.attributeForm.valid) {
      this.isAttributeSubmitted = true;
      return;
    }

    let isExists = this.attributes.some(
      (attribute: any) =>
        attribute.title == this.attributeForm.get('title')?.value
    );
    if (isExists) {
      this.HotToastService.info('Attribute already exists with same title');
      return;
    } else {
      this.HotToastService.success('Attribute added successfully');
      this.attributes.push(this.attributeForm.value);
      this.close();
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.ProductService.deleteProduct(this.productDetails?._id).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.HotToastService.success(res?.message);

            // Get the callback URL from query params
            const callback = this.ActivatedRoute.snapshot.queryParams['callback'];
            if (callback) {
              this.Router.navigate([callback]);
            } else {
              this.Router.navigate(['/app/product']);
            }
          } else {
            this.HotToastService.error(res?.message);
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message);
        },
      });
    } else {
      this.HotToastService.error('Action cancelled')
    }
  }

  handleTagIcons(event: any) {
    const tagPath = event.path;

    if (this.tagIcons.includes(tagPath)) {
      this.tagIcons = this.tagIcons.filter(item => item !== tagPath);
      this.HotToastService.info('Tag removed from product');
    } else {
      this.tagIcons.push(tagPath);
      this.HotToastService.success('Tag added to product');
    }

    // Force change detection
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.markForCheck();
    }
  }

  removeTagIcons(icon: any) {
    this.tagIcons = this.tagIcons.filter(item => item !== icon);
    this.HotToastService.info('Tag removed from product');

    // Force change detection
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.markForCheck();
    }
  }

  logPagination(event: { pageIndex: number; pageSize: number }) {
    this.historyPageIndex = event.pageIndex;
    this.historyPageSize = event.pageSize;

    this.fetchHistory();
  }

  handleAttributeImage(event: any) {
    if (event && event.path) {
      this.attributeForm.patchValue({
        value: event.path,
      });
      this.ChangeDetectorRef.markForCheck();
    }
  }

  removeAttributeImage() {
    this.attributeForm.patchValue({
      value: null,
    });
    this.ChangeDetectorRef.markForCheck();
  }
}
