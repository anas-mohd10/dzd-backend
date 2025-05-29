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
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  appRoute = appRoutes
  products: Array<any> = []
  filters: any = [];
  categories: any[] = [];
  brands: any[] = [];
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  categoryItems: Array<any> = [];
  brandItems: Array<any> = [];
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
    { key: 'Updated at', value: '-1', label: 'sort' },
    { key: 'Price : Low to High', value: '0', label: 'sort' },
    { key: 'Price : High to Low', value: '1', label: 'sort' },
    { key: 'Boost Score : Low to High', value: '2', label: 'sort' },
    { key: 'Boost Score : High to Low', value: '3', label: 'sort' },
    { key: 'New arrivals', value: '4', label: 'sort' },
  ]
  // boostScoreFilters: Array<any> = [
  //   { key: 'High to Low', value: '3', label: 'boostScore' },
  //   { key: 'Low to High', value: '4', label: 'boostScore' }
  // ]
  visibleFilters: Array<any> = [
    { key: 'Visible products', value: '0', label: 'visibility' },
    { key: 'Invisible products', value: '1', label: 'visibility' }
  ]
  base: string = environment.base
  domainUrl: string = ''
  exportModalRef?: BsModalRef;
  importModalRef?: BsModalRef;
  importFile: any;
  importDetails: any

  fileImport: FormControl = new FormControl()
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
  checkedProducts: Array<string> = []
  isDownloading: boolean = false
  basicFields: Array<string> = ['name', 'sku', 'type', 'stock', 'isActive', 'isVisible', 'boostScore', 'originalPrice', 'storePrice']

  constructor(
    private BrandService: BrandService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private ActivatedRoute: ActivatedRoute,
    private BsModalService: BsModalService,
    private HttpClient: HttpClient,
    private Router: Router,
    private HotToastService: HotToastService
  ) { }

  getProductSlug(productId: string) {
    return `${this.domainUrl}p/${encodeURIComponent(productId)}`
  }

  openExport(template: TemplateRef<any>) {
    this.exportModalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered modal-sm',
      ignoreBackdropClick: true,
    });
  }

  openImport(template: TemplateRef<any>) {
    this.importModalRef = this.BsModalService.show(template, {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  fileChange(event: any) {
    this.importFile = event.target.files[0]
    this.fileImport.setValue(this.importFile)
    // Check if the file size is less than 15MB
    if (this.importFile.size > 15 * 1024 * 1024) {
      this.HotToastService.error('File size should be less than 15MB')
      this.importFile = null
      this.fileImport.setValue(null)
    }
    this.ChangeDetectorRef.markForCheck()
  }

  fileSize(file: any) {
    // Convert bytes to MB
    // If the file size is less than 1MB, return the file size in bytes
    if (file < 1 * 1024 * 1024) {
      return file.toFixed(2) + ' bytes'
    } else {
      return (file / 1024 / 1024).toFixed(2) + ' MB'
    }
  }

  removeFile() {
    this.fileImport.setValue(null)
    this.importFile = null
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
          this.Router.navigate([`${appRoutes.bulk.import}/${res?.result?.importId}`])
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

  formatProductType(docType: string) {
    return docType && (docType.charAt(0).toUpperCase() + docType.slice(1)).replace('-', ' ')
  }

  getProducts() {
    // Get selected category names for compatibility with existing code
    const categoryItems = this.categoryItems.map((item: any) => item.name);
    let brandItems = this.brandItems.map((item: any) => item.name); // Get brand names

    const payload = {
      brand: brandItems,
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
    };

    this.ProductService.searchProducts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data;
        this.totalResults = res?.result?.totalResults;
        this.totalPages = res?.result?.totalPages;
        this.page = res?.result?.page;
        this.loaded = true;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }


  onCategoryTriggered() {
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      // Map selected IDs to full category objects
      this.categoryItems = this.categories.filter(cat =>
        this.selectedCategories.includes(cat._id)
      );
    } else {
      this.categoryItems = [];
    }
    this.getProducts();
  }

  onBrandTriggered() {
    if (this.selectedBrands && this.selectedBrands.length > 0) {
      // Map selected IDs to full brand objects
      this.brandItems = this.brands.filter(brand =>
        this.selectedBrands.includes(brand._id)
      );
    } else {
      this.brandItems = [];
    }
    this.getProducts();
  }

  // Add brand removal method
  onBrandRemoved(brand: any) {
    this.selectedBrands = this.selectedBrands.filter(id => id !== brand._id);
    this.brandItems = this.brandItems.filter(item => item._id !== brand._id);
    this.getProducts();
  }
  // Update category removal
  onCategoryRemoved(category: any) {
    this.selectedCategories = this.selectedCategories.filter(id => id !== category._id);
    this.categoryItems = this.categoryItems.filter(item => item._id !== category._id);
    this.getProducts();
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
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.categoryItems = [];
    this.brandItems = [];
    this.page = 1
    this.limit = 20
    this.categoryItems = []
    this.getProducts()
  }

  updateProduct(event: { switchId: string, toggleState: boolean }) {
    this.ProductService.updateProductStatus({ _id: event.switchId, isActive: event.toggleState }).subscribe({
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


  onSelectProducts(type: string, productId: string,) {
    if (type == 'all') {
      if (this.checkedProducts.length == this.products.length) {
        this.checkedProducts = []
      } else {
        this.checkedProducts = this.products.map((product: any) => product.sku)
      }
    } else {
      if (this.checkedProducts.includes(productId)) {
        this.checkedProducts = this.checkedProducts.filter((product: any) => product != productId)
      } else {
        this.checkedProducts.push(productId)
      }
    }
    this.page = 1
    this.getProducts()
    this.ChangeDetectorRef.markForCheck()
  }

  deleteProducts() {
    this.ProductService.deleteProducts({ products: this.checkedProducts }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.checkedProducts = [];
          this.page = 1
          this.HotToastService.success(res?.message)
          this.getProducts()
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  downloadSampleFile() {
    this.isDownloading = true;
    const filePath: string = `/admin/assets/files/storeDadaSampleProducts.csv`
    this.HttpClient.get(filePath, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          const filename = filePath.split('/').pop() || 'download.csv';
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error('Download failed:', error);
        }
      );
  }
}
