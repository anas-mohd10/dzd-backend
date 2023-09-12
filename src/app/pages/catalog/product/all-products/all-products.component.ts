import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  appRoute = appRoutes
  products: Array<any> = []
  productform: any;

  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  selectedpage: any = 1
  max: any = 3
  totalcount: any;
  totaldata: any;
  count: any = 0
  showFilter: boolean = false;
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true
  filters: any = [];
  show: any;
  shifted: any
  categories: any;
  base: string;
  loaded: boolean = false

  settings: any = {}
  page: any = 1;
  type: String = ''
  name: FormControl = new FormControl('')
  limit: FormControl = new FormControl('20')
  isActive: FormControl = new FormControl('')
  isFeatured: FormControl = new FormControl('')
  stock: FormControl = new FormControl('')
  category: FormControl = new FormControl('')
  lastPage: Boolean = false

  isTableView: boolean = false

  constructor(
    private cdr: ChangeDetectorRef,
    private ProductService: ProductService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.type = this.ActivatedRoute.snapshot.queryParams.type || ''

    switch (this.type) {
      case 'out-of-stock':
        this.stock?.setValue(0)
        break
      case 'inactive-products':
        this.isActive?.setValue('false')
        break
    }

    this.getProducts()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.CategoryService.getAllSubcategories({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result
        this.cdr.markForCheck();
      }
    })
  }

  changeView(type: string) {
    if (type == 'grid') {
      this.isTableView = false
    } else {
      this.isTableView = true
    }
  }

  getProducts() {
    const payload = {
      name: this.name?.value,
      isActive: this.isActive?.value,
      isFeatured: this.isFeatured?.value,
      stock: this.stock?.value,
      page: this.page,
      limit: this.limit?.value
    }

    this.ProductService.searchProducts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.getProductOffers()
        this.totalcount = res?.result?.total_item
        this.lastPage = res?.result?.lastPage
        this.page = res?.result?.page
        this.loaded = true
        this.cdr.markForCheck();
      }
    })
  }

  getProductOffers() {
    for (let _product of this.products) {
      const diff = _product?.price?.mrp - _product.price?.selling
      const percentage_off = Math.round((diff / _product?.price?.mrp) * 100)
      const message = {
        text: `${percentage_off} % off`,
      }
      _product['message'] = message
    }
  }

  getNextPage() {
    this.page += 1
    this.getProducts()
  }

  getPreviousPage() {
    this.page -= 1
    this.getProducts()
  }

  onReload() {
    this.isActive?.setValue('')
    this.category?.setValue('')
    this.isFeatured?.setValue('')
    this.stock?.setValue('')
    this.name?.setValue('')
    this.getProducts()
    this.Router.navigate([this.appRoute.product.ALL_PRODUCTS])
  }

  hideFilters() { }

  showFilters() { }
}
