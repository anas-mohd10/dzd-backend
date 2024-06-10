import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';

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
  previews: any = { thumbnailPreview: '', coverPreview: '' }
  collectionDetails: any;
  cover: string = ''
  thumbnail: string = ''

  constructor(
    private CollectionService: CollectionService,
    private ProductService: ProductService,
    private Router: Router,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.collectionSlug = this.ActivatedRoute.snapshot.queryParams.collection || ""

    this.CollectionService.getCollectionBySlug(this.collectionSlug).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.form.patchValue(res?.result[0])
          this.collectionDetails = res?.result[0]
          if (res?.result[0]?.thumbnail?.path) {
            this.previews.thumbnailPreview = res?.result[0]?.thumbnail?.path
            this.form.get('thumbnail')?.setValue(res?.result[0]?.thumbnail?._id)
          }
          if (res?.result[0]?.cover?.path) {
            this.previews.coverPreview = res?.result[0]?.cover?.path
            this.form.get('cover')?.setValue(res?.result[0]?.cover?._id)
          }
          this.productDetails = res?.result[0]?.products
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      subname: new FormControl(""),
      products: new FormControl("", Validators.required),
      isActive: new FormControl(true),
      thumbnail: new FormControl(null),
      cover: new FormControl(null),
    });
  }

  handleCollectionCover(event: any) {
    this.form.get('cover')?.setValue(event._id)
    this.previews.coverPreview = event.path
  }

  get formControls() {
    return this.form.controls
  }

  handleCollectionThumbnail(event: any) {
    this.form.get('thumbnail')?.setValue(event._id)
    this.previews.thumbnailPreview = event.path
  }

  onRemove(mediaType: string) {
    switch (mediaType) {
      case 'cover':
        this.form.get('cover')?.setValue(null)
        this.previews.coverPreview = ''
        break
      case 'thumbnail':
        this.form.get('thumbnail')?.setValue(null)
        this.previews.thumbnailPreview = ''
        break
    }
  }

  getProducts() {
    if (this.product.value) {
      this.ProductService.findProducts({
        name: this.product.value,
        isActive: true
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.searchProducts = res?.result
          this.ChangeDetectorRef.markForCheck()
        }
      })
    } else { this.searchProducts = [] }
  }

  toggleProductMethod(type: any) {
    this.isAutoCompleteEnabled = type
  }

  addProductSku(product: any) {
    if (!this.productIds.includes(product?._id)) {
      this.productDetails.push(product)
      this.productIds.push(product?._id)
    } else {
      this.productDetails = this.productDetails.filter(item => item?._id !== product?._id)
      this.productIds = this.productIds.filter(item => item !== product?._id)
    }

    this.product.setValue('')
    this.searchProducts = []
  }

  onSubmit() {
    this.selectedProducts = []
    if (this.isAutoCompleteEnabled) {
      for (let product of this.productDetails) this.selectedProducts.push(product._id)
      this.form.get('products')?.setValue(this.selectedProducts)
    } else {
      this.selectedProducts = this.productSku?.value.split(',')
      this.form.get('products')?.setValue(this.selectedProducts)
    }

    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    this.CollectionService.updateCollection({
      ...this.form.value,
      colid: this.collectionDetails.colid, slug: this.collectionSlug,
      isSku: this.isAutoCompleteEnabled ? false : true
    }).subscribe({
      next: (res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error(res?.messaage);
        } else if (res.errorCode == 0) {
          this.HotToastService.success(res?.message);
          this.Router.navigate([this.appRoute.collection.COLLECTION_LIST]);
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails]
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = [...products]
  }
}
