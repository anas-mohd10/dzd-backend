import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
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

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  appRoute = appRoutes;

  limit: FormControl = new FormControl('40')
  page: number = 1
  isLastPage: boolean = false
  products: Array<any> = []
  productResults: string = ''

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
    private BrandService: BrandService
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
      shippingCost: new FormControl(1, Validators.pattern("^[1-9]*")),
      returnable: new FormControl('false'),
      returnDays: new FormControl(1, Validators.pattern("^[1-9]*")),
      cod: new FormControl('false'),
      codCharge: new FormControl(1, Validators.pattern("^[1-9]*")),
      tax: new FormControl('', Validators.required),
      sku: new FormControl('', Validators.required),
      hsn: new FormControl(''),
      parentCategory: new FormControl('', Validators.required),
      defaultCategory: new FormControl('', Validators.required),
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
  }

  get formControls() {
    return this.editForm.controls
  }

  getNextPage() {
    this.page += 1
    this.getProductHeads()
  }

  getPreviousPage() {
    this.page -= 1
    this.getProductHeads()
  }

  getProductHeads() {
    let payload = {
      limit: this.limit.value,
      page: this.page,
      ...this.form.value
    }

    this.ProductHeadService.searchProductHead(payload).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.products = res?.result?.data
          this.productResults = res?.result?.totalItems
          this.isLastPage = res?.result?.lastPage
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  clearFilters() {
    this.productForm.reset()
    this.limit.setValue('40')
    this.page = 1
    this.getProductHeads()
  }

  getChildNextPage() {
    this.productPage += 1
    this.getProducts()
  }

  getChildPreviousPage() {
    this.productPage -= 1
    this.getProducts()
  }

  getProducts() {
    let payload = {
      ...this.productForm.value,
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

  clearChildFilters() {
    this.productForm = new FormGroup({
      name: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });

    this.productPage = 1
    this.productLimit?.setValue('20')
    this.getProducts()
  }

  open(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.modalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true });
  }

  close() {
    this.modalRef?.hide()
    this.productDetails = {}
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

  getBrands() {
    if (this.brand.value) {
      this.BrandService.searchBrand({ page: 1, limit: '50', keyword: this.brand.value }).subscribe({
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

  selectBrand(brand: any) {

  }

  toggleCategoy(category: any) {
    this.isElementAlreadyPresent(this.productCategory, category) ?
      this.productCategory = this.productCategory.filter((item: any) => item.catid !== category.catid) :
      this.productCategory.push(category)

    let categories = []
    for (let category of this.productCategory) categories.push(category?._id)

    this.CategoryService.childCategories(categories).subscribe({
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

  isElementAlreadyPresent(array: any = [], element: any) {
    return array.some((item: any) => item.catid === element.catid);
  }

  toggleDropdown() {
    this.isCategoryDropdown = !this.isCategoryDropdown
  }
}
