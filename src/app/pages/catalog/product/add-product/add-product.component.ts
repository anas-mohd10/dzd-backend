import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})

export class AddProductComponent implements OnInit {
  productform: FormGroup;
  productheadform: FormGroup
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;

  filedata: File;
  fileThumbnaildata: File
  filebasicdata: File;
  type: any;
  isSingle: boolean = true;

  brandData: any;
  categoryData: any;
  taxClassData: any;
  productsData: any;

  searchKeyowrds: any = [];
  categoryNames: any = [];
  categoryid: any = [];

  returnValue: any;
  isReturn: boolean = false;
  isShipping: boolean = false;
  isCod: boolean = false;
  method: any;
  cod: any;

  relProductNames: any = [];
  relProductIds: any = [];

  croppedImage: string | null | undefined;
  thumbnailImage: string | null | undefined;
  basicImage: string | null | undefined;
  loadImage: boolean;
  loadThumbnailImage: boolean;
  loadBasicImage: boolean = false;
  imageChangedEvent: Event | undefined;
  imageThumbnailChangedEvent: Event | undefined;
  filename: any;
  thumbnailFilename: any
  basicfilename: any
  imageBasicChangedEvent: Event | undefined;

  //Styling variables
  background: any
  border: any
  color: any

  selectedCategories: any = []
  selectedBrand: any
  selectedProducts: any = []
  imageFiles: any = []
  files: any = []

  errors: any
  validError: any
  // url: any;
  format: string | undefined;
  url: string | ArrayBuffer | null | undefined;
  playVideo: boolean;
  video: string | ArrayBuffer | null;
  videoFile: any = {}
  disableButton: boolean = false;

  productfiles: any = []
  thumbnailfile: any = ''
  videofile: any = ''
  thumbnail: any
  productvideo: any

  selectedTax: any

  //categories
  maincategories: any = []
  selectedMainCategory: any
  subcategories: any = []
  selectedSubCategory: any = []
  showMainCategory: Boolean = false
  parentCategory: any = []
  subCategory: any = []
  selectedDefaultCategory: any
  headAdded: Boolean = false

  productHeadId: any
  basicfile: any = ''
  isUnit: Boolean = false
  producthhead: any
  attributes: any = []
  attrCardSelected: Boolean = false
  selectedAttribute: any = []
  attributesRefid: any = []
  attributesId: any = []
  showMedia: Boolean = false
  showProduct: Boolean = false
  slug: string = '';
  productheadfile: any;
  defaultcategories: any = [];
  base: string;

  submitting: boolean = false
  attributesValuesId: any = [];
  attributesValuesRefid: any = [];

  attributesValues: any = []
  selectedAttributesValues: any = []

