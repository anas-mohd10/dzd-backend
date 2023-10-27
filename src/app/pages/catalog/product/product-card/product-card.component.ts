import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  appRoute = appRoutes;
  products: Array<any> = [];
  productform: any;
  variantProductform: any;
  base: any

  showVariants: Boolean = false
  variantproduct: any

  variantProducts: any = [];
  productName: String = ''
  productProdid: any = null
  variantTotalcount: any
  variantLastPage: Boolean = false
  variantPage: number = 1;
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
  inputText: any = 'name';
  isUpdateModal: Boolean = false
  sendId: any
  isClose: any
  checkstatus: boolean = true;


  isActive: FormControl = new FormControl('')
  keyword: FormControl = new FormControl('')
  limit: FormControl = new FormControl('20')
  category: FormControl = new FormControl('')
  page: number = 1
  lastPage: Boolean = false

  modalRef?: BsModalRef
  productDetails: any = {}

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ProductHeadService: ProductHeadService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.initForm()
    this.getHeads()

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.cdr.markForCheck();
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
    this.variantProductform = new FormGroup({
      name: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });
  }

  getNextPage() {
    this.page += 1
    this.getHeads()
  }

  getPreviousPage() {
    this.page -= 1
    this.getHeads()
  }

  clearFilters() {
    this.keyword.setValue('')
    this.limit.setValue('20')
    this.category.setValue('')
    this.isActive.setValue('')
    this.page = 1
    this.getHeads()
  }

  getHeads() {
    let payload = {
      limit: this.limit.value,
      page: this.page,
      keyword: this.keyword.value,
      isActive: this.isActive.value,
      category: this.category.value
    }

    this.ProductHeadService.searchProductHead(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.cdr.markForCheck()
      }
    })
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

  getVariantPreviousPage() {
    this.variantPage -= 1
    this.searchProducts()
  }

  getVariantNextPage() {
    this.variantPage += 1
    this.searchProducts()
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

  open(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' });
  }

  close() {
    this.modalRef?.hide()
    this.productDetails = {}
  }
}
