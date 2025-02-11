import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss'],
})
export class AddCollectionComponent implements OnInit {
  form: FormGroup;
  appRoute = appRoutes;
  products: Array<any> = [];
  isSubmitted: boolean = false;
  page: number = 1;
  selectedProducts: any = [];
  product: FormControl = new FormControl('');
  productSku: FormControl = new FormControl('');
  searchProducts: Array<any> = [];
  isAutoCompleteEnabled: boolean = true;
  productIds: Array<any> = [];
  productDetails: Array<any> = [];
  orderedProducts: Array<{product: any, order: number}> = [];
  base: string = `${environment.base}`;
  cover: string = '';
  mobileCover : string = '';
  thumbnail: string = '';

  constructor(
    private CollectionService: CollectionService,
    private ProductService: ProductService,
    private Router: Router,
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      products: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      thumbnail: new FormControl(null),
      cover: new FormControl(null),
      mobileCover: new FormControl(null),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      icons: new FormControl([]),
    });
  }

  addIcon(event: any) {
    this.form.get('icons')?.value.push(event.path);
  }

  removeIcon(icon: string) {
    this.form
      .get('icons')
      ?.setValue(
        this.form.get('icons')?.value.filter((item: string) => item !== icon)
      );
  }

  handleCollectionCover(event: any) {
    this.form.get('cover')?.setValue(event.path);
    this.cover = event.path;
  }
  
  handleCollectionMobileCover(event: any) {
    this.form.get('mobileCover')?.setValue(event.path);
    this.mobileCover = event.path;
  }

  get formControls() {
    return this.form.controls;
  }

  handleCollectionThumbnail(event: any) {
    this.form.get('thumbnail')?.setValue(event.path);
    this.thumbnail = event.path;
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null);
        this.cover = '';
        break;
      case 'mobileCover':
        this.form.get('mobileCover')?.setValue(null);
        this.mobileCover = '';
        break;
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null);
        this.thumbnail = '';
        break;
    }
  }

  getProducts() {
    setTimeout(() => {
      if (this.product.value) {
        this.ProductService.findProducts({
          name: this.product.value,
          isVisible: true,
          isDelete: false,
          isActive: true,
        }).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.searchProducts = res?.result;
            this.ChangeDetectorRef.markForCheck();
          }
        });
      } else {
        this.searchProducts = [];
      }
    }, 800);
  }

  toggleProductMethod(type: any) {
    this.isAutoCompleteEnabled = type;
  }

  addProductSku(product: any) {
    if (!this.productIds.includes(product?._id)) {
      this.productDetails.push(product);
      this.productIds.push(product?._id);
      
      // Add to ordered products with current length as order
      this.orderedProducts.push({
        product: product,
        order: this.orderedProducts.length
      });
    } else {
      // Remove product
      this.productDetails = this.productDetails.filter( (item) => item?._id !== product?._id);
      this.productIds = this.productIds.filter((item) => item !== product?._id);
      
      // Reorder remaining products
      this.orderedProducts = this.orderedProducts
        .filter(item => item.product?._id !== product?._id)
        .map((item, index) => ({
          product: item.product,
          order: index
        }));
    }

    this.product.setValue('');
    this.searchProducts = [];
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails];
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = [...products];

    // Recreate ordered products with new indices
    this.orderedProducts = this.productDetails.map((product, index) => ({
      product: product,
      order: index
    }));
  }

  onSubmit() {
    if (this.isAutoCompleteEnabled) {
      // Prepare products array with order
      const productIds = this.orderedProducts.map(item => item.product?._id);
      this.form.get('products')?.setValue(productIds);
    } else {
      // Handle SKU-based product entry if needed
      const skuProducts = this.productSku?.value.split(',').map((sku:string, index:string) => sku.trim());
      this.form.get('products')?.setValue(skuProducts);
    }

    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    // Rest of the existing submission logic
    if (this.isAutoCompleteEnabled) {
      this.CollectionService.addCollection({ ...this.form.value }).subscribe({
        next: (res: any) => {
          if (res.errorCode != 0) {
            this.HotToastService.error(res?.messaage);
          } else if (res.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.collection.COLLECTION_LIST]);
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message);
        },
      });
    } else {
      this.CollectionService.addCollectionSku({ ...this.form.value }).subscribe({
        next: (res: any) => {
          if (res.errorCode != 0) {
            this.HotToastService.error(res?.messaage);
          } else if (res.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.collection.COLLECTION_LIST]);
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message);
        },
      });
    }
  }
}
