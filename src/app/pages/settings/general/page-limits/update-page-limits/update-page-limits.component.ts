import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { PageLimitsService } from 'src/app/includes/services/page.limits.service'
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-page-limits',
  templateUrl: './update-page-limits.component.html',
  styleUrls: ['./update-page-limits.component.scss']
})
export class UpdatePageLimitsComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  pagelimitform: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean;
  limit: any = 8;
  page: any = 1
  base: any
  slug: any
  pagelimits: any = []

  brands: any;
  brandscount: any
  isBrandSelected: any = false
  selectedBrand: any

  categories: any;
  categoriescount: any
  isCategorySelected: any = false
  selectedCategory: any

  collections: any;
  collectionscount: any
  isCollectionSelected: any = false
  selectedCollection: any

  products: any;
  productscount: any
  isProductSelected: any = false
  selectedProduct: any

  constructor(
    private formBuilder: FormBuilder,
    private BrandService: BrandService,
    private CategoryService: CategoryService,
    private ProductService: ProductService,
    private CollectionService: CollectionService,
    private cdr: ChangeDetectorRef,
    private PageLimitsService: PageLimitsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initform()
    this.managePage()
    this.base = environment.base
    this.slug = this.route.snapshot.queryParams.id || ''

    this.BrandService.searchBrand({ isActive: true, isDelete: false }, this.page).subscribe((res: any) => {
      this.brands = res?.result?.data
      this.brandscount = res?.result?.total
      this.cdr.markForCheck();
    });

    this.CategoryService.getMainCategories().subscribe((res: any) => {
      this.categories = res?.result
      this.categoriescount = this.categories.length
      this.cdr.markForCheck();
    });

    this.ProductService.searchProducts({ isActive: true, isDelete: false }, this.page, this.limit).subscribe((res: any) => {
      this.products = res?.result?.data
      this.productscount = res?.result?.total
      this.cdr.markForCheck();
    });

    this.CollectionService.searchCollection({ isActive: true, isDelete: false }, this.page, this.limit).subscribe((res: any) => {
      this.collections = res?.result?.data
      this.collectionscount = res?.result?.total
      this.cdr.markForCheck();
    });

    this.PageLimitsService.getPageLimit(this.slug).subscribe((res: any) => {
      this.pagelimits = res?.result[0]
      this.selectedBrand = res?.result[0]?.brands.selecteditem._id
      this.selectedCategory = res?.result[0]?.categories.selecteditem._id
      this.selectedProduct = res?.result[0]?.products.selecteditem._id
      this.selectedCollection = res?.result[0]?.collections.selecteditem._id
      this.pagelimitform.get('brandlimit')?.setValue(res?.result[0]?.brands.pagelimit)
      this.pagelimitform.get('categorylimit')?.setValue(res?.result[0]?.categories.pagelimit)
      this.pagelimitform.get('productlimit')?.setValue(res?.result[0]?.products.pagelimit)
      this.pagelimitform.get('collectionlimit')?.setValue(res?.result[0]?.collections.pagelimit)
      this.cdr.markForCheck();
    })
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  initform() {
    this.pagelimitform = this.formBuilder.group({
      categorylimit: [''],
      brandlimit: [''],
      collectionlimit: [''],
      productlimit: [''],
    })
  }

  selectedItem(type: any, value: any) {
    if (type === "brand") {
      if (this.isBrandSelected == true) {
        if (value == this.selectedBrand) {
          this.isBrandSelected = false
          this.selectedBrand = ''
        } else {
          this.isBrandSelected = true
          this.selectedBrand = value
        }
      } else {
        this.isBrandSelected = true
        this.selectedBrand = value
      }
    } else if (type === "category") {
      if (this.isCategorySelected == true) {
        if (value == this.selectedCategory) {
          this.isCategorySelected = false
          this.selectedCategory = ''
        } else {
          this.isCategorySelected = true
          this.selectedCategory = value
        }
      } else {
        this.isCategorySelected = true
        this.selectedCategory = value
      }
    } else if (type === "product") {
      if (this.isProductSelected == true) {
        if (value == this.selectedProduct) {
          this.isProductSelected = false
          this.selectedProduct = ''
        } else {
          this.isProductSelected = true
          this.selectedProduct = value
        }
      } else {
        this.isProductSelected = true
        this.selectedProduct = value
      }
    } else if (type === "collection") {
      if (this.isCollectionSelected == true) {
        if (value == this.selectedCategory) {
          this.isCollectionSelected = false
          this.selectedCollection = ''
        } else {
          this.isCollectionSelected = true
          this.selectedCollection = value
        }
      } else {
        this.isCollectionSelected = true
        this.selectedCollection = value
      }
    }
  }

  onSubmit() {
    const data = {
      brands: {
        pagelimit: this.pagelimitform.get('brandlimit')?.value,
        selecteditem: this.selectedBrand
      },
      products: {
        pagelimit: this.pagelimitform.get('productlimit')?.value,
        selecteditem: this.selectedProduct
      },
      collections: {
        pagelimit: this.pagelimitform.get('collectionlimit')?.value,
        selecteditem: this.selectedCollection
      },
      categories: {
        pagelimit: this.pagelimitform.get('categorylimit')?.value,
        selecteditem: this.selectedCategory
      }
    }

    console.log(data);

    this.PageLimitsService.updatePageLimit(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else {
        this.toastr.success('Settings updated successfully');
        this.router.navigate([this.appRoute.pageLimits.PAGE_LIMITS_LIST]);
      }
    })
  }
}
