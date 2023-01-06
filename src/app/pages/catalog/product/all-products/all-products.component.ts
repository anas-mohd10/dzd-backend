import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  appRoute = appRoutes
  products: any
  productform: any;

  //Page and limit for query
  page: any = 1;
  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  limit: any = 8;
  selectedpage: any = 1
  max: any = 3

  //Total no. of data from backend
  totalcount: any;
  totaldata: any;
  count: any = 0
  showFilter: boolean = false;
  category: any;

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any
  categories: any;
  base: string;

  loaded: boolean = false

  constructor(
    private cdr: ChangeDetectorRef,
    private ProductService: ProductService,
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base

    this.ProductService.searchProducts(this.productform.value, this.page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        for (let _product of this.products) {
          const diff = _product?.price?.mrp - _product.price?.offer
          const percentage_off = Math.round((diff / _product?.price?.mrp) * 100)
          const message = {
            text: `${percentage_off} % off`,
          }
          _product['message'] = message
        }
        this.count = this.products.length
        this.totalcount = res?.result?.total_item
        this.limit = res?.result?.items_per_page
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.loaded = true
      }
    })

    this.CategoryService.getAllSubcategories({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result
        this.cdr.markForCheck();
      }
    })
  }

  initForm() {
    this.productform = this.formBuilder.group({
      name: [''],
      isActive: [''],
      category: ['']
    });
  }

  searchProduct() {
    this.currpage = 1
    let filters = { ...this.productform.value }
    filters['category'] = this.category
    this.ProductService.searchProducts(filters, this.page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        for (let _product of this.products) {
          const diff = _product?.price?.mrp - _product.price?.offer
          const percentage_off = Math.round((diff / _product?.price?.mrp) * 100)
          const message = {
            text: `${percentage_off} % off`,
          }
          _product['message'] = message
        }
        this.count = this.products.length
        this.totalcount = res?.result?.total_item
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
        this.loaded = true
      }
    })
  }

  selectCategory(id: any) {
    this.category = id
    this.searchProduct()
  }

  fetchProduct(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.productform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.productform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.productform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.productform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.productform.value, this.currpage, this.limit)
      } else {
        this.getData(this.productform.value, this.currpage, this.limit)
      }
    }
  }

  getData(data: any, page: any, limit: any) {
    this.ProductService.searchProducts(data, page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        for (let _product of this.products) {
          const diff = _product?.price?.mrp - _product.price?.offer
          const percentage_off = Math.round((diff / _product?.price?.mrp) * 100)
          const message = {
            text: `${percentage_off} % off`,
          }
          _product['message'] = message
        }
        this.count = this.products.length
        this.cdr.markForCheck();
        this.loaded = true
      }
    })
    this.isNext = true
  }

  setPages() {
    this.currpage = 1
    this.selectedpage = 1
    this.pages.length = 0
    if (this.totaldata > 3) {
      for (let i = 1; i <= this.max; i++) {
        this.pages.push(i)
      }
    } else {
      for (let i = 1; i <= this.totaldata; i++) {
        this.pages.push(i)
      }
    }
  }

  onReload() {
    this.productform.get('name')?.setValue('')
    this.productform.get('isActive')?.setValue('')
    this.productform.get('isFeatured')?.setValue('')
    this.productform.get('category')?.setValue('')
    
    this.searchProduct()
  }

  showFilters() {
    this.showFilter = !this.showFilter
    // let bodyEl = document.querySelector('body');
    // bodyEl?.classList.toggle('overflow-hidden')
  }

  hideFilters() {
    this.showFilter = !this.showFilter
    // let bodyEl = document.querySelector('body');
    // bodyEl?.classList.toggle('overflow-hidden')
  }

}
