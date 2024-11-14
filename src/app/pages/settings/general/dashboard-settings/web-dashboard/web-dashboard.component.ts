import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DashboardService } from 'src/app/includes/services/dashboard.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/includes/services/product.service';
import { environment } from 'src/environments/environment.prod';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/includes/services/category.service';

@Component({
  selector: 'app-web-dashboard',
  templateUrl: './web-dashboard.component.html',
  styleUrls: ['./web-dashboard.component.scss'],
})
export class WebDashboardComponent implements OnInit {
  dashboard: Array<any> = [];
  routes = appRoutes;
  settings: any = {};
  base: string = environment.base;
  collectionForm!: FormGroup;
  collectionFileString: string = '';
  collectionFileName: string = '';
  product: FormControl = new FormControl('');
  searchProducts: Array<any> = [];
  searchCategories: Array<any> = [];
  products: Array<any> = [];
  productDetails: Array<any> = [];
  categories: Array<any> = [];
  categoryDetails: Array<any> = [];
  collectionDetails: any;
  isCollectionEdit: boolean = false;
  productsData: Array<any> = [];
  liveDashboardData: any = {};
  category: FormControl = new FormControl('');
  isLimitExceeded: boolean = false;
  categoryIndex: number;
  refItems: any = {};

  constructor(
    private DashboardService: DashboardService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private Router: Router,
    private DomSanitizer: DomSanitizer,
    private ProductService: ProductService,
    private CollectionService: CollectionService,
    private ToastrService: ToastrService,
    private CategoryService: CategoryService
  ) {}

