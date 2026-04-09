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
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { environment } from 'src/environments/environment';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BrandService } from 'src/app/includes/services/brand.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { debounceTime } from 'rxjs/operators';

interface StoreField {
  title: string;
  description: string;
  isVisible: boolean;
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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  task = PageTasks.ADD;
  isSaving: boolean = false;
  editMode = false;
  appRoute = appRoutes;
  isCreatingParent = false;
  isSubmitted = false;
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
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ],
  };
  settings: any = {};
  parentForm: FormGroup;
  taxClassDetails: Array<any> = [];

  brand: FormControl = new FormControl('', Validators.required);
  brands: Array<any> = [];
  selectedBrand: any = null;
  brandsMap: any = {};

  productCategories: Array<any> = [];
  images: Array<any> = [];
  attributeImages: Array<any> = [];
  form: FormGroup;
  parentDetails: any;
  parentSlug: string;
  brandDetails: any;
  previewDetails: any;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  searchKeywords: Array<any> = [];
  searchKeyword: FormControl = new FormControl('');
  relatedProducts: Array<any> = [];

  categories: Array<any> = [];
  selectedCategories: Array<string> = [];
  defaultCategories: Array<any> = [];
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
  addOnItems: Array<any> = [];
  parentCategories: Array<any> = [];
  mainCategories: Array<any> = [];
  existingProducts: Array<any> = [];
  isParentSubmitted: boolean = false;
  activeRelatedProducts: Array<any> = [];
  relatedProduct: FormControl = new FormControl('');
  storeFields: Array<StoreField> = [];
  storeFieldForm: FormGroup = new FormGroup({});
  isStoreSubmitted: boolean = false;
  modalRef?: BsModalRef;
  attributeForm: FormGroup = new FormGroup({});
  isAttributeSubmitted: boolean = false;
  attributeTypes: Array<any> = [
    { title: 'Text', value: 'text' },
    { title: 'Color', value: 'color' },
    { title: 'Image', value: 'image' },
  ];
  languages: Array<string> = [];
  tagIcons: Array<string> = [];
  specificationImages: Array<string> = [];
  storeFieldIndex: number | null;

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

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private BrandService: BrandService,
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductHeadService: ProductHeadService,
    private AttributeService: AttributeService,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService
  ) {
    this.addOnsKeyword.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.searchProducts();
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
      this.addOnOptionForm.patchValue({ discountAmount: 0, price: this.addOnDoc?.price.selling })
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
    if (!this.addOnOptionForm.valid) {
      this.isOptionSubmitted = true;
      this.HotToastService.error('Please fill all the fields');
      return;
    }

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
    if (!this.addOnForm.valid) {
      this.isItemSubmitted = true;
      this.HotToastService.error('Please fill all the fields');
      return;
    }

    if (this.addOnOptions.length == 0) {
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
      this.addOnForm.patchValue({ ...this.addOns[index] })
      this.addOnOptions = this.addOns[index].options;
      this.isEditAddOn = true;
      this.editAddOnIndex = index;
    }
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

  get parentControls() {
    return this.parentForm.controls;
  }

  get storeFieldControls() {
    return this.storeFieldForm.controls;
  }

  onBrandChange(event: any) {
    if (event) {
      this.selectedBrand = event;
      this.form.patchValue({
        brand: event.slug
      });
    } else {
      this.selectedBrand = null;
      this.form.patchValue({
        brand: null
      });
    }
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
          this.tagsForm.get('topRightTag')?.setValue(event.path);
          this.productTags.topRightTag = event.path;
        } else {
          this.tagsForm.get('topRightTag')?.setValue(null);
          this.productTags.topRightTag = '';
        }
        break;
      case 'topleft':
        if (method == 'add') {
          this.tagsForm.get('topLeftTag')?.setValue(event.path);
          this.productTags.topLeftTag = event.path;
        } else {
          this.tagsForm.get('topLeftTag')?.setValue(null);
          this.productTags.topLeftTag = '';
        }
        break;
      case 'bottomright':
        if (method == 'add') {
          this.tagsForm.get('bottomRightTag')?.setValue(event.path);
          this.productTags.bottomRightTag = event.path;
        } else {
          this.tagsForm.get('bottomRightTag')?.setValue(null);
          this.productTags.bottomRightTag = '';
        }
        break;
      case 'bottomleft':
        if (method == 'add') {
          this.tagsForm.get('bottomLeftTag')?.setValue(event.path);
          this.productTags.bottomLeftTag = event.path;
        } else {
          this.tagsForm.get('bottomLeftTag')?.setValue(null);
          this.productTags.bottomLeftTag = '';
        }
        break;
    }
  }

  getChildCategory() {
    this.CategoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
    });
  }

  handleThumbnail(event: any) {
    this.parentForm.get('thumbnail')?.setValue(event.path);
    this.previewDetails = event.path;
  }

  removeThumbnail() {
    this.previewDetails = null;
    this.parentForm.get('thumbnail')?.setValue(null);
  }

  productMediaClicked(event: any) {

    // Check if the item already exists in our images array
    let isExists: boolean = this.images.some(
      (item: any) => item?._id == event?._id
    );

    if (isExists) {
      // If it exists, remove it
      this.images = this.images.filter((item: any) => item?._id != event?._id);
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
  dropProductImages(event: any) {
    let items = [...this.images];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.images = [...items];
  }
  productIconClicked(event: any, type: string = 'add') {
    let isExists: boolean = this.icons.some((item: any) => item == (type == 'remove' ? event : event.path));
    if (isExists) {
      const index = this.icons.findIndex((item: any) => item == (type == 'remove' ? event : event.path));
      if (index !== -1) {
        this.icons.splice(index, 1);
      }
    } else {
      this.icons.push(event.path);
    }
  }

  removeProductMedia(image: any) {
    this.images = this.images.filter((item: any) => item?._id != image?._id);
  }

  productThumbnailClicked(event: any) {
    this.form.get('thumbnail')?.setValue(event.path);
  }
  productVideoThumbnailClicked(event: any) {
    this.form.get('videoThumbnail')?.setValue(event.path);
  }

  toggleProductCategory(event: any, type: string) {
    if (type === 'add') {
      if (Array.isArray(event)) {
        this.categories = event;
      } else {
        const isExists = this.categories.some(item => item.slug === event.slug);
        if (isExists) {
          this.HotToastService.info('Category already added');
        } else {
          this.categories.push(event);
        }
      }
    } else {
      this.categories = this.categories.filter(item => item.slug !== event);
    }

    this.selectedCategories = this.categories.map(cat => cat.slug);

    // Update form value if needed
    if (this.form) {
      this.form.patchValue({
        category: {
          id: this.categories.map(cat => cat._id),
          refid: this.categories.map(cat => cat.catid)
        }
      });
    }
  }

  getDefaultCategories() {
    this.CategoryService.getActiveCategory().subscribe({  // Note the capital C in CategoryService
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => { }
    });
  }

  removeProductCategory(categoryId: string) {
    this.categories = this.categories.filter(
      (item: any) => item?.slug != categoryId
    );
  }

  addCategory() {
    let isExists = this.parentCategories.some(
      (category: any) => category?._id == this.parentForm.get('category')?.value
    );
    if (isExists) {
      this.parentCategories = this.parentCategories.filter(
        (category: any) =>
          category?._id != this.parentForm.get('category')?.value
      );
      this.HotToastService.error('Category removed from list');
    } else {
      let categoryDetails = this.mainCategories.filter(
        (category: any) =>
          category?._id == this.parentForm.get('category')?.value
      );
      this.parentCategories.push(categoryDetails[0]);
      let categories = this.parentCategories.map(
        (category: any) => category?._id
      );
      this.getChildCategory();
      this.HotToastService.success('Category added to list');
    }
    this.parentForm.get('category')?.setValue('');
    if (this.parentCategories.length > 0) {
      let parentCategory = {
        id: this.parentCategories.map((category: any) => {
          return category?._id;
        }),
        refid: this.parentCategories.map((category: any) => {
          return category.catid;
        }),
      };
      this.parentForm.get('parentCategory')?.setValue(parentCategory);
    }
  }

  removeCategory(categoryId: string) {
    this.parentCategories = this.parentCategories.filter(
      (category: any) => category?._id != categoryId
    );
    let categories = this.parentCategories.map(
      (category: any) => category?._id
    );
    this.HotToastService.error('Category removed from list');
    this.getChildCategory();
    if (this.parentCategories.length > 0) {
      let parentCategory = {
        id: this.parentCategories.map((category: any) => {
          return category?._id;
        }),
        refid: this.parentCategories.map((category: any) => {
          return category.catid;
        }),
      };
      this.parentForm.get('parentCategory')?.setValue(parentCategory);
    } else {
      this.parentForm.get('parentCategory')?.setValue('');
    }
  }

  getParentDetails(productSlug: string) {
    this.ProductHeadService.parentDetails(productSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.parentDetails = res?.result;
          this.getProducts();
          this.parentForm.patchValue(res.result);
          this.brandDetails = res?.result?.brand;
          this.previewDetails = res?.result?.thumbnail;
          this.parentCategories = res?.result?.parentCategory.id;
          let categories = this.parentCategories.map((item: any) => item?._id);
          this.getChildCategory();
          res?.result?.brand
            ? this.parentForm.get('brand')?.setValue(res?.result?.brand?._id)
            : this.parentForm.get('brand')?.setValue('');
          res?.result?.defaultCategory
            ? this.parentForm
              .get('defaultCategory')
              ?.setValue(res?.result?.defaultCategory?.id?._id)
            : this.parentForm.get('defaultCategory')?.setValue('');
          this.parentForm.get('tax')?.setValue(res?.result?.tax?._id);
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  toggleAddOnItems() { }

  saveChanges() {
    // Force change detection immediately
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.detectChanges(); // Use detectChanges instead of markForCheck
    }

    let files = this.images.map((item: any) => item.path) || [];
    this.form.get('files')?.setValue(files);

    if (this.categories && this.categories.length == 0) {
      this.HotToastService.error('Please add at least one category');
      return;
    }

    if (!this.form.valid) {
      this.isSubmitted = true;
      this.isSaving = false; // Re-enable button if form is invalid

      if (this.ChangeDetectorRef) {
        this.ChangeDetectorRef.detectChanges();
      }
      return;
    }

    // First set flag to disable the button
    this.isSaving = true;

    this.addOns.forEach((addOn: any) => {
      addOn.options = addOn.options.map((option: any) => ({
        ...option,
        product: option.product?._id,
      }));

      addOn.options.forEach((option: any) => {
        if (option._id) {
          return option
        } else {
          // Remove the _id from the option object
          delete option._id
          return option
        }
      });

      if (addOn._id) {
        return addOn
      } else {
        // Remove the _id from the addOn object
        delete addOn._id
        return addOn
      }
    });

    let payload = {
      ...this.form.value,
      icons: this.icons.map((icon: any) => icon.path),
      addOns: this.addOns,
      productTags: this.tagsForm.value,
      relatedProducts: this.relatedProducts ? this.relatedProducts.map((product: any) => product?._id) : [],
      product: { id: this.parentDetails?._id, refid: this.parentDetails?._id },
      attributes: this.attributes,
      tagIcons: this.tagIcons,
      specificationImages: this.specificationImages,
      localizedNames: {
        [this.settings.primaryLang]: this.form.get('name')?.value,
      },
      brand: this.selectedBrand ? {
        name: this.selectedBrand.name,
        slug: this.selectedBrand.slug,
        thumbnail: this.selectedBrand.thumbnail,
        cover: this.selectedBrand.cover,
      } : null,
      primaryCategory: this.primaryCategory.value ? {
        name: this.primaryCategory.value.name,
        slug: this.primaryCategory.value.slug,
        thumbnail: this.primaryCategory.value.thumbnail,
        cover: this.primaryCategory.value.cover,
        hierarchies: this.primaryCategory.value.hierarchies,
      } : null,
      parentId: this.parentDetails?._id,
      productIcons: this.icons,
      storeFrontFields: this.storeFields,
      categories: this.categories.map((category: any) => ({
        name: category.name,
        slug: category.slug,
        thumbnail: category.thumbnail,
        hierarchies: category.hierarchies,
        cover: category.cover,
      })),
      category: {
        id: this.categories.map((category: any) => category?._id),
        refid: this.categories.map((category: any) => category?.catid),
      },
    };

    // Use a timeout to ensure the UI has time to update before starting API call
    setTimeout(() => {
      this.ProductService.addProduct(payload).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Router.navigate(['/app/product']);
            this.HotToastService.success(res?.message);
            // We don't need to reset isSaving here since we're navigating away
          } else {
            this.isSaving = false; // Re-enable button on error response
            if (this.ChangeDetectorRef) {
              this.ChangeDetectorRef.detectChanges();
            }
            this.HotToastService.error(res?.message);
          }
        },
        error: (err: any) => {
          this.isSaving = false; // Re-enable button on error
          if (this.ChangeDetectorRef) {
            this.ChangeDetectorRef.detectChanges();
          }
          this.HotToastService.error(err.error.message);
        },
      });
    }, 0);
  }

  toggleTab(index: number) {
    if (this.staticTabs?.tabs[index]) {
      this.staticTabs.tabs[index].active = true;
    }
  }

  createParent() {
    // Set flag to disable the button
    this.isSaving = true;
    this.ChangeDetectorRef.markForCheck();

    if (!this.parentForm.valid) {
      this.isParentSubmitted = true;
      this.isSaving = false; // Re-enable button if form is invalid
      this.ChangeDetectorRef.markForCheck();
      return;
    }

    this.ProductHeadService.addProductHead(this.parentForm.value).subscribe({
      next: (res: any) => {
        this.isSaving = false; // Re-enable button
        this.ChangeDetectorRef.markForCheck();

        if (res?.errorCode == 0) {
          this.HotToastService.success(res.message);
          this.getParentDetails(res?.result?.slug);
          this.Router.navigate(
            [appRoutes.product.ADD_PRODUCT],
            { queryParams: { product: res?.result?.slug } }
          );
          this.form.get('name')?.setValue(this.parentForm.value.name);
        } else {
          this.HotToastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.isSaving = false; // Re-enable button on error
        this.ChangeDetectorRef.markForCheck();
        this.HotToastService.error(err.error.message);
      },
    });
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
      this.searchKeywords = this.searchKeywords.filter(
        (item: any) => item != event
      );
      this.form.get('searchKeywords')?.setValue(this.searchKeywords);
    }
  }

  get formControls() {
    return this.form.controls;
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
        if (metaDoc.length < 50 || metaDoc.length > 60) {
          return 'It is ideal to keep the meta title between 50 and 60 characters';
        }
        break;
      case 'metaDescription':
        if (metaDoc.length < 100 || metaDoc.length > 150) {
          return 'It is ideal to keep the meta description between 100 and 150 characters';
        }
        break;
    }
  }

  ngOnInit(): void {
    this.base = environment.base;

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

    this.storeFieldForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isVisible: new FormControl(true),
    });

    this.tagsForm = new FormGroup({
      topRightTag: new FormControl(null),
      topLeftTag: new FormControl(null),
      bottomRightTag: new FormControl(null),
      bottomLeftTag: new FormControl(null),
    });

    this.slug = this.ActivatedRoute.snapshot.queryParams.product || '';
    if (this.slug) {
      this.getParentDetails(this.slug);
    }

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    );

    this.parentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      sku: new FormControl('', Validators.required),
      tax: new FormControl(''),
      hsn: new FormControl(''),
      cod: new FormGroup({
        isPresent: new FormControl(true),
        value: new FormControl(0, Validators.pattern('^[0-9]+$')),
      }),
      shipping: new FormGroup({
        isPresent: new FormControl(false),
        value: new FormControl(0, Validators.pattern('^[0-9]+$')),
      }),
      return: new FormGroup({
        isPresent: new FormControl(false),
        value: new FormControl(0, Validators.pattern('^[0-9]+$')),
      }),
      replace: new FormGroup({
        isPresent: new FormControl(false),
        value: new FormControl(0, Validators.pattern('^[0-9]+$')),
      }),
    });

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormGroup({
        mrp: new FormControl('', [
          Validators.required,
          Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
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
      slug: new FormControl('', Validators.required),
      stock: new FormControl('', [
        Validators.required,
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
      ]),
      moq: new FormControl(1, [
        Validators.required,
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
      ]),
      sku: new FormControl('', Validators.required),
      maxOrderQuantity: new FormControl(1, [
        Validators.required,
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
      ]),
      thumbnail: new FormControl('', Validators.required),
      videoThumbnail: new FormControl(null),
      files: new FormControl('', Validators.required),
      video: new FormControl(''),
      unit: new FormControl(''),
      origin: new FormControl(''),
      overview: new FormControl(''),
      boostScore: new FormControl(0, [
        Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
      ]),
      brand: new FormControl(''),
      category: new FormControl(''),
      details: new FormGroup({
        additionalButton: new FormControl(''),
        buttonRedirectUrl: new FormControl(''),
        description: new FormControl(''),
        features: new FormControl(''),
        longDescription: new FormControl(''),
        productDescription: new FormControl(''),
      }),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      stockWarning: new FormControl(10),
      searchKeywords: new FormControl([]),
      relatedProducts: new FormControl(''),
      isActive: new FormControl(true),
      isVisible: new FormControl(true),
      isCodAvailable: new FormControl('true'),
      codCharges: new FormControl(0),
      ean: new FormControl(''),
      mpn: new FormControl(''),
      weight: new FormControl(''),
      cubicVolume: new FormControl(''),
    });

    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.brands = res.result;
          // Remove productDetails reference since this is an add component
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => { }
    });

    this.getDefaultCategories();


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

    this.getChildCategory();

    this.taxClassService.getTaxClasses().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.taxClassDetails = res?.result;
          this.parentForm.get('tax')?.setValue(this.taxClassDetails[0]?._id);
        } else {
        }
      },
      error: (err: any) => { },
    });

    this.generateSlug();
  }

  autoGenerateSlug() {
    this.generateSlug();
  }

  generateSlug() {
    const name = this.form.get('name')?.value || ''; // Get the form value for 'name'
    const slug = name
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters (optional)
      .trim() // Remove any extra spaces at the start and end
      .replace(/\s+/g, '-'); // Replace spaces with '-'
    this.form.patchValue({ slug });
  }

  getProducts() {
    this.ProductService.getProducts({
      parentId: this.parentDetails?._id,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.existingProducts = res?.result;
          if (this.existingProducts.length > 0) {
            this.form.get('isVisible')?.setValue(false);
          }
          let latestProducts = this.existingProducts.pop();
          this.form.get('name')?.setValue(latestProducts?.name);
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err?.error?.message);
      },
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

  handleTagIcons(event: any) {
    if (this.tagIcons.includes(event)) {
      this.tagIcons = this.tagIcons.filter((item: any) => item != event.path);
    } else {
      this.tagIcons.push(event.path);
    }
  }

  removeTagIcons(icon: any) {
    this.tagIcons = this.tagIcons.filter((item: any) => item != icon);
  }
  handleSpecificationIcon(event: any) {
    const tagPath = event.path;
    
    if (this.specificationImages.includes(tagPath)) {
      this.specificationImages = this.specificationImages.filter(item => item !== tagPath);
      this.HotToastService.info('Specification image removed from product');
    } else {
      this.specificationImages.push(tagPath);
      this.HotToastService.success('Specification image added to product');
    }
    
    // Force change detection
    if (this.ChangeDetectorRef) {
      this.ChangeDetectorRef.markForCheck();
    }
  }

  removeSpecificationIcon(icon: any) {
    this.specificationImages = this.specificationImages.filter((item: any) => item != icon);
  }
  handleAttributeImage(event: any) {
    console.log('Image event:', event);
    if (event && event.path) {
      this.attributeForm.patchValue({
        value: event.path
      });
      this.ChangeDetectorRef.markForCheck();
    }
  }

  removeAttributeImage() {
    this.attributeForm.patchValue({
      value: null
    });
    this.ChangeDetectorRef.markForCheck();
  }
}
