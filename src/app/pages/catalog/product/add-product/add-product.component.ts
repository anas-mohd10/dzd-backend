import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BrandService } from 'src/app/includes/services/brand.service';

interface StoreField {
  title: string,
  description: string,
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})

export class AddProductComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  searchKeyowrds: any = [];
  tumbnail: any
  attributes: any = []
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
      { class: 'manrope', name: 'Manrope' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ]
  };
  settings: any = {}
  parentForm: FormGroup;
  taxClassDetails: Array<any> = [];
  brand: FormControl = new FormControl('', Validators.required)
  brands: Array<any> = [];
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
  productCategory: FormControl = new FormControl('');
  productAttributes: Array<any> = [];
  isCategoryMultiple: boolean = true;
  isBrandMultiple: boolean = false;
  isProductMultiple: boolean = true;
  tagsForm: FormGroup;
  icons: Array<any> = [];
  productTags: any = {
    topRightTag: "",
    topLeftTag: "",
    bottomRightTag: "",
    bottomLeftTag: "",
  }
  addOnItemsForm: FormGroup
  addOnItems: Array<any> = [];
  parentCategories: Array<any> = []
  mainCategories: Array<any> = []
  existingProducts: Array<any> = []
  isParentSubmitted: boolean = false
  activeRelatedProducts: Array<any> = []
  relatedProduct: FormControl = new FormControl('')

  storeFields: Array<StoreField> = []
  storeFieldForm: FormGroup = new FormGroup({})
  isStoreSubmitted: boolean = false

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
    private AppSettingsService: AppSettingsService
  ) { }

  get parentControls() {
    return this.parentForm.controls
  }

  get storeFieldControls() {
    return this.storeFieldForm.controls
  }

  onProductsTriggered(productId?: any) {
    let productDetails: any = null
    if (productId) {
      productDetails = productId
    } else {
      let productRef = this.activeRelatedProducts.filter((item: any) => item._id == this.relatedProduct.value)
      productDetails = productRef[0]
    }
    const isIdPresent: boolean = this.relatedProducts.some(product => product._id == productDetails?._id);
    if (isIdPresent) {
      this.HotToastService.error('Product removed from list')
      this.relatedProducts = this.relatedProducts.filter((item: any) => item._id != productDetails?._id)
    } else {
      this.relatedProducts.push(productDetails)
      this.HotToastService.success('Product added to list')
    }
    this.relatedProduct.setValue('')
    this.parentForm.get('relatedProducts')?.setValue(this.relatedProducts)
  }

  onTagsTriggered(event: any, type: string, method: string) {
    switch (type) {
      case 'topright':
        if (method == 'add') {
          this.tagsForm.get('topRightTag')?.setValue(event._id)
          this.productTags.topRightTag = event.path
        } else {
          this.tagsForm.get('topRightTag')?.setValue(null)
          this.productTags.topRightTag = ''
        }
        break
      case 'topleft':
        if (method == 'add') {
          this.tagsForm.get('topLeftTag')?.setValue(event._id)
          this.productTags.topLeftTag = event.path
        } else {
          this.tagsForm.get('topLeftTag')?.setValue(null)
          this.productTags.topLeftTag = ''
        }
        break
      case 'bottomright':
        if (method == 'add') {
          this.tagsForm.get('bottomRightTag')?.setValue(event._id)
          this.productTags.bottomRightTag = event.path
        } else {
          this.tagsForm.get('bottomRightTag')?.setValue(null)
          this.productTags.bottomRightTag = ''
        }
        break
      case 'bottomleft':
        if (method == 'add') {
          this.tagsForm.get('bottomLeftTag')?.setValue(event._id)
          this.productTags.bottomLeftTag = event.path
        } else {
          this.tagsForm.get('bottomLeftTag')?.setValue(null)
          this.productTags.bottomLeftTag = ''
        }
        break
    }
  }

  getChildCategory(categories: Array<any>) {
    this.CategoryService.childCategories({ categories: categories }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  handleThumbnail(event: any) {
    this.parentForm.get('thumbnail')?.setValue(event._id)
    this.previewDetails = event.path
  }

  removeThumbnail() {
    this.previewDetails = null
    this.parentForm.get('thumbnail')?.setValue(null)
  }

  productMediaClicked(event: any) {
    let isExists: boolean = this.images.some((item: any) => item._id == event._id)
    if (isExists) {
      this.images = this.images.filter((item: any) => item._id != event._id)
    } else {
      this.images.push(event)
    }
  }

  productIconClicked(event: any) {
    let isExists: boolean = this.icons.some((item: any) => item._id == event._id)
    if (isExists) {
      this.icons = this.icons.filter((item: any) => item._id != event._id)
    } else {
      this.icons.push(event)
    }
  }

  removeProductMedia(image: any) {
    this.images = this.images.filter((item: any) => item._id != image._id)
  }

  productThumbnailClicked(event: any) {
    this.form.get('thumbnail')?.setValue(event._id)
  }

  toggleProductCategory(event: any, type: string) {
    if (type == 'add') {
      let categoryDetails = this.defaultCategories.filter((item: any) => item._id == event.target.value)
      this.categories.includes(categoryDetails[0]) ? this.HotToastService.info('Category already added') : this.categories.push(categoryDetails[0])
    } else {
      this.categories = this.categories.filter((item: any) => item?._id != event)
    }
    this.productCategory.setValue('')
  }

  removeProductCategory(categoryId: string) {
    this.categories = this.categories.filter((item: any) => item?._id != categoryId)
  }

  addCategory() {
    let isExists = this.parentCategories.some((category: any) => category._id == this.parentForm.get('category')?.value)
    if (isExists) {
      this.parentCategories = this.parentCategories.filter((category: any) => category._id != this.parentForm.get('category')?.value)
      this.HotToastService.error('Category removed from list')
    } else {
      let categoryDetails = this.mainCategories.filter((category: any) => category._id == this.parentForm.get('category')?.value)
      this.parentCategories.push(categoryDetails[0])
      let categories = this.parentCategories.map((category: any) => category._id)
      this.getChildCategory(categories)
      this.HotToastService.success('Category added to list')
    }
    this.parentForm.get('category')?.setValue('')
    if (this.parentCategories.length > 0) {
      let parentCategory = {
        id: this.parentCategories.map((category: any) => { return category._id }),
        refid: this.parentCategories.map((category: any) => { return category.catid })
      }
      this.parentForm.get('parentCategory')?.setValue(parentCategory)
    }
  }

  removeCategory(categoryId: string) {
    this.parentCategories = this.parentCategories.filter((category: any) => category._id != categoryId)
    let categories = this.parentCategories.map((category: any) => category._id)
    this.HotToastService.error('Category removed from list')
    this.getChildCategory(categories)
    if (this.parentCategories.length > 0) {
      let parentCategory = {
        id: this.parentCategories.map((category: any) => { return category._id }),
        refid: this.parentCategories.map((category: any) => { return category.catid })
      }
      this.parentForm.get('parentCategory')?.setValue(parentCategory)
    } else {
      this.parentForm.get('parentCategory')?.setValue("")
    }
  }

  getParentDetails(productSlug: string) {
    this.ProductHeadService.parentDetails(productSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.parentDetails = res?.result
          this.getProducts()
          this.parentForm.patchValue(res.result)
          this.brandDetails = res?.result?.brand
          this.previewDetails = res?.result?.thumbnail?.path
          this.parentCategories = res?.result?.parentCategory.id
          let categories = this.parentCategories.map((item: any) => item?._id)
          this.getChildCategory(categories)
          res?.result?.defaultCategory ? this.getAttributes(res?.result?.defaultCategory?.id?._id) : null
          res?.result?.brand ? this.parentForm.get('brand')?.setValue(res?.result?.brand?._id) : this.parentForm.get('brand')?.setValue('')
          res?.result?.defaultCategory ? this.parentForm.get('defaultCategory')?.setValue(res?.result?.defaultCategory?.id?._id) : this.parentForm.get('defaultCategory')?.setValue('')
          this.parentForm.get('tax')?.setValue(res?.result?.tax?._id)
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  getAttributes(category: string) {
    this.AttributeService.getAttributes(category).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.attributes = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {

      }
    })
  }

  toggleAddOnItems() {

  }

  saveChanges() {
    let files = this.images.map((item: any) => item._id) || []
    this.form.get('files')?.setValue(files)

    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    let payload = {
      ...this.form.value,
      icons: this.icons.map((icon: any) => icon._id),
      productTags: this.tagsForm.value,
      relatedProducts: this.relatedProducts ? this.relatedProducts.map((product: any) => product._id) : [],
      product: { id: this.parentDetails?._id, refid: this.parentDetails?.prodid },
      attributes: this.productAttributes,
      productIcons: this.icons.map((icon: any) => icon._id),
      storeFrontFields: this.storeFields,
      category: {
        id: this.categories.map((category: any) => category?._id),
        refid: this.categories.map((category: any) => category?.catid),
      }
    }

    this.ProductService.addProduct(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate(['/app/product'])
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  toggleTab(index: number) {
    if (this.staticTabs?.tabs[index]) {
      this.staticTabs.tabs[index].active = true;
    }
  }

  createParent() {
    if (this.parentCategories.length > 0) {
      let parentCategory = {
        id: this.parentCategories.map((category: any) => { return category._id }),
        refid: this.parentCategories.map((category: any) => { return category.catid })
      }
      this.parentForm.get('parentCategory')?.setValue(parentCategory)
    }

    if (this.parentForm.get('defaultCategory')?.value) {
      let defaultCategory = {
        id: this.parentForm.get('defaultCategory')?.value,
        refid: this.defaultCategories.filter((category: any) => category._id == this.parentForm.get('defaultCategory')?.value)[0]?.catid
      }
      this.parentForm.get('defaultCategory')?.setValue(defaultCategory)
    }


    if (!this.parentForm.valid) {
      this.isParentSubmitted = true
      return
    }

    this.parentForm.get('brand')?.value ? null : this.parentForm.get('brand')?.setValue(null)
    this.parentForm.get('defaultCategory')?.value ? null : this.parentForm.get('defaultCategory')?.setValue(null)

    this.ProductHeadService.addProductHead(this.parentForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.getParentDetails(res?.result?.slug)
          this.Router.navigate([appRoutes.product.ADD_PRODUCT], { queryParams: { product: res?.result?.slug } })
          this.form.get('name')?.setValue(this.parentForm.value.name)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  toggleSearchKeywords(event: any, type: string) {
    if (type == 'add') {
      if (this.searchKeywords.includes(event.target.value)) {
        this.HotToastService.info('Keyword already added')
      } else {
        this.searchKeywords.push(event.target.value)
        this.searchKeyword?.setValue('')
      }
      this.form.get('searchKeywords')?.setValue(this.searchKeywords)
    } else {
      this.searchKeywords = this.searchKeywords.filter((item: any) => item != event)
    }
  }

  toggleAttributes(attributeDetails: any, valueDetails: any) {
    const isIdPresent = this.productAttributes.some(attribute => attribute.type == attributeDetails.id);
    if (isIdPresent) {
      const index = this.productAttributes.findIndex(attribute => attribute.type == attributeDetails.id);
      this.productAttributes[index].value = valueDetails._id
    } else {
      this.productAttributes.push({
        type: attributeDetails._id,
        value: valueDetails._id
      })
    }
  }

  attributeExists(attributeDetails: any, valueDetails: any) {
    const isIdPresent = this.productAttributes.some(attribute => attribute.type == attributeDetails._id && attribute.value == valueDetails._id);
    return isIdPresent ? 'active' : null
  }

  searchProducts() {

  }

  get formControls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.base = environment.base

    this.storeFieldForm = new FormGroup({
      title: new FormControl('  ', Validators.required),
      description: new FormControl('  ', Validators.required)
    })

    this.tagsForm = new FormGroup({
      topRightTag: new FormControl(null),
      topLeftTag: new FormControl(null),
      bottomRightTag: new FormControl(null),
      bottomLeftTag: new FormControl(null)
    })

    this.slug = this.ActivatedRoute.snapshot.queryParams.product || ''
    if (this.slug) {
      this.getParentDetails(this.slug)
    }

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.parentForm = new FormGroup({
      name: new FormControl("", Validators.required),
      brand: new FormControl(""),
      defaultCategory: new FormControl(null), // Default category
      parentCategory: new FormControl("", Validators.required), //Main category
      category: new FormControl(""),
      thumbnail: new FormControl(null, Validators.required),
      isActive: new FormControl(true),
      sku: new FormControl("", Validators.required),
      tax: new FormControl(""),
      hsn: new FormControl(""),
      cod: new FormGroup({ isPresent: new FormControl(true), value: new FormControl(0, Validators.pattern('^[0-9]+$')) }),
      shipping: new FormGroup({ isPresent: new FormControl(false), value: new FormControl(0, Validators.pattern('^[0-9]+$')) }),
      return: new FormGroup({ isPresent: new FormControl(false), value: new FormControl(0, Validators.pattern('^[0-9]+$')) }),
      replace: new FormGroup({ isPresent: new FormControl(false), value: new FormControl(0, Validators.pattern('^[0-9]+$')) }),
    })

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      price: new FormGroup({
        mrp: new FormControl("", [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]),
        offer: new FormControl("", Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')),
        selling: new FormControl("", Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'))
      }),
      stock: new FormControl("", [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]),
      moq: new FormControl(1, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]),
      sku: new FormControl("", Validators.required),
      maxOrderQuantity: new FormControl(1, [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]),
      thumbnail: new FormControl("", Validators.required),
      files: new FormControl("", Validators.required),
      video: new FormControl(""),
      unit: new FormControl(""),
      origin: new FormControl(""),
      overview: new FormControl(""),
      details: new FormGroup({
        additionalButton: new FormControl(""),
        buttonRedirectUrl: new FormControl(""),
        description: new FormControl(""),
        features: new FormControl(""),
        longDescription: new FormControl("")
      }),
      metaTitle: new FormControl(""),
      metaDescription: new FormControl(""),
      metaKeywords: new FormControl(""),
      stockWarning: new FormControl(10),
      searchKeywords: new FormControl(""),
      relatedProducts: new FormControl(""),
      isActive: new FormControl(true),
      isVisible: new FormControl(true),
    })

    this.CategoryService.getMainCategories().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.mainCategories = res?.result
          this.ChangeDetectorRef.markForCheck();
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })

    //Get brands
    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
    //Get brands

    //Get active products
    this.ProductService.getActiveProduct().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.activeRelatedProducts = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })
    //Get active products

    //Tax class details
    this.taxClassService.getTaxClasses().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.taxClassDetails = res?.result;
          this.parentForm.get('tax')?.setValue(this.taxClassDetails[0]?._id)
        } else {

        }
      }, error: (err: any) => {

      }
    });
    //Tax class details
  }

  //Get child products for corresponding parentId
  getProducts() {
    this.ProductService.getProducts({ parentId: this.parentDetails?._id }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.existingProducts = res?.result
          if (this.existingProducts.length > 0) {
            this.form.get('isVisible')?.setValue(false)
          }
          let latestProducts = this.existingProducts.pop()
          this.form.get('name')?.setValue(latestProducts?.name)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }
  //Get child products for corresponding parentId

  //Store fields
  onSaveStoreField() {
    if (!this.storeFieldForm.valid) {
      this.isStoreSubmitted = true
      return
    }

    this.storeFields.push(this.storeFieldForm.value)
    this.storeFieldForm.reset()
    this.isStoreSubmitted = false
  }

  removeStoreField(storeFieldIndex: number) {
    this.storeFields.splice(storeFieldIndex, 1)
  }
  //Store fields
}