  productImages: any = []
  productFile: any = []
  productImagesLastPage: boolean = false
  thumbnailImages: any = []
  thumbnailFile: any
  thumbnailImagesLastPage: boolean = false
  productImagePage: any = 1
  thumbnailImagePage: any = 1

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
      { class: 'Manrope', name: 'Manrope' },
    ]
  };

  is360Enabled: boolean = false
  objFile: any
  objFilename: any
  isValidObjFile: boolean = true;
  showObjFile: boolean = false
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private Router: Router,
    private ProductService: ProductService,
    private BrandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private toastr: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductHeadService: ProductHeadService,
    private AttributeService: AttributeService,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService
  ) { }

  get pf() {
    return this.productform.controls;
  }

  get hf() {
    return this.productheadform.controls;
  }

  getBrandDetails() {
    if (!this.brand.value) {
      return
    }

    this.BrandService.getBrandDetails(this.brand.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.brands = res?.result
        }
      }
    })
  }

  onBrandTriggered(event: any) {
    this.parentForm.get('brand')?.setValue(event._id)
  }

  onCategoryTriggered(event: any) {
    const isIdPresent = this.productCategories.some(category => category._id == event._id);
    if (isIdPresent) {
      this.HotToastService.info('Category already added')
    } else {
      this.productCategories.push(event)
      this.getDefaultCategories(event.slug)
    }
    this.parentForm.get('parentCategories')?.setValue(this.productCategories)
  }

  onProductsTriggered(event: any) {
    const isIdPresent = this.relatedProducts.some(product => product._id == event._id);
    if (isIdPresent) {
      this.HotToastService.info('Category already added')
    } else {
      this.productCategories.push(event)
    }
    this.parentForm.get('relatedProducts')?.setValue(this.relatedProducts)
  }

  onTagsTriggered(event: any, type: string) {
    switch (type) {
      case 'topright':
        this.tagsForm.get('topRightTag')?.setValue(event._id)
        break
      case 'topleft':
        this.tagsForm.get('topLeftTag')?.setValue(event._id)
        break
      case 'bottomright':
        this.tagsForm.get('bottomRightTag')?.setValue(event._id)
        break
      case 'bottomleft':
        this.tagsForm.get('bottomLeftTag')?.setValue(event._id)
        break
    }
  }

  getDefaultCategories(category: string) {
    this.categoryService.defaultCategories(category).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = [...this.defaultCategories, ...res?.result]
        } else {

        }
      }, error: (err: any) => {

      }
    })
  }

  handleThumbnail(event: any) {
    this.parentForm.get('thumbnail')?.setValue(event._id)
  }

  productMediaClicked(event: any) {
    this.images.push(event)
  }

  productIconClicked(event: any) {
    this.icons.push(event)
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

  getParentDetails(productSlug: string) {
    this.ProductHeadService.parentDetails(productSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.parentDetails = res?.result
          this.parentForm.patchValue(res.result)
          this.brandDetails = res?.result?.brand
          this.previewDetails = res?.result?.thumbnail?.path
          this.productCategories = res?.result?.parentCategory.id
          this.productCategories.map((item: any) => this.getDefaultCategories(item.slug))
          res?.result?.defaultCategory?.id ? this.getAttributes(res?.result?.defaultCategory?.id?.catid) : null
          res?.result?.defaultCategory?.id ? this.getDefaultCategories(res?.result?.defaultCategory?.id?.slug) : null
          this.parentForm.get('category')?.setValue(res?.result?.category?._id)
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
      }
    })
  }

  toggleAddOnItems() {

  }

  saveChanges() {
    if (!this.form.valid) {
      return
    }

    let files = this.images.map((item: any) => item._id)
    this.form.value.relatedProducts ? null : this.form.get('relatedProducts')?.setValue([])

    console.log(this.categories)

    let payload = {
      ...this.form.value,
      files: files,
      product: { id: this.parentDetails?._id, refid: this.parentDetails?.prodid },
      attributes: this.productAttributes,
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
    if (!this.parentForm.valid) {
      return
    }

    if (!this.parentForm.value.brand) this.parentForm.get('brand')?.setValue(null)

    this.ProductHeadService.addProductHead(this.parentForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res.message)
          this.getParentDetails(res?.result?.slug)
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
        type: attributeDetails.id,
        value: valueDetails._id
      })
    }
  }

  attributeExists(attributeDetails: any, valueDetails: any) {
    const isIdPresent = this.productAttributes.some(attribute => attribute.type == attributeDetails.id && attribute.value == valueDetails._id);
    return isIdPresent ? 'active' : null
  }

  searchProducts() {

  }

  ngOnInit(): void {
    this.initForm();
    this.base = environment.base
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();

    this.tagsForm = new FormGroup({
      topRightTag: new FormControl(""),
      topLeftTag: new FormControl(""),
      bottomRightTag: new FormControl(""),
      bottomLeftTag: new FormControl("")
    })

    this.slug = this.route.snapshot.queryParams.product || ''
    this.slug ? this.getParentDetails(this.slug) : null

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.categoryService.getMainCategories().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.maincategories = res?.result
        if (this.slug != '') {
          this.getProductHead(this.slug)
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })


    // this.ProductService.productImages({ page: this.productImagePage }).subscribe((res: any) => {
    //   if (res?.errorCode == 0) {
    //     this.productImages = res?.result?.images
    //     this.productImagesLastPage = res?.result?.isLastPage
    //     this.ChangeDetectorRef.markForCheck()
    //   }
    // })

    this.parentForm = new FormGroup({
      name: new FormControl("", Validators.required),
      brand: new FormControl(""),
      category: new FormControl(null), // Default category
      parentCategories: new FormControl("", Validators.required), //Main category
      thumbnail: new FormControl(null),
      isActive: new FormControl("true"),
      sku: new FormControl("", Validators.required),
      tax: new FormControl(""),
      hsn: new FormControl(""),
      cod: new FormGroup({ isPresent: new FormControl("false"), value: new FormControl(0) }),
      shipping: new FormGroup({ isPresent: new FormControl("false"), value: new FormControl(0) }),
      return: new FormGroup({ isPresent: new FormControl("false"), value: new FormControl(0) }),
      replace: new FormGroup({ isPresent: new FormControl("false"), value: new FormControl(0) }),
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
      thumbnail: new FormControl(""),
      files: new FormControl(""),
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
      stockWarning: new FormControl(10),
      searchKeywords: new FormControl(""),
      relatedProducts: new FormControl(""),
      isActive: new FormControl("true"),
      isVisible: new FormControl("true"),
    })

    //Tax class details
    this.taxClassService.getTaxClasses().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.taxClassDetails = res?.result;
        } else {

        }
      }, error: (err: any) => {

      }
    });
    //Tax class details

    // this.ProductService.productThumbnailImages({ page: this.thumbnailImagePage }).subscribe((res: any) => {
    //   if (res?.errorCode == 0) {
    //     this.thumbnailImages = res?.result?.images
    //     this.thumbnailImagesLastPage = res?.result?.isLastPage
    //     this.ChangeDetectorRef.markForCheck()
    //   }
    // })
  }

  initForm() {
    this.productform = this.formBuilder.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      mrpPrice: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]],
      offerPrice: ['', Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')],
      stock: ['', Validators.required],
      moq: ['', Validators.required],
      maxOrderQuantity: ['', Validators.required],
      stockWarning: [''],
      description: [''],
      features: [''],
      longDescription: [''],
      categories: [],
      brandId: [''],
      additionalbutton: [''],
      buttonredireturl: [''],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      isVisible: ['true', Validators.required],
      value: [''],
      unit: [''],
      searchKeywords: [],
      relatedProducts: [],
      position: [''],
      file: [''],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });

    this.productheadform = this.formBuilder.group({
      name: ['', Validators.required],
      hsn: [''],
      sku: ['', Validators.required],
      tax: [''],
      cod: ['false', Validators.required],
      codCharge: [0],
      returnable: ['false', Validators.required],
      returnDays: [0],
      shippingMethod: ['Unpaid', Validators.required],
      shippingCost: [0],
      isActive: ['true', Validators.required],
      isArchive: ['false', Validators.required],
    })
  }

  appendMainCategory() {
    for (let _main of this.maincategories) {
      for (let _sel of this.selectedMainCategory) {
        if (_main?._id == _sel) {
          this.defaultcategories.push({
            _id: _main?._id,
            name: _main?.name,
            catid: _main?.catid
          })

          this.subcategories.push({
            _id: _main?._id,
            name: _main?.name,
            catid: _main?.catid
          })
        }
      }
    }
  }

  tagInput(event: any) {
    let _value = event.value
    if (_value) {
      if (this.productform.get('searchKeywords')?.value != ' ' || '' || null) {
        this.searchKeyowrds.push(this.productform.get('searchKeywords')?.value);
        this.productform.get('searchKeywords')?.setValue('');
      }
    }
  }

  tagRemove(value: any) {
    this.searchKeyowrds = this.searchKeyowrds.filter((_data: any) => _data != value)
  }

  tagProductAdd(event: any) {
    let rProduct = event.value
    if (!this.relProductIds.includes(rProduct)) {
      this.relProductIds.push(rProduct)
      for (let i = 0; i < this.productsData.length; i++) {
        if (this.productsData[i]._id == rProduct) {
          this.relProductNames.push(this.productsData[i].name)
        }
      }
    } else {
      this.toastr.info('Product already added');
    }
    this.productform.get("relatedProducts")?.setValue('')
  }

  tagProductRemove(_val: any) {
    this.relProductNames = this.relProductNames.filter((_data: any) => _data != _val)
    for (let i = 0; i < this.productsData.length; i++) {
      if (this.productsData[i].name == _val) {
        this.relProductIds = this.relProductIds.filter((_data: any) => _data != this.productsData[i]._id)
      }
    }
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

  getBrandDetail() {
    this.BrandService.getActiveBrands().subscribe((res: any) => {
      this.brandData = res?.result;
    });
  }

  getCategoryDetail() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
    });
  }

  getTaxClassDetail() {

  }

  getProducts() {
    this.ProductService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.imageFiles]
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.imageFiles = [...products]
    let productsFiles = [...this.files]
    moveItemInArray(productsFiles, event.previousIndex, event.currentIndex);
    this.files = [...productsFiles]
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  updateProduct() { }

  addProduct() {
    if (!this.productform.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.disableButton = true
      this.submitting = true
      setTimeout(() => {
        this.ProductService.addProduct(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
            this.submitting = false
            this.ChangeDetectorRef.markForCheck()
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.Router.navigate([this.appRoute.product.PRODUCT_LIST]);
            this.ngOnInit();
          }
        });
      }, 2000)
    }
  }

  createPayload() {
    let categoryRefid = []

    if (this.selectedSubCategory.length > 0) {
      for (let category of this.subcategories) {
        for (let _category of this.selectedSubCategory) {
          if (category?._id == _category) {
            categoryRefid.push(category.catid)
          }
        }
      }
    }

    this.selectedSubCategory = [...this.selectedSubCategory, ...this.producthhead['parentCategory']['id']]
    categoryRefid = [...categoryRefid, ...this.producthhead['parentCategory']['refid']]

    const data = {
      name: this.productform.get('name')?.value,
      sku: this.productform.get('sku')?.value,
      stock: this.productform.get('stock')?.value,
      moq: this.productform.get('moq')?.value,
      maxOrderQuantity: this.productform.get('maxOrderQuantity')?.value,
      product: {
        id: this.producthhead['_id'],
        refid: this.producthhead['prodid'],
      },
      price: {
        mrp: this.productform.get('mrpPrice')?.value,
        offer: this.productform.get('offerPrice')?.value ? this.productform.get('offerPrice')?.value : this.productform.get('mrpPrice')?.value,
        selling: this.productform.get('offerPrice')?.value ? this.productform.get('offerPrice')?.value : this.productform.get('mrpPrice')?.value,
      },
      style: {
        background: this.productform.get('background')?.value,
        border: this.productform.get('border')?.value,
        radius: this.productform.get('radius')?.value,
        text: {
          color: this.productform.get('color')?.value,
          fontSize: this.productform.get('fontSize')?.value,
          fontWeight: this.productform.get('fontWeight')?.value,
        }
      },
      unit: {
        value: this.productform.get('value')?.value,
        type: this.productform.get('unit')?.value,
      },
      details: {
        description: this.productform.get('description')?.value,
        longDescription: this.productform.get('longDescription')?.value,
        features: this.productform.get('features')?.value,
        additionalbutton: this.productform.get('additionalbutton')?.value,
        buttonredireturl: this.productform.get('buttonredireturl')?.value,
      },
      category: {
        id: this.selectedSubCategory,
        refid: categoryRefid
      },
      panorama: {
        isEnabled: this.is360Enabled,
        file: this.objFile ? this.objFile : null
      },
      attributes: this.attributesValues,
      productFiles: this.productFile,
      stockWarning: this.productform.get('stockWarning')?.value,
      isActive: this.productform.get('isActive')?.value,
      isArchive: this.productform.get('isArchive')?.value,
      isFeatured: this.productform.get('isFeatured')?.value,
      isVisible: this.productform.get("isVisible")?.value,
      searchKeywords: this.searchKeyowrds,
      relatedProducts: this.selectedProducts,
      files: this.files,
      video: this.videoFile,
      thumbFilename: this.thumbnailFilename,
      thumbFilestring: this.thumbnailImage,
      thumbnail: this.thumbnailFile
    }
    return data
  }

  addHead() {
    if (!this.productheadform.valid) {
      this.toastr.error('Validation failed')
      return;
    }

    const payload = this.createHeadPayload()
    if (payload) {
      this.ProductHeadService.addProductHead(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.producthhead = res?.result
          this.toastr.success(res?.message)
          this.productHeadId = res?.result?.prodid
          this.basicImage = ''
          this.loadBasicImage = false

          if (this.producthhead) {
            this.categoryService.getSubCategoriesbyId(this.producthhead?.parentCategory).subscribe((res: any) => {
              if (res?.errorCode == 0) {
                this.subcategories = res?.result
              }
            })

            this.AttributeService.getAttributes(this.producthhead?.defaultCategory?.refid).subscribe((res: any) => {
              if (res?.errorCode == 0) {
                this.attributes = res?.result
                this.ChangeDetectorRef.markForCheck()
              }
            })
          }

          this.Router.navigate([this.appRoute.product.ADD_PRODUCT], { queryParams: { id: res?.result?.prodid } })
          this.getProductHead(res?.result?.prodid)
          this.slug = res?.result?.prodid
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.toastr.error(res?.message)
        }
      })
    }
  }

  updateHead() {
    if (!this.productheadform.valid) {
      this.toastr.error('Validation failed')
      return;
    }

    const payload = this.createHeadPayload()
    if (payload) {
      this.ProductHeadService.updateProductHead(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message)
          this.producthhead = res?.result
          this.productHeadId = res?.result?.prodid
          if (this.producthhead) {
            this.categoryService.getSubCategoriesbyId(this.producthhead?.parentCategory).subscribe((res: any) => {
              if (res?.errorCode == 0) {
                this.subcategories = res?.result
              }
            })

            this.AttributeService.getAttributes(this.producthhead?.defaultCategory?.refid).subscribe((res: any) => {
              if (res?.errorCode == 0) {
                this.attributes = res?.result
                this.ChangeDetectorRef.markForCheck()
              }
            })
          }
          this.Router.navigate([this.appRoute.product.ADD_PRODUCT], { queryParams: { id: res?.result?.prodid } })
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.toastr.error(res?.message)
        }
      })
    }
  }

  createHeadPayload() {
    let refids = []
    let refid = ''
    let file: any

    for (let category of this.defaultcategories) {
      for (let _cat of this.selectedMainCategory) {
        if (category?._id == _cat) {
          refids.push(category?.catid)
        }
        if (this.selectedDefaultCategory == category?._id) {
          refid = category?.catid
        }
      }
    }

    if (this.basicfilename != '' && this.basicImage) {
      file = {
        file: this.basicImage,
        name: this.basicfilename
      }
    } else {
      file = this.productheadfile
    }

    let data = {
      name: this.productheadform.get('name')?.value,
      hsn: this.productheadform.get('hsn')?.value,
      sku: this.productheadform.get('sku')?.value,
      tax: this.selectedTax,
      brand: this.selectedBrand,
      isActive: this.productheadform.get('isActive')?.value,
      isArchive: this.productheadform.get('isArchive')?.value,
      parentCategory: {
        id: this.selectedMainCategory,
        refid: refids
      },
      defaultCategory: {
        id: this.selectedDefaultCategory,
        refid: refid
      },
      prodid: this.productHeadId,
      cod: {
        isPresent: this.productheadform.get('cod')?.value,
        value: this.productheadform.get('codCharge')?.value
      },
      shipping: {
        method: this.productheadform.get('shippingMethod')?.value,
        value: this.productheadform.get('shippingCost')?.value
      },
      return: {
        isPresent: this.productheadform.get('returnable')?.value,
        value: this.productheadform.get('returnDays')?.value
      },
      file: file
    }

    return data
  }

  getProductHead(id: any) {
    this.ProductHeadService.productHeadDetails(id).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.productheadform.get('name')?.setValue(res?.result[0]?.name)
        this.productheadform.get('hsn')?.setValue(res?.result[0]?.hsn)
        this.productheadform.get('sku')?.setValue(res?.result[0]?.sku)
        this.productheadform.get('cod')?.setValue(res?.result[0]?.cod?.isPresent)
        this.productheadform.get('codCharge')?.setValue(res?.result[0]?.cod?.value)
        this.productheadform.get('shippingMethod')?.setValue(res?.result[0]?.shipping?.method)
        this.productheadform.get('shippingCost')?.setValue(res?.result[0]?.shipping?.value)
        this.productheadform.get('returnable')?.setValue(res?.result[0]?.return?.isPresent)
        this.productheadform.get('returnDays')?.setValue(res?.result[0]?.return?.value)
        this.productheadform.get('isActive')?.setValue(res?.result[0]?.isActive)
        this.productheadform.get('isArchive')?.setValue(res?.result[0]?.isArchive)
        this.selectedMainCategory = res?.result[0]?.parentCategory['id']

        this.categoryService.getSubCategoriesbyId(this.selectedMainCategory).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.subcategories = res?.result
            this.defaultcategories = [...res?.result]
            this.appendMainCategory()
            this.showMainCategory = true
            this.ChangeDetectorRef.markForCheck()
          }
        })

        this.producthhead = res?.result[0]
        this.showMainCategory = true
        for (let category of this.maincategories) {
          for (let cat of res?.result[0]?.parentCategory?.id) {
            if (cat == category?._id) {
              this.parentCategory.push({
                name: category?.name,
                id: category?._id
              })
            }
          }
        }

        this.selectedDefaultCategory = res?.result[0]?.defaultCategory['id']
        this.selectedBrand = res?.result[0]?.brand
        this.selectedTax = res?.result[0]?.tax
        this.basicfile = environment.base + "/" + res?.result[0]?.file
        this.productheadfile = res?.result[0]?.file
        this.AttributeService.getAttributes(res?.result[0]?.defaultCategory['refid']).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.attributes = res?.result
            this.ChangeDetectorRef.markForCheck()
          }
        })
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}