import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { debounceTime } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BrandService } from 'src/app/includes/services/brand.service';

interface StoreField {
  title: string;
  description: string;
  isFilter: boolean
}

interface AddOnOption {
  product: string;
  description: string;
  price: number;
}

interface AddOns {
  title: string;
  description: string;
  isRequired: boolean;
  addOnType: string;
  options: AddOnOption[]
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
      { class: 'noto-naskh-arabic', name: "Noto Naskh Arabic" },
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
  brandsMap: any = {}

  productCategories: Array<any> = [];
  images: Array<any> = [];
  defaultCategories: Array<any> = [];
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
  addOnsRef?: BsModalRef
  addOnsKeyword: FormControl = new FormControl('', Validators.required)
  addOnSearchResults: Array<any> = []
  addOnProducts: Array<any> = []
  addOnForm: FormGroup = new FormGroup({})
  addOnOptionForm: FormGroup = new FormGroup({})
  addOnTypes: Array<{ key: string, value: string }> = [
    { key: 'Select', value: 'select' },
    { key: 'Radio', value: 'radio' },
    { key: 'Checkbox', value: 'checkbox' },
  ]
  isOptionSubmitted: boolean = false
  addOnOptions: AddOnOption[] = []
  addOns: AddOns[] = []
  isAddOnForm: boolean = false
  isAddOnEditable: boolean = false;
  historyRef?: BsModalRef;
  historyPageIndex: number = 1
  historyPageSize: number = 5
  historyLists: Array<any> = []
  totalResults: number = 0
  totalPages: number = 1

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
    this.addOnsKeyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.searchProducts()
      })
  }

  openHistory(template: TemplateRef<any>) {
    this.historyRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });

    this.fetchHistory()
  }

  onHistoryPageChange(event: { pageIndex: number, pageSize: number }) {
    this.historyPageIndex = event.pageIndex
    this.historyPageSize = event.pageSize
    this.fetchHistory()
  }

  fetchHistory() {
    this.ProductService.getProductHistory(
      this.productDetails._id,
      this.historyPageIndex,
      this.historyPageSize
    ).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.historyLists = res?.result?.results
          this.totalResults = res?.result?.totalResults
          this.totalPages = res?.result?.totalPages
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  closeHistory() {
    this.historyRef?.hide()
  }

  getFormatDate(date: any) {
    return new Date(date).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })
  }

  getFormatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  searchProducts() {
    if (!this.addOnsKeyword.value) {
      this.addOnSearchResults = []
    }

    if (!this.addOnsKeyword.valid) {
      return
    }

    this.ProductService.searchProducts({
      name: this.addOnsKeyword.value,
      page: 1,
      limit: 40
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.addOnSearchResults = res?.result?.data
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => { }
    })
  }

  openAddOns(template: TemplateRef<any>) {
    this.addOnsRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' })
  }

  closeAddOns() {
    this.addOnsRef?.hide()
  }

  get addOnOptionControls() {
    return this.addOnOptionForm.controls
  }

  addAddOnOption() {
    if (!this.addOnOptionForm.valid) {
      this.isOptionSubmitted = true
      return
    }

    this.addOnOptions.push(this.addOnOptionForm.value)
    this.isOptionSubmitted = false
    this.HotToastService.success('Option added successfully')
    this.addOnOptionForm.reset()
    this.addOnOptionForm.patchValue({ product: "", description: "", price: "" })
  }

  removeAddOnOption(index: number) {
    this.HotToastService.error('Option removed successfully')
    this.addOnOptions.splice(index, 1)
  }

  removeAddOn(index: number) {
    this.HotToastService.error('AddOn removed successfully')
    this.addOns.splice(index, 1)
  }

  editAddOn(index: number) {
    this.addOnForm.patchValue(this.addOns[index])
    this.addOnOptions = this.addOns[index].options
    this.isAddOnForm = true
    this.isAddOnEditable = true
  }

  closeAddOnItems() {
    this.addOnForm.reset()
    this.addOnForm.patchValue({
      title: "",
      description: "",
      isRequired: false,
      addOnType: "select"
    })
    this.isAddOnForm = false
    this.addOnOptions = []
    this.addOnOptionForm.reset()
    this.addOnOptionForm.patchValue({
      product: "",
      description: "",
      price: ""
    })
  }

  addAddOnItems() {
    if (!this.addOnForm.valid) {
      return
    }

    const addOn: AddOns = {
      ...this.addOnForm.value,
      options: this.addOnOptions
    }

    this.addOns.push(addOn)
    this.HotToastService.success('AddOn added successfully')
    this.addOnForm.reset()
    this.addOnForm.patchValue({
      title: "",
      description: "",
      isRequired: false,
      addOnType: "select"
    })
    this.isAddOnForm = false
    this.addOnOptions = []
    this.addOnOptionForm.reset()
    this.addOnOptionForm.patchValue({
      product: "",
      description: "",
      price: ""
    })
  }

  toggleAddOnSwitch(event: { switchId: string, toggleState: boolean }) {
    this.addOnForm.get('isRequired')?.setValue(event.toggleState)
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
      error: (err: any) => { }
    });
  }

  handleThumbnail(event: any) {
    this.parentForm.get('thumbnail')?.setValue(event.path);
  }

  productMediaClicked(event: any) {
    let isExists: boolean = this.images.some(
      (item: any) => item.path == event.path
    );
    if (isExists) {
      this.images = this.images.filter((item: any) => item.path != event.path);
    } else {
      this.images.push(event);
    }
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

  toggleProductCategory(event: any, type: string) {
    if (type === 'add') {
      // Handle single or multiple selections from ng-select
      if (Array.isArray(event)) {
        // Multiple categories selected
        this.categories = event;
      } else {
        // Single category selected
        const isExists = this.categories.some(item => item.slug === event.slug);
        if (isExists) {
          this.HotToastService.info('Category already added');
        } else {
          this.categories.push(event);
        }
      }
    } else {
      // Remove category
      this.categories = this.categories.filter(item => item.slug !== event);
    }

    // Update selectedCategories
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
  // toggleProductCategory(categoryEvent: any, type: string) {
  //   if (type == 'add') {
  //     this.defaultCategories.forEach((defaultCategory: any) => {
  //       if (defaultCategory.slug == categoryEvent.target.value) {
  //         let isExists: boolean = this.categories.some((item: any) => item?.slug == defaultCategory.slug);
  //         if (isExists) {
  //           this.HotToastService.info('Category already added')
  //         } else {
  //           this.categories.push(defaultCategory);
  //         }
  //       }
  //     })
  //   } else {
  //     this.categories = this.categories.filter((item: any) => item.slug != categoryEvent);
  //   }

  //   this.productCategory.setValue('');
  // }

  toggleAddOnItems() { }

  saveChanges() {
    this.ChangeDetectorRef.markForCheck();

    if (
      this.productDetails?.price?.offer == this.form.get('price')?.value?.offer
    ) {
    } else {
      this.form.get('price')?.setValue({
        mrp: this.form.get('price')?.value?.mrp,
        offer: this.form.get('price')?.value?.offer,
        selling: this.form.get('price')?.value?.offer,
      });
    }

    if (this.categories && this.categories.length == 0) {
      this.HotToastService.error('Please add at least one category');
      return;
    }

    if (!this.primaryCategory.value) {
      this.HotToastService.error('Please select primary category');
      return;
    }

    if (!this.form.valid) {
      this.isSubmitted = true;
      this.isSaving = false; // Re-enable button if form is invalid
      this.ChangeDetectorRef.markForCheck();
      return;
    }

    // Set flag to disable the button
    this.isSaving = true;

    this.ProductService.updateProduct(this.productDetails.slug, {
      ...this.form.value,
      _id: this.productDetails?._id,
      prodid: this.productDetails?.prodid,
      slug: this.form.get('slug')?.value,
      addOns: this.addOns,
      files: this.images.map((file: any) => file.path),
      relatedProducts: this.relatedProducts ? this.relatedProducts.map((product: any) => product?._id) : [],
      product: {
        id: this.productDetails?.parentId,
        refid: this.productDetails?.product?.refid,
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
      } : null,
      parentId: this.productDetails?.parentId,
      tagIcons: this.tagIcons,
      attributes: this.attributes,
      storeFrontFields: this.storeFields,
      productIcons: this.icons,
      isSkipUpdate: this.isSkipUpdate.value,
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
        }
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
      category: {
        id: this.categories.map((category: any) => category?._id),
        refid: this.categories.map((category: any) => category?.catid),
      },
      categories: this.categories.map((category: any) => ({
        name: category.name,
        slug: category.slug,
        thumbnail: category.thumbnail,
        cover: category.cover,
      })),
      productTags: this.tagsForm.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate(['/app/product']);
          this.siblingsRef?.hide();
          this.HotToastService.success(res?.message);
          // No need to reset isSaving since we're navigating away
        } else if (res.errorCode == 2) {
          // Re-enable the button in this case
          this.isSaving = false;
          this.ChangeDetectorRef.markForCheck();

          this.siblingsRef = this.BsModalService.show(
            this.siblingsTemplateModal,
            {
              class: 'modal-dialog-centered modal-lg',
              ignoreBackdropClick: true,
            }
          );

          this.ProductService.getProducts({
            parentId: this.productDetails.parentId,
            productId: this.productDetails?._id,
          }).subscribe({
            next: (res: any) => {
              if (res?.errorCode == 0) {
                this.siblings = res?.result;
                this.ChangeDetectorRef.markForCheck();
              } else {
                this.HotToastService.error(res?.message);
              }
            },
            error: (err: any) => {
              this.HotToastService.error(err?.message);
            },
          });
        } else {
          // Re-enable the button on error
          this.isSaving = false;
          this.ChangeDetectorRef.markForCheck();
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        // Re-enable the button on error
        this.isSaving = false;
        this.ChangeDetectorRef.markForCheck();
        this.HotToastService.error(err.error.message);
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
    }
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

  handleProductBanner(event: any) {
    this.form.get('productBanner')?.setValue(event.path);
    this.productBannerDetails = event.path
  }

  removeProductBanner() {
    this.form.get('productBanner')?.setValue(null);
    this.productBannerDetails = ''
  }

  get formControls() {
    return this.form.controls;
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

  // ngOnInit(): void {
  //   this.base = environment.base;

  //   this.BrandService.getActiveBrands().subscribe({
  //   next: (res: any) => {
  //     if (res.errorCode == 0) {
  //       this.brands = res.result;        
  //       if (this.productDetails?.brand) {
  //         this.selectedBrand = this.brands.find(brand => brand.slug === this.productDetails.brand.slug);
  //       }

  //       this.ChangeDetectorRef.markForCheck();
  //     }
  //   }, 
  //   error: (err: any) => { }
  // });


  ngOnInit(): void {
    this.base = environment.base;

    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res.errorCode === 0 && Array.isArray(res.result) && res.result.length > 0) {
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
      }
    });

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.languages = res?.result?.languages;
          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (err: any) => { }
    });

    this.addOnOptionForm = new FormGroup({
      product: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      description: new FormControl(''),
    })

    this.addOnForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      isRequired: new FormControl(false),
      addOnType: new FormControl('select'),
      options: new FormControl([]),
    })

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
      isFilter: new FormControl(false)
    });

    this.productSlug = this.ActivatedRoute.snapshot.queryParams.product || '';

    this.ProductService.getProductDetails(this.productSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result);
          // Check if searchKeywords exist and are not empty
          this.searchKeywords = (res?.result?.searchKeywords || []).filter(Boolean);
          this.form.get('searchKeywords')?.setValue(this.searchKeywords);

          this.productDetails = res?.result;
          this.images = res?.result?.files ? res?.result?.files : [];
          // Remove null and undefined values from array of images
          this.images = this.images.map((item) => {
            if (item !== null) {
              return {
                path: item,
              };
            }
          }).filter(Boolean);

          this.primaryCategory.setValue(res?.result?.primaryCategory);

          if (res.result?.brand) {
            this.selectedBrand = this.brands.find(brand => brand.slug === res.result.brand.slug);
            this.form.patchValue({
              brand: res.result.brand.slug
            });
          }

          this.storeFields = res?.result?.storeFrontFields;
          this.tagIcons = res?.result?.tagIcons ? res?.result?.tagIcons : [];
          this.categories = res?.result?.categories;
          this.categories = res?.result?.categories || [];
          this.selectedCategories = this.categories.map(cat => cat.slug);
          this.parentDetails = res?.result?.product?.id;
          this.productBannerDetails = res?.result?.productBanner && res?.result?.productBanner;

          this.form.patchValue({
            productBanner: res?.result?.productBanner?._id,
            brand: res?.result?.brand?.slug,
            name: res.result.localizedNames?.[this.settings.primaryLang] || res.result?.name,
            overview: res.result.localizedOverview?.[this.settings.primaryLang] || res.result?.overview,
            origin: res.result.localizedOrigin?.[this.settings.primaryLang] || res.result?.origin,
            details: {
              description: res.result.localizedDetails?.description?.[this.settings.primaryLang] || res.result?.details?.description,
              features: res.result.localizedDetails?.features?.[this.settings.primaryLang] || res.result?.details?.features,
              longDescription: res.result.localizedDetails?.longDescription?.[this.settings.primaryLang] || res.result?.details?.longDescription,
            },
            metaTitle: res?.result?.localizedMetaTitles?.[this.settings.primaryLang] || res.result?.metaTitle,
            metaDescription: res.result.localizedMetaDescriptions?.[this.settings.primaryLang] || res.result?.metaDescription,
            metaKeywords: res.result.localizedMetaKeywords?.[this.settings.primaryLang] || res.result?.metaKeywords,
          });

          this.attributes = res?.result?.attributes;
          this.relatedProducts = res?.result?.relatedProducts;
          this.icons = res?.result?.productIcons || [];
          this.thumbnailPreview = res?.result?.thumbnail;
          this.ChangeDetectorRef.markForCheck();
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message);
      }
    });

    this.parentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      brand: new FormControl(''),
      category: new FormControl(null), // Default category
      parentCategories: new FormControl('', Validators.required), //Main category
      thumbnail: new FormControl(null),
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
        offer: new FormControl('', Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')),
        selling: new FormControl('', Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')),
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

  onSaveStoreField() {
    if (!this.storeFieldForm.valid) {
      this.isStoreSubmitted = true;
      return;
    }

    this.storeFields.push(this.storeFieldForm.value);
    this.storeFieldForm.reset();
    this.isStoreSubmitted = false;
  }

  removeStoreField(storeFieldIndex: number) {
    this.storeFields.splice(storeFieldIndex, 1);
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
    this.ProductService.deleteProduct(this.productDetails?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate(['/app/product']);
        } else {
          this.HotToastService.error(res?.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
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

  logPagination(event: { pageIndex: number, pageSize: number }) {
    this.historyPageIndex = event.pageIndex
    this.historyPageSize = event.pageSize

    this.fetchHistory()
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
