import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  appRoute = appRoutes;
  products: any;
  productform: any;
  variantProductform: any;
  base: any

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

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any

  showVariants: Boolean = false
  variantproduct: any

  variantProducts: any = [];
  productName: String = ''
  productProdid: any = null
  variantTotalcount: any
  variantLastPage: Boolean = false
  variantPage: Number = 1;
  variantPageLimit: FormControl = new FormControl('20')
  settings: any = {}

  variantPages: any = []
  vairnatNextPages: any = []
  variantCurrpage: any = 1;
  variantLimit: any = 8;
  variantSelectedpage: any = 1
  variantMax: any = 3

  variantTotalCount: any;
  variantTotalData: any;
  variantCount: any = 0
  prodid: any;
  categories: any = [];

  showFilter: Boolean = false
  category: any;
  inputText: any = 'name';
  isUpdateModal: Boolean = false
  sendId: any
  isClose: any
  checkstatus: boolean = true;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ProductHeadService: ProductHeadService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })
    this.initForm()

    this.ProductHeadService.searchProductHead(this.productform.value, this.page).subscribe((res: any) => {
      this.products = res?.result?.data
      this.count = this.products.length
      this.totalcount = res?.result?.total_item
      this.limit = res?.result?.items_per_page
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.setPages()
      this.cdr.markForCheck();
    });

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })

    this.CategoryService.getMainCategories().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result
        this.cdr.markForCheck();
      }
    })
  }

  closeEventHandler($event: any) {
    console.log($event);
    this.isUpdateModal = false
    this.isClose = $event
    console.log(this.isClose), "close";
  }

  initForm() {
    this.productform = this.formBuilder.group({
      name: [''],
      isActive: [''],
      category: ['']
    });

    this.variantProductform = new FormGroup({
      name: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });
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
    this.searchProduct()
  }

  searchProduct() {
    this.currpage = 1
    let filters = { ...this.productform.value }
    filters['category'] = this.category
    this.ProductHeadService.searchProductHead(filters, this.page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.count = this.products.length
        this.totalcount = res?.result?.total_item
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
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
    this.ProductHeadService.searchProductHead(data, page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.count = this.products.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }

  getProducts(name: any, prodid: any) {
    this.showVariants = !this.showVariants;
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
    this.productName = name
    this.productProdid = prodid
    this.searchProducts()
    this.cdr.markForCheck();
  }

  searchProducts() {
    let payload = {
      ...this.variantProductform.value,
      parent: this.productProdid,
      page: this.variantPage,
      limit: this.variantPageLimit?.value
    }
    this.productService.searchProducts(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.variantProducts = res?.result?.data
        this.variantTotalcount = res?.result?.total_item
        this.variantLastPage = res?.result?.lastPage
        this.variantPage = res?.result?.page
        this.cdr.markForCheck();
      }
    })
  }

  getProductOffers() {
    for (let _product of this.variantProducts) {
      const diff = _product?.price?.mrp - _product.price?.offer
      const percentage_off = Math.round((diff / _product?.price?.mrp) * 100)
      const message = {
        text: `${percentage_off} % off`,
      }
      _product['message'] = message
    }
  }

  getPreviousPage() {

  }

  getNextPage() {

  }

  setVariantPages() {
    this.variantCurrpage = 1
    this.variantSelectedpage = 1
    this.variantPages.length = 0
    if (this.variantTotalData > 3) {
      for (let i = 1; i <= this.variantMax; i++) {
        this.variantPages.push(i)
      }
    } else {
      for (let i = 1; i <= this.variantTotalData; i++) {
        this.variantPages.push(i)
      }
    }
  }

  hideVariantProducts() {
    this.showVariants = !this.showVariants;
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
  }

  navigateToAdd() {
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
    this.Router.navigate([this.appRoute.product.ADD_PRODUCT], { queryParams: { id: this.productProdid } })
  }

  navigateToUpdate(id: any) {
    this.inputText = "edit"
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
    this.Router.navigate([this.appRoute.product.UPDATE_PRODUCT], { queryParams: { id: id } })
  }

  clearVariantFilters() {
    this.variantProductform.get('name')?.setValue('')
    this.variantProductform.get('isActive')?.setValue('')
    this.variantProductform.get('isFeatured')?.setValue('')
    this.variantPage = 1
    this.variantPageLimit?.setValue('20')
    this.searchProducts()
  }

  showFilters() {
    this.showFilter = !this.showFilter
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
  }

  hideFilters() {
    this.showFilter = !this.showFilter
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
  }

  openModal(id: any) {
    this.isUpdateModal = true
    this.sendId = id
  }
}
