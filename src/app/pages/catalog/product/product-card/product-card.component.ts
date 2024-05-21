import { ChangeDetectorRef, Component, OnInit, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  appRoute = appRoutes;
  limit: number = 30
  page: number = 1
  isLastPage: boolean = false;
  totalResults: number = 0
  totalPages: number = 1;
  products: Array<any> = [];

  childProducts: Array<any> = []
  childResults: string = ''
  isLastProduct: boolean = false
  productLimit: FormControl = new FormControl('40')
  productPage: number = 1
  isSubmitted: boolean = false

  form: FormGroup
  productForm: FormGroup
  editForm: FormGroup

  modalRef?: BsModalRef
  productRef?: BsModalRef
  productDetails: any = {}
  base: string = environment.base
  settings: any = {}

  taxes: Array<any> = []
  brands: Array<any> = []
  brand: FormControl = new FormControl('')
  categories: Array<any> = []
  category: FormControl = new FormControl('')
  productCategory: Array<any> = []
  defaultCategories: Array<any> = []
  isCategoryDropdown: boolean = false
  brandDetails: any;
  headDetails: any;
  defaultCategory: any;

  parentCategories: Array<any> = []
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  constructor(
    private ProductService: ProductService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ProductHeadService: ProductHeadService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private ToastrService: ToastrService,
    private TaxClassesService: TaxClassesService,
    private BrandService: BrandService,
    private ElementRef: ElementRef,
    private HotToastService: HotToastService
  ) { }

  get editFormControls() {
    return this.editForm.controls
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
      category: new FormControl('')
    });

    this.productForm = new FormGroup({
      name: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });

    this.editForm = new FormGroup({
      name: new FormControl('', Validators.required),
      isActive: new FormControl('true'),
      shippingMethod: new FormControl('Unpaid'),
      shipping: new FormControl('true'),
      shippingCost: new FormControl(1, Validators.pattern("^[0-9]*")),
      returnable: new FormControl('false'),
      returnDays: new FormControl(1, Validators.pattern("^[0-9]*")),
      replace: new FormControl('false'),
      replaceDays: new FormControl(1, Validators.pattern("^[0-9]*")),
      cod: new FormControl('false'),
      codCharge: new FormControl(0, Validators.pattern("^[0-9]*")),
      tax: new FormControl('', Validators.required),
      sku: new FormControl('', Validators.required),
      hsn: new FormControl(''),
      parentCategory: new FormControl('', Validators.required),
      defaultCategory: new FormControl(''),
      brand: new FormControl(null),
    });

    this.getProductHeads()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })

    this.CategoryService.getMainCategories().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.categories = res?.result
          this.ChangeDetectorRef.markForCheck();
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })

    this.TaxClassesService.getTaxClasses().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.taxes = res?.result
          this.ChangeDetectorRef.markForCheck();
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    });

    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.brands = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })
  }

  get formControls() {
    return this.editForm.controls
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getProductHeads()
  }

  formdateDate(date: any) {
    return `${this.months[new Date(date).getMonth()]} ${new Date(date).getDate()} ${new Date(date).getFullYear()}`
  }

  getProductHeads() {
    let payload = {
      limit: this.limit,
      page: this.page,
      ...this.form.value
    }

    this.ProductHeadService.searchProductHead(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result?.data
          this.totalResults = res?.result?.totalItems
          this.totalPages = res?.result?.totalPages
          this.isLastPage = res?.result?.lastPage
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  clearFilters() {
    this.form.patchValue({ name: "", isActive: "", category: "" })
    this.limit = 30
    this.page = 1
    this.getProductHeads()
  }

  addCategory() {
    let isExists = this.parentCategories.some((category: any) => category._id == this.editForm.get('parentCategory')?.value)
    if (isExists) {
      this.parentCategories = this.parentCategories.filter((category: any) => category._id != this.editForm.get('parentCategory')?.value)
      this.HotToastService.error('Category removed from list')
    } else {
      let categoryDetails = this.categories.filter((category: any) => category._id == this.editForm.get('parentCategory')?.value)
      this.parentCategories.push(categoryDetails[0])
      let categories = this.parentCategories.map((category: any) => category._id)
      this.getChildCategory(categories)
      this.HotToastService.success('Category added to list')
    }
    this.editForm.get('parentCategory')?.setValue('')
  }

  removeCategory(categoryId: string) {
    this.parentCategories = this.parentCategories.filter((category: any) => category._id != categoryId)
    this.HotToastService.error('Category removed from list')
  }

  getProducts() {
    let payload = {
      page: this.productPage,
      limit: this.productLimit?.value,
      parent: this.productDetails?.prodid
    }

    this.ProductService.searchProducts(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.childProducts = res?.result?.data
          this.childResults = res?.result?.totalResults
          this.isLastProduct = res?.result?.lastPage
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  open(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.ProductHeadService.getDetails(productDetails?.prodid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.headDetails = res?.result
          this.editForm.get('name')?.setValue(res?.result?.name)
          this.editForm.get('sku')?.setValue(res?.result?.sku)
          this.editForm.get('hsn')?.setValue(res?.result?.hsn)
          if (res?.result?.brand) {
            this.brandDetails = res?.result?.brand
            this.editForm.get('brand')?.setValue(res?.result?.brand?._id)
          }
          this.editForm.get('tax')?.setValue(res?.result?.tax?._id)
          this.editForm.get('shipping')?.setValue(res?.result?.shipping?.isPresent)
          this.editForm.get('shippingCost')?.setValue(res?.result?.shipping?.value)
          this.editForm.get('returnable')?.setValue(res?.result?.return?.isPresent)
          this.editForm.get('returnDays')?.setValue(res?.result?.return?.value)
          this.editForm.get('replace')?.setValue(res?.result?.return?.isPresent)
          this.editForm.get('replaceDays')?.setValue(res?.result?.return?.value)
          this.editForm.get('cod')?.setValue(res?.result?.cod?.isPresent)
          this.editForm.get('codCharge')?.setValue(res?.result?.cod?.value)
          let categories = res?.result?.parentCategory?.id?.map((category: any) => { return category._id })
          this.parentCategories = res?.result?.parentCategory?.id
          this.getChildCategory(categories)
          this.editForm.get('defaultCategory')?.setValue(res?.result?.defaultCategory?.id?._id)
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  close() {
    this.modalRef?.hide()
    this.productDetails = {}
    this.isCategoryDropdown = false
  }

  openProducts(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.productRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
    this.getProducts()
  }

  closeProducts() {
    this.productRef?.hide()
    this.productDetails = {}
  }

  getCategories() {
    if (this.brand.value) {
      this.CategoryService.searchCategory({ page: 1, limit: '50', keyword: this.category.value }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.brands = res?.result?.data
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.ToastrService.error(res?.message)
          }
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    } else {
      this.brands = []
    }
  }

  getChildCategory(categories: Array<any>) {
    this.CategoryService.childCategories({ categories: categories }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.defaultCategories = res?.result
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.ToastrService.error(res?.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.error?.message)
      }
    })
  }

  updateProduct() {
    let parentCategory = {
      id: this.parentCategories.map((category: any) => { return category._id }),
      refid: this.parentCategories.map((category: any) => { return category.catid })
    }

    if (this.editForm.get('defaultCategory')?.value) {
      let defaultCategory = {
        id: this.editForm.get('defaultCategory')?.value,
        refid: this.defaultCategories.filter((category: any) => category._id == this.editForm.get('defaultCategory')?.value)[0]?.catid
      }
      this.editForm.get('defaultCategory')?.setValue(defaultCategory)
    }

    this.editForm.get('parentCategory')?.setValue(parentCategory)

    if (!this.editForm.valid) {
      this.isSubmitted = true
      return
    }

    let payload = {
      ...this.editForm.value,
      shipping: {
        value: this.editForm.value.shippingCost,
        isPresent: this.editForm.value.shipping
      },
      cod: {
        value: this.editForm.value.codCharge,
        isPresent: this.editForm.value.cod
      },
      replace: {
        value: this.editForm.value.replaceDays,
        isPresent: this.editForm.value.replace
      },
      prodid: this.headDetails?.prodid,
      return: {
        value: this.editForm.value.returnDays,
        isPresent: this.editForm.value.returnable
      },
    }

    this.ProductHeadService.updateProductHead(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.modalRef?.hide()
          this.productDetails = {}
          this.HotToastService.success(res?.message)
          this.getProductHeads()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }
}
