import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/includes/services/product.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-update-collection',
  templateUrl: './update-collection.component.html',
  styleUrls: ['./update-collection.component.scss'],
})
export class UpdateCollectionComponent implements OnInit {
  collectionForm: FormGroup;
  task = PageTasks.UPDATE;

  editMode = false;
  fileData: any;
  appRoute = appRoutes;
  collectionData: any;
  collection: any;
  collectionName: any;
  products: any = [];
  valueArray: any = [];
  productArray: any = [];
  productNames: any = [];
  productValues: any = [];
  isSubmitted: boolean;
  uploadedimg: any;
  array: any = [];
  filedata: File;
  filename: string;
  imageChangedEvent: any;
  loadImage: boolean;
  croppedImage: any;
  base: any

  background: any
  border: any
  color: any
  restore = new FormControl('false');
  isArchived: boolean;
  selectedProducts: any = []
  featured: Boolean = false
  grid: Boolean = false
  images: any = []
  file: any

  bannerFiledata: File;
  bannerFilename: string;
  bannerChangedEvent: any = '';
  loadBanner: boolean = false;
  bannerimg: any;
  croppedBanner: any

  product: FormControl = new FormControl('')
  productSku: FormControl = new FormControl('')
  searchProducts: Array<any> = []
  isAutoCompleteEnabled: boolean = true
  productIds: Array<any> = [];
  productDetails: Array<any> = []

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.managePage();
    this.initForm();
    this.collection = this.route.snapshot.queryParams.collection || '';
    this.getProduct();
    this.getCollection()
    this.base = environment.base

    this.collectionService.collectionImages({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.images = res?.result?.images
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      subname: [''],
      products: [],
      isFeatured: ['false', Validators.required],
      isHighlighted: ['false', Validators.required],
      isActive: ['true', Validators.required],
      isArchive: ['false', Validators.required],
      background: [''],
      type: ['slider'],
      count: ['0'],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });
  }

  get cf() {
    return this.collectionForm.controls;
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

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.products = res?.result
          break;
      }
    });
  }

  getCollection() {
    this.collectionService.getCollectionBySlug(this.collection).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.collectionData = res?.result[0];
          this.uploadedimg = this.collectionData?.file
          this.bannerimg = res?.result[0].banner ? this.base + "/" + res?.result[0].banner : null
          for (let key of Object.keys(this.collectionData)) {
            this.collectionForm.get(key)?.setValue(this.collectionData[key])
          }

          this.collectionForm.get('background')?.setValue(this.collectionData.style.background);
          this.collectionForm.get('border')?.setValue(this.collectionData.style.border);
          this.collectionForm.get('radius')?.setValue(this.collectionData.style.radius);
          this.collectionForm.get('color')?.setValue(this.collectionData.style.text.color);
          this.collectionForm.get('fontSize')?.setValue(this.collectionData.style.text.fontSize);
          this.collectionForm.get('fontWeight')?.setValue(this.collectionData.style.text.fontWeight);

          this.color = this.collectionData?.style.text.color
          this.background = this.collectionData?.style.background
          this.border = this.collectionData?.style.border
          this.selectedProducts = this.collectionData?.products
          for (let product of this.collectionData?.products) this.productIds.push(product?._id)
          if (this.collectionData?.isFeatured == true) this.featured = !this.featured
          if (this.collectionData?.type == 'grid') this.grid = !this.grid
          if (this.collectionData.isArchive == true) this.isArchived = true
          this.productDetails = [...this.collectionData?.products]
          this.cdr.markForCheck()
          break
      }
    });
  }

  toggleProductMethod(type: any) { this.isAutoCompleteEnabled = type }

  getProducts() {
    if (this.product.value) {
      this.productService.findProducts({ name: this.product.value }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.searchProducts = res?.result
          this.cdr.markForCheck()
        }
      })
    } else { this.searchProducts = [] }
  }

  addProductSku(product: any) {
    console.log(this.productIds);
    if (!this.productIds.includes(product?._id)) {
      this.productDetails.push(product)
      this.productIds.push(product?._id)
    } else {
      this.productDetails = this.productDetails.filter(item => item?._id !== product?._id)
      this.productIds = this.productIds.filter(item => item !== product?._id)
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails]
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = [...products]
  }

  compareFn(item: any, selected: any) {
    return item._id === selected._id;
  }

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  bannerFile(event: any) {
    this.bannerFiledata = <File>event.target.files[0];
    this.bannerFilename = this.bannerFiledata.name
    this.bannerChangedEvent = event;
    this.loadBanner = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
  }

  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  removeBanner() {
    this.croppedBanner = ''
    this.loadBanner = false
  }

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
    }
  }

  checkFeatured(e: any) {
    if (e.value == "true") {
      this.featured = !this.featured
    }
  }

  checkGrid(e: any) {
    if (e.value == "grid") {
      this.grid = !this.grid
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCollection();
    } else {
      this.addCollection();
    }
  }

  selectImage(file: any) {
    this.file = file
  }

  addCollection() { }

  updateCollection() {
    if (!this.collectionForm.valid) {
      return;
    }

    this.selectedProducts = []
    if (!this.isAutoCompleteEnabled) {
      this.selectedProducts = this.productSku?.value.split(',')
    } else {
      for (let product of this.productDetails) this.selectedProducts.push(product._id)
    }

    const payload = this.createPayload()
    this.collectionService.updateCollection(payload).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }

  restoreCollection() {
    if (this.restore.value == "true") {
      this.collectionService.restoreCollection({ colid: this.collectionData?.colid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.collection.ARCHIVED_COLLECTION]);
        } else {
          this.toastr.error(res?.message);
        }
      })
    } else {
      this.router.navigate([this.appRoute.collection.ARCHIVED_COLLECTION]);
    }
  }

  createPayload() {
    let data = {
      name: this.collectionForm.get('name')?.value,
      subname: this.collectionForm.get('subname')?.value,
      isFeatured: this.collectionForm.get('isFeatured')?.value,
      isArchive: this.collectionForm.get('isArchive')?.value,
      isHighlighted: this.collectionForm.get('isHighlighted')?.value,
      isActive: this.collectionForm.get('isActive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      products: this.selectedProducts,
      type: this.collectionForm.get('type')?.value,
      count: this.collectionForm.get('count')?.value,
      file: this.file ? this.file : this.collectionData?.file,
      bannerstring: this.croppedBanner,
      bannername: this.bannerFilename,
      banner: this.collectionData?.banner,
      style: {
        background: this.collectionForm.get('background')?.value,
        border: this.collectionForm.get('border')?.value,
        radius: this.collectionForm.get('radius')?.value,
        text: {
          color: this.collectionForm.get('color')?.value,
          fontSize: this.collectionForm.get('fontSize')?.value,
          fontWeight: this.collectionForm.get('fontWeight')?.value,
        }
      },
      colid: this.collectionData?.colid,
      isSku: !this.isAutoCompleteEnabled ? true : false
    }

    return data
  }
}