  @ViewChild('previewFrame', { static: true }) myIframe: ElementRef;
  iframeSrc: SafeResourceUrl = this.DomSanitizer.bypassSecurityTrustResourceUrl(
    'https://demo.StoreDada.com/'
  );

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
        }
      }
    );

    this.DashboardService.getDashboardConfig().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        let data = res?.result.pop();
        this.refItems = data?.items;
        this.ChangeDetectorRef.markForCheck();
      }
    });

    this.DashboardService.getWebDashboard().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.liveDashboardData = res?.Data;
        this.dashboard = res?.Data?.home_details;
        for (let _item of this.dashboard) {
          switch (_item?.type) {
            case 'category':
              this.categoryIndex = this.dashboard.indexOf(_item);
              for (let _category of _item?.category_items) {
                this.categoryDetails.push({
                  name: _category?.text?.text,
                  slug: _category?.params?.slug,
                  catid: _category?.params?.catid,
                  file: _category?.image,
                  style: _category?.style,
                });
              }
              for (let _category of this.categoryDetails)
                this.categories.push(_category?.catid);
              break;
          }
        }
        this.ChangeDetectorRef.markForCheck();
      }
    });

    this.collectionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      subname: new FormControl(''),
      type: new FormControl('slider'),
      isFeatured: new FormControl(true),
    });
  }

  get collectionFormControl() {
    return this.collectionForm.controls;
  }

  drop(event: CdkDragDrop<string[]>) {
    let dashboard = [...this.dashboard];
    moveItemInArray(dashboard, event.previousIndex, event.currentIndex);
    this.dashboard = [...dashboard];
    for (let _item of this.dashboard) {
      switch (_item?.type) {
        case 'category':
          this.categoryIndex = this.dashboard.indexOf(_item);
          break;
      }
    }
  }

  navigateBack() {
    window.history.back();
  }

  publish() {
    let referenceItems = {
      categories: this.categories,
      collections: this.refItems?.collections,
      brands: this.refItems?.brands,
    };

    let payload = {
      dashboard: JSON.stringify(this.dashboard),
      items: referenceItems,
    };

    this.DashboardService.publishDashboard(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        window.open(this.settings.domain, '_blank');
        document.location.reload();
      }
    });
  }

  preview() {
    this.DashboardService.previewDashboard({
      dashboard: JSON.stringify(this.dashboard),
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        const iframeElement: HTMLIFrameElement = this.myIframe.nativeElement;
        iframeElement.src = iframeElement.src;
      }
    });
  }

  discard() {
    this.DashboardService.getWebDashboard().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.dashboard = res?.Data?.home_details;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  //Category Management Starts
  searchCategory() {
    if (this.category.value) {
      this.CategoryService.findCategories({
        keyword: this.category.value,
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.searchCategories = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      });
    } else {
      this.searchCategories = [];
    }
  }

  selectCategory(category: any) {
    if (!this.categories.includes(category?.catid)) {
      if (this.categories.length < 7) {
        this.categoryDetails.push(category);
        this.categories.push(category?.catid);
      } else {
        this.ToastrService.error(
          'The operation could not be completed because the maximum limit has been reached'
        );
      }
    } else {
      this.categoryDetails = this.categoryDetails.filter(
        (item: any) => item.catid != category?.catid
      );
      this.categories = this.categories.filter(
        (item: any) => item != category?.catid
      );
    }
  }

  dropCategory(event: CdkDragDrop<string[]>) {
    let categories = [...this.categoryDetails];
    moveItemInArray(categories, event.previousIndex, event.currentIndex);
    this.categoryDetails = [...categories];
  }

  manageCategory() {
    if (this.categories.length > 0) {
      this.categories = [];
      let categoryDetails = [];
      for (let _category of this.categoryDetails) {
        categoryDetails.push({
          text: { text: _category?.name },
          params: { slug: _category?.slug, catid: _category?.catid },
          id: categoryDetails.length,
          image: _category?.file,
          action: '',
          type: 1,
          style: {
            background: _category?.style?.background,
            border: _category?.style?.border,
            radius: _category?.style?.radius,
          },
        });

        this.categories.push(_category?.catid);
      }

      this.dashboard[this.categoryIndex] = {
        type: 'category',
        category_items: categoryDetails,
        title: {
          text: 'Browse All Categories',
          color: '0xff000000',
          'font-weight': 8,
        },
        button: {
          label: {
            text: 'View More',
            color: '0xff00bdab',
            font: 'Sen',
            'font-style': 0,
            'font-size': 16,
            'font-weight': 4,
          },
          bgcolor: ['0xff00bdab'],
          type: 1,
        },
        Displaystatus: true,
      };

      this.ChangeDetectorRef.markForCheck();
    } else {
      this.ToastrService.error(
        'The operation could not be completed because a minimum of 1 item is required'
      );
    }
  }
  //Category Management Ends

  //Collection management starts
  editCollection(slug: any) {
    this.isCollectionEdit = true;
    this.CollectionService.getCollectionBySlug(slug).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.collectionDetails = res?.result[0];
        for (let _key of Object.keys(res?.result[0]))
          this.collectionForm.get(_key)?.setValue(res?.result[0][_key]);
        this.productDetails = res?.result[0]?.products;
        for (let _product of this.productDetails)
          this.products.push(_product?._id);
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  getProducts() {
    if (this.product.value) {
      this.ProductService.findProducts({ name: this.product.value }).subscribe(
        (res: any) => {
          if (res?.errorCode == 0) {
            this.searchProducts = res?.result;
            this.ChangeDetectorRef.markForCheck();
          }
        }
      );
    } else {
      this.searchProducts = [];
    }
  }

  selectProduct(product: any) {
    if (!this.products.includes(product?._id)) {
      this.productDetails.push(product);
      this.products.push(product?._id);
    } else {
      this.productDetails = this.productDetails.filter(
        (item: any) => item?._id != product?._id
      );
      this.products = this.products.filter((item: any) => item != product?._id);
    }
  }

  dropProduct(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails];
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = [...products];
  }

  closeCollectionModal() {
    this.collectionDetails = null;
    this.isCollectionEdit = false;
  }

  manageCollection() {
    if (!this.collectionForm.valid) {
      return;
    }
    let selectedProducts = [];
    for (let product of this.productDetails)
      selectedProducts.push(product?._id);
    let payload = { ...this.collectionForm.value, products: selectedProducts };

    switch (this.isCollectionEdit) {
      case true:
        payload['colid'] = this.collectionDetails?.colid;
        payload['style'] = this.collectionDetails?.style;
        payload['isActive'] = this.collectionDetails?.isActive;
        payload['isDelete'] = this.collectionDetails?.isDelete;
        payload['slug'] = this.collectionDetails?.slug;
        payload['banner'] = this.collectionDetails?.banner;
        this.CollectionService.updateCollection(payload).subscribe(
          (res: any) => {
            if (res?.errorCode == 0) {
              this.ToastrService.success(res?.message);
              this.closeCollectionModal();
            } else {
              this.ToastrService.error(res?.message);
            }
          }
        );
        break;
      case false:
        this.CollectionService.addCollection(payload).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.ProductService.getProductWebData({
              products: res?.result?.products,
            }).subscribe((resData: any) => {
              if (resData?.errorCode == 0) {
                this.ToastrService.success(res?.message);
                this.addCollectionToDashboard(res?.result, resData?.result);
                this.ChangeDetectorRef.markForCheck();
              }
            });
          } else {
            this.ToastrService.error(res?.message);
          }
        });
        break;
    }
  }

  addCollectionToDashboard(collection: any, products: any) {
    this.dashboard.push({
      cover: '',
      title: {
        text: collection?.name,
        color: collection?.style?.color,
        'font-weight': 8,
      },
      subtitle: {
        text: collection?.subname,
        color: collection?.style?.color,
        'font-weight': 8,
      },
      product_items: products,
      button: {
        label: {
          text: 'View More',
          color: '#ffffff',
          'font-style': 0,
          'font-size': 16,
          'font-weight': 4,
        },
        bgcolor: ['0xFFbe1e2d'],
        type: 1,
        params: {
          action: '',
          colid: collection?.colid,
          slug: collection?.slug,
        },
        action: '',
      },
      type: 'product',
      Displaystatus: true,
    });
  }
  //Collection management ends
}
