import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-update-collection',
  templateUrl: './update-collection.component.html',
  styleUrls: ['./update-collection.component.scss'],
})
export class UpdateCollectionComponent implements OnInit {
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
  base: string = environment.base;
  collectionSlug: string = '';
  previews: any = { thumbnailPreview: '', coverPreview: '', mobileCover: '' };
  collectionDetails: any;
  cover: string = '';
  mobileCover: string = '';
  icons: Array<string> = [];
  thumbnail: string = '';
  _id: string = '';
  settings: any;
  hasUnsavedOrderChanges: boolean = false;


  constructor(
    private CollectionService: CollectionService,
    private ProductService: ProductService,
    private AppSettingsService: AppSettingsService,
    private Router: Router,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  formatDate(date: string) {
    return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatTime(date: string) {
    return new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }


  ngOnInit(): void {
    this.collectionSlug = this.ActivatedRoute.snapshot.queryParams.collection || '';

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.CollectionService.getCollectionBySlug(this.collectionSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result);
          this.collectionDetails = res?.result;
          this.icons = res?.result?.icons;
          if (res?.result?.mobileCover) {
            this.previews.mobileCoverPreview = res?.result?.mobileCover;
            this.form.get('mobileCover')?.setValue(res?.result?.mobileCover);
          }
          if (res?.result?.thumbnail) this.previews.thumbnailPreview = res?.result?.thumbnail;
          if (res?.result?.cover) this.previews.coverPreview = res?.result?.cover;
          this.productDetails = res?.result?.products.map((item: any) => item.product);
          this.productIds = res?.result?.products.map((item: any) => item.product._id);
          this.ChangeDetectorRef.markForCheck();
          this._id = res?.result?._id;
        }
        this.updateProductOrders();
      },
    });

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      products: new FormControl('', Validators.required),
      isActive: new FormControl(true),
      thumbnail: new FormControl(null),
      icons: new FormControl([]),
      cover: new FormControl(null),
      mobileCover: new FormControl(null),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
      isSku: new FormControl(false),
      _id: new FormControl(''),
    });

    // Initialize product orders
    this.updateProductOrders();
  }

  handleCollectionCover(event: any) {
    this.form.get('cover')?.setValue(event.path);
    this.previews.coverPreview = event.path;
  }

  get formControls() {
    return this.form.controls;
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

  handleCollectionThumbnail(event: any) {
    this.form.get('thumbnail')?.setValue(event.path);
    this.previews.thumbnailPreview = event.path;
  }

  handleCollectionMobileCover(event: any) {
    this.form.get('mobileCover')?.setValue(event.path);
    this.previews.mobileCoverPreview = event.path;
  }

  onDelete() {
    this.CollectionService.deleteCollection(this.collectionDetails?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.collection.COLLECTION_LIST]);
          this.HotToastService.success(res.message);
        } else {
          this.HotToastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message);
      },
    });
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null);
        this.previews.coverPreview = '';
        break;
      case 'mobileCover':
        this.form.get('mobileCover')?.setValue(null);
        this.previews.mobileCoverPreview = '';
        break;
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null);
        this.previews.thumbnailPreview = '';
        break;
    }
  }

  getProducts() {
    if (this.product.value) {
      this.ProductService.findProducts({
        name: this.product.value,
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
  }

  toggleProductMethod(type: any) {
    this.isAutoCompleteEnabled = type;
  }

  addProductSku(product: any) {
    if (!this.productIds.includes(product?._id)) {
      this.productDetails.push({ ...product, order: this.productDetails.length + 1 });
      this.productIds.push(product?._id);
    } else {
      this.productDetails = this.productDetails.filter((item) => item?._id !== product?._id);
      this.productIds = this.productIds.filter((item) => item !== product?._id);
    }

    this.updateProductOrders();
    this.product.setValue('');
    this.searchProducts = [];
  }

  onSubmit() {
    this.form.get('_id')?.setValue(this._id);
    this.selectedProducts = [];
    if (!this.isAutoCompleteEnabled) {
      const selectedProducts = this.productSku?.value.split(',').map((sku: string, index: number) => ({
        product: sku.trim(),
        order: index + 1
      }));
      this.selectedProducts = selectedProducts;
      this.form.get('products')?.setValue(selectedProducts);
      this.form.get("isSku")?.setValue(true);
    }

    if (!this.form.valid) {
      this.HotToastService.error('Please fill all the required fields');
      this.isSubmitted = true;
      return;
    }

    this.CollectionService.updateCollection({...this.form.value}).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.collection.COLLECTION_LIST]);
          this.HotToastService.success(res.message);
        } else {
          this.HotToastService.error(res.message);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message);
      }
    });
  }

  setProductOrder(product: any, newIndex: number) {
    if (newIndex < 0 || newIndex >= this.productDetails.length) {
      this.HotToastService.error('Invalid order position');
      return;
    }

    const currentIndex = this.productDetails.findIndex(p => p._id === product._id);
    if (currentIndex === -1) return;
    const removedProduct = this.productDetails.splice(currentIndex, 1)[0];
    this.productDetails.splice(newIndex, 0, removedProduct);
    this.updateProductOrders();
  }

  setOrderValue(value: any): number {
    return Number(value) || 0; // Converts to number and defaults to 0 if invalid
  }

  updateProductOrders() {
    this.productDetails.forEach((product, index) => {  product.order = index + 1; });
    this.selectedProducts = this.productDetails.map(product => ({ product: product._id, order: product.order }));
    this.hasUnsavedOrderChanges = true;
    this.form.get('products')?.setValue(this.selectedProducts);
    this.ChangeDetectorRef.detectChanges();
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails];
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = products;
    this.updateProductOrders();
  }
}
