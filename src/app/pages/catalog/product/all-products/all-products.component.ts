import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BrandService } from 'src/app/includes/services/brand.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  appRoute = appRoutes
  products: Array<any> = []
  filters: any = [];
  categories: any;
  loaded: boolean = false
  settings: any = {}
  page: number = 1;
  type: String = ''
  name: FormControl = new FormControl('')
  limit: number = 20;
  isActive: FormControl = new FormControl('')
  isVisible: FormControl = new FormControl('')
  isFeatured: FormControl = new FormControl('')
  stock: FormControl = new FormControl('')
  sort: FormControl = new FormControl('')
  boostScore: FormControl = new FormControl('')
  visibility: FormControl = new FormControl('')
  category: FormControl = new FormControl('')
  categoryItems: Array<any> = []
  isTableView: boolean = true;
  activeAccordion: string = 'category';
  isFilters: boolean = false;
  totalResults: any;
  productBrand: FormControl = new FormControl('');
  totalPages: any;
  productCategory: FormControl = new FormControl('');
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  stockFilters: Array<any> = [
    { key: 'In Stock', value: '1', label: 'stock' },
    { key: 'Out of Stock', value: '0', label: 'stock' },
    { key: 'Limited Stock', value: '2', label: 'stock' }
  ]
  statusFilters: Array<any> = [
    { key: 'Active', value: 'true', label: 'status' },
    { key: 'Inactive', value: 'false', label: 'status' }
  ]
  visibilityFilters: Array<any> = [
    { key: 'Visible', value: 'true', label: 'visibility' },
    { key: 'Invisible', value: 'false', label: 'visibility' }
  ]
  sortFilters: Array<any> = [
    { key: 'Price : High to Low', value: '0', label: 'sort' },
    { key: 'Price : Low to High', value: '1', label: 'sort' }
  ]
  boostScoreFilters: Array<any> = [
    { key: 'High to Low', value: '3', label: 'boostScore' },
    { key: 'Low to High', value: '4', label: 'boostScore' }
  ]
  visibleFilters: Array<any> = [
    { key: 'Visible products', value: '0', label: 'visibility' },
    { key: 'Invisible products', value: '1', label: 'visibility' }
  ]
  brands: Array<any> = []
  base: string = environment.base
  domainUrl: string = ''
  exportModalRef?: BsModalRef;
  importModalRef?: BsModalRef;
  importFile: any;
  importDetails: any

  exportType: FormControl = new FormControl('csv')
  exportCondition: FormControl = new FormControl('basic')
  availableBasicFields: Array<{ name: string, value: string }> = [
    { name: 'Name', value: 'name' },
    { name: 'SKU', value: 'sku' },
    { name: 'Type', value: 'type' },
    { name: 'Stock', value: 'stock' },
    { name: 'Status', value: 'isActive' },
    { name: 'Visibility', value: 'isVisible' },
    { name: 'Boost Score', value: 'boostScore' },
    { name: 'Original Price', value: 'originalPrice' },
    { name: 'Store Price', value: 'storePrice' },
  ]
  basicFields: Array<string> = ['name', 'sku', 'type', 'stock', 'isActive', 'isVisible', 'boostScore', 'originalPrice', 'storePrice']

  constructor(
    private BrandService: BrandService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private ActivatedRoute: ActivatedRoute,
    private BsModalService: BsModalService,
    private Router: Router,
    private HotToastService: HotToastService
  ) { }

  openExport(template: TemplateRef<any>) {
    this.exportModalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-sm',
      ignoreBackdropClick: true,
    });
  }

  openImport(template: TemplateRef<any>) {
    this.importModalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-sm',
      ignoreBackdropClick: true,
    });
  }

  fileChange(event: any) {
    this.importFile = event.target.files[0]
    this.ChangeDetectorRef.markForCheck()
  }

  importProducts() {
    const formData = new FormData();
    formData.append('file', this.importFile);
    this.ProductService.importProducts(formData).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.importDetails = res?.result
          this.HotToastService.success(res?.message)
          this.importModalRef?.hide()
          this.importFile = null
          this.Router.navigate([ `${appRoutes.bulk.import}/${res?.result?.importId}`])
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => { }
    }) 
  }

  switchToggled(event: { toggleState: boolean, switchId: string }) {
    if (event.toggleState) {
      this.basicFields.push(event.switchId)
    } else {
      this.basicFields = this.basicFields.filter((field) => field != event.switchId)
    }
  }

  ngOnInit(): void {
    this.type = this.ActivatedRoute.snapshot.queryParams.type || ''

    switch (this.type) {
      case 'out-of-stock':
        this.stock?.setValue(0)
        this.activeAccordion = 'stock'
        break
      case 'inactive-products':
        this.isActive?.setValue('false')
        this.activeAccordion = 'status'
        break
    }

    this.CategoryService.getCategory().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result
        this.ChangeDetectorRef.markForCheck();
      }
    })

    this.BrandService.getBrand().subscribe({
      next: (response: any) => {
        if (response.errorCode == 0) {
          this.brands = response?.result
          this.ChangeDetectorRef.markForCheck();
        } else { }
      }, error: (error: any) => { }
    })

    this.getProducts()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.domainUrl = res?.result?.domain?.endsWith('/') ? res?.result?.domain : `${res?.result?.domain}/`
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  formatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  changeView(type: string) {
    if (type == 'grid') {
      this.isTableView = false
    } else {
      this.isTableView = true
    }
  }


  getProducts() {
    let categoryItems = this.categoryItems.map((item: any) => item.name)
    const payload = {
      brand: this.productBrand?.value,
      name: this.name?.value,
      isActive: this.isActive?.value,
      isFeatured: this.isFeatured?.value,
      isVisible: this.isVisible?.value,
      stock: this.stock?.value,
      visibility: this.visibility?.value,
      sort: this.sort?.value,
      categories: categoryItems,
      page: this.page,
      limit: this.limit
    }

    this.ProductService.searchProducts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.totalResults = res?.result?.totalResults
        this.totalPages = res?.result?.totalPages
        this.page = res?.result?.page
        this.loaded = true
        this.ChangeDetectorRef.markForCheck();
      }
    })
  }

  onCategoryTriggered() {
    let categoryDetails = this.categories.filter((category: any) => category.name == this.productCategory.value)
    !this.categoryItems.includes(categoryDetails[0]) ? this.categoryItems.push(categoryDetails[0]) : this.categoryItems = this.categoryItems.filter(item => item.name !== this.productCategory.value)
    this.getProducts()
    this.productCategory.setValue('')
  }

  onCategoryRemoved(category: any) {
    this.categoryItems = this.categoryItems.filter(item => item.catid != category.catid)
    this.getProducts()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getProducts()
  }

  clearFilters() {
    this.isActive?.setValue('')
    this.category?.setValue('')
    this.isFeatured?.setValue('')
    this.stock?.setValue('')
    this.sort?.setValue('')
    this.name?.setValue('')
    this.visibility?.setValue('')
    this.productBrand?.setValue('')
    this.page = 1
    this.limit = 20
    this.categoryItems = []
    this.getProducts()
  }

  updateProduct(event: { switchId: string, toggleState: boolean }) {
    this.ProductService.updateProduct(event.switchId, { prodid: event.switchId, isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getProducts()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  toggleFilters(type: any) {
    this.activeAccordion != type ? this.activeAccordion = type : this.activeAccordion = ''
  }

  addFilters(type: any, value?: any) {
    switch (type) {
      case 'stock':
        this.stock?.value != value ? this.stock?.setValue(value) : this.stock?.setValue('')
        break
      case 'status':
        this.isActive?.value != value ? this.isActive?.setValue(value) : this.isActive?.setValue('')
        break
      case 'visibility':
        this.isVisible?.value != value ? this.isVisible?.setValue(value) : this.isVisible?.setValue('')
        break
      case 'sort':
        this.sort?.value != value ? this.sort?.setValue(value) : this.sort?.setValue('')
        break
      case 'visibility':
        this.visibility?.value != value ? this.visibility?.setValue(value) : this.visibility?.setValue('')
        break
      case 'category':
        let categoryDetails = this.categories.filter((category: any) => category.catid == this.productCategory.value)
        !this.categoryItems.includes(categoryDetails[0]) ? this.categoryItems.push(categoryDetails[0]) : this.categoryItems = this.categoryItems.filter(item => item.catid !== this.productCategory.value)
        break
    }

    this.getProducts()
  }

  exportProducts() {
    this.ProductService.exportProducts({
      exportType: this.exportType?.value,
      exportCondition: this.exportCondition?.value,
      basicFields: this.basicFields
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.HotToastService.success(res?.message)
          this.exportModalRef?.hide()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  downloadSampleFile(){
    
  }
}
