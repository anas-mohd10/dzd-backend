import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})

export class UpdateProductComponent implements OnInit {
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
      { class: 'sen', name: 'Sen' },
      { class: 'be-vietnam-pro', name: 'Be Vietnam Pro' },
    ]
  };
  productIcons: Array<any> = []
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
  productSlug: string = '' // Store product slug
  productDetails: any // Store product details
  addOnItems: Array<any> = [];
  thumbnailPreview: string = ''
  activeRelatedProducts: Array<any> = []
  relatedProduct: FormControl = new FormControl('')

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private ProductService: ProductService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AttributeService: AttributeService,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService
  ) { }

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

  getDefaultCategories(category: string) {
    this.categoryService.defaultCategories(category).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = [...this.defaultCategories, ...res?.result]
          this.ChangeDetectorRef.markForCheck()
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


    let payload = {
      ...this.form.value,
      prodid: this.productDetails.prodid,
      slug: this.productDetails.slug,
      files: this.images.map((item: any) => item._id),
      relatedProducts: this.relatedProducts ? this.relatedProducts.map((product: any) => product._id) : [],
      product: { id: this.parentDetails?._id, refid: this.parentDetails?.prodid },
      attributes: this.productAttributes,
      productIcons: this.icons.map((icon: any) => icon._id),
      category: {
        id: this.categories.map((category: any) => category?._id),
        refid: this.categories.map((category: any) => category?.catid),
      },
      productTags: this.tagsForm.value,
    }

    this.ProductService.updateProduct(this.productDetails.slug, payload).subscribe({
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
    this.base = environment.base

    this.tagsForm = new FormGroup({
      topRightTag: new FormControl(null),
      topLeftTag: new FormControl(null),
      bottomRightTag: new FormControl(null),
      bottomLeftTag: new FormControl(null)
    })

    this.productSlug = this.ActivatedRoute.snapshot.queryParams.product || ''

    this.ProductService.getProductDetails(this.productSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result)
          this.productDetails = res?.result
          this.images = res?.result?.files
          this.categories = res?.result?.category?.id
          if (res?.result?.productTags) {
            this.tagsForm.patchValue(res?.result?.productTags)
            this.productTags = {
              topRightTag: res?.result?.productTags?.topRightTag?.path,
              topLeftTag: res?.result?.productTags?.topLeftTag?.path,
              bottomRightTag: res?.result?.productTags?.bottomRightTag?.path,
              bottomLeftTag: res?.result?.productTags?.bottomLeftTag?.path,
            }
          }
          this.relatedProducts = res?.result?.relatedProducts
          this.searchKeywords = res?.result?.searchKeywords
          this.icons = res?.result?.productIcons ? res?.result?.productIcons : []
          this.thumbnailPreview = res?.result?.thumbnail?.path
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

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

    this.categoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {

        }
      }, error: (err: any) => {

      }
    })

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
        } else {

        }
      }, error: (err: any) => {

      }
    });
    //Tax class details
  }

}
