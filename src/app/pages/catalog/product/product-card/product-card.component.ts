import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  appRoute = appRoutes;
  products: any;
  productForm: any;
  base: any
  len: any;
  count: any;
  pages: any = [];
  page: any = 1;
  limit: any = 4;
  datalength: any;
  isPreviousExist: boolean = false;
  currPage: any;
  isNextExist: boolean = true;
  isData: boolean = true;
  selectedPage: any = 1;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.base = environment.base
    this.getProduct()
    this.initForm()
    this.productService.getProductsCount().subscribe((res: any) => {
      this.pages.length = 0
      this.datalength = res?.result
      this.cdr.markForCheck();
      this.count = Math.ceil((res?.result) / this.limit)
      for (let i = 1; i <= this.count; i++) {
        this.pages.push({
          key: i,
        })
      }
    })
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.products = res?.result;
          this.cdr.markForCheck();
          break;
      }
    });
  }
  onReload() {
    window.location.reload()
  }

  onChange() {
    this.productService.searchProducts(this.productForm.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.products = res?.result?.data
        this.cdr.markForCheck();
        this.isData = true
        if (this.products.length == 0) {
          this.isData = false
        }
        this.pages.length = 0
        this.count = Math.ceil(res?.result?.total / this.limit)
        for (let i = 1; i <= this.count; i++) {
          this.pages.push({
            key: i,
          })
        }
      }
    })
  }

  //Pagination fetch data
  fetchByPage(page: any) {
    this.selectedPage = page
    this.fetchData(this.productForm.value, page, this.limit)
  }

  fetchByLimit(e: any) {
    this.limit = e.value
    this.fetchData(this.productForm.value, this.page, this.limit)
  }

  fetchData(data: any, page: any, limit: any) {
    this.productService.searchProducts(data, page, limit).subscribe((res: any) => {
      this.products = res?.result.data
      this.pages.length = 0
      this.isData = true
      if (this.products.length == 0) {
        this.isData = false
      }
      this.cdr.markForCheck();
      this.count = Math.ceil(res?.result?.total / this.limit)
      for (let i = 1; i <= this.count; i++) {
        this.pages.push({
          key: i,
        })
      }
    })
  }
}

