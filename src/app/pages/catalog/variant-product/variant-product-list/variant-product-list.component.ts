import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../includes/services/product.service';
import { VariantProductService } from 'src/app/includes/services/variant.product.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-variant-product-list',
  templateUrl: './variant-product-list.component.html',
  styleUrls: ['./variant-product-list.component.scss'],
})
export class VariantProductListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};

  appRoute = appRoutes;
  slug: any;
  products: any;
  product: any
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

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any
  product_id: any;
  base: string;

  constructor(
    private route: ActivatedRoute,
    private ProductService: ProductService,
    private variantProductService: VariantProductService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })
    this.initForm()
    this.slug = this.route.snapshot.queryParams.product || '';

    this.ProductService.getProductBySlug(this.slug).subscribe((res: any) => {
      const product = res?.result[0]
      this.product_id = product?.prodid
      this.product = product?.name

      this.variantProductService.searchVariantProducts(product?.prodid, 1, {}).subscribe((res: any) => {
        this.products = res?.result?.data
        this.count = this.products.length
        this.totalcount = res?.result?.total_item
        this.limit = res?.result?.items_per_page
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
      });
    });
  }

  initForm() {
    this.productform = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
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
    this.productform.get('isFeatured')?.setValue('')
    this.searchProduct()
  }

  searchProduct() {
    this.currpage = 1
    this.variantProductService.searchVariantProducts(this.product_id, this.page, this.productform.value).subscribe((res: any) => {
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
    this.variantProductService.searchVariantProducts(this.product_id, this.page, this.productform.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.count = this.products.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
