import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

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
  base: string;
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
  category: FormControl = new FormControl('')
  categoryItems: Array<any> = []
  isTableView: boolean = true;
  activeAccordion: string = 'category';
  isFilters: boolean = false;
  totalResults: any;
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

  sortFilters: Array<any> = [
    { key: 'Price : High to Low', value: '0', label: 'sort' },
    { key: 'Price : Low to High', value: '1', label: 'sort' }
  ]

  visibleFilters: Array<any> = [
    { key: 'Visible products', value: '0', label: 'visibility' },
    { key: 'Invisible products', value: '1', label: 'visibility' }
  ]

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private ActivatedRoute: ActivatedRoute,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
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

    this.getProducts()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  formdateDate(date: any) {
    return `${this.months[new Date(date).getMonth()]} ${new Date(date).getDate()} ${new Date(date).getFullYear()}`
  }

  changeView(type: string) {
    if (type == 'grid') {
      this.isTableView = false
    } else {
      this.isTableView = true
    }
  }

  getProducts() {
    let categoryItems = this.categoryItems.map((item: any) => item.catid)
    const payload = {
      name: this.name?.value,
      isActive: this.isActive?.value,
      isFeatured: this.isFeatured?.value,
      isVisible: this.isVisible?.value,
      stock: this.stock?.value,
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
    let categoryDetails = this.categories.filter((category: any) => category.catid == this.productCategory.value)
    !this.categoryItems.includes(categoryDetails[0]) ? this.categoryItems.push(categoryDetails[0]) : this.categoryItems = this.categoryItems.filter(item => item.catid !== this.productCategory.value)
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
    this.page = 1
    this.limit = 20
    this.categoryItems = []
    this.getProducts()
  }

  updateProduct(event: { switchId: string, toggleState: boolean }) {
    this.ProductService.updateProduct(event.switchId, { slug: event.switchId, isActive: event.toggleState }).subscribe({
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
      case 'category':
        let categoryDetails = this.categories.filter((category: any) => category.catid == this.productCategory.value)
        !this.categoryItems.includes(categoryDetails[0]) ? this.categoryItems.push(categoryDetails[0]) : this.categoryItems = this.categoryItems.filter(item => item.catid !== this.productCategory.value)
        break
    }

    this.getProducts()
  }
}
