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
  icons: Array<string> = []
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
          this.form.patchValue(res?.result)
          this.collectionDetails = res?.result
          this.icons = res?.result?.icons
          if (res?.result?.thumbnail) this.previews.thumbnailPreview = res?.result?.thumbnail
          if (res?.result?.cover) this.previews.coverPreview = res?.result?.cover
          this.productDetails = res?.result?.products
          this.productIds = res?.result?.products.map((item: any) => item?._id)
          this.ChangeDetectorRef.markForCheck()
        }
      }
    })

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      description: new FormControl(""),
      products: new FormControl("", Validators.required),
      isActive: new FormControl(true),
      thumbnail: new FormControl(null),
      icons: new FormControl([]),
      cover: new FormControl(null),
      metaTitle: new FormControl(''),
      metaDescription: new FormControl(''),
      metaKeywords: new FormControl(''),
    });
  }

  handleCollectionCover(event: any) {
    this.form.get('cover')?.setValue(event.path)
    this.previews.coverPreview = event.path
  }

  get formControls() {
    return this.form.controls
  }

  addIcon(event: any) {
    this.form.get('icons')?.value.push(event.path)
  }

  removeIcon(icon: string) {
    this.form.get('icons')?.setValue(this.form.get('icons')?.value.filter((item: string) => item !== icon))
  }

  handleCollectionThumbnail(event: any) {
    this.form.get('thumbnail')?.setValue(event.path)
    this.previews.thumbnailPreview = event.path
  }

  onDelete() {
    this.CollectionService.updateCollection({
      isDelete: true,
      _id: this.collectionDetails._id
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([this.appRoute.collection.COLLECTION_LIST]);
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
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
      _id: this.collectionDetails?._id,
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
