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
import { ToastrService } from 'ngx-toastr';

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

  form: FormGroup
  productForm: FormGroup
  modalRef?: BsModalRef
  productRef?: BsModalRef
  productDetails: any = {}
  base: string = environment.base
  settings: any = {}
  categories: Array<any> = []

  constructor(
    private ProductService: ProductService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ProductHeadService: ProductHeadService,
    private CategoryService: CategoryService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService,
    private ToastrService: ToastrService
  ) { }

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
    this.productForm.reset()
    this.productPage = 1
    this.productLimit?.setValue('20')
    this.getProducts()
  }

  open(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.modalRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered' });
  }

  close() {
    this.modalRef?.hide()
    this.productDetails = {}
  }

  openProducts(template: TemplateRef<any>, productDetails: any) {
    this.productDetails = productDetails
    this.productRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered' });
  }

  closeProducts() {
    this.productRef?.hide()
    this.productDetails = {}
  }
}
