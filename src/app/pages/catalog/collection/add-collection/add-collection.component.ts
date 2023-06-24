import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss'],
})
export class AddCollectionComponent implements OnInit {
  collectionForm: FormGroup;
  task = PageTasks.ADD;
  productValue: any;
  editMode = false;
  filedata: any;
  appRoute = appRoutes;

  products: any = [];
  search: any = []
  array: any = [];
  productdata: any = [];

  isSubmitted: boolean;
  isAllSelected: Boolean = false
  isChecked: Boolean = false
  croppedImage: any;
  imageChangedEvent: any;
  filename: any;
  loadImage: boolean;
  //Styling variables
  background: any
  border: any
  color: any
  base: any
  page: any = 1
  selectedProducts: any = []
  featured: Boolean = false
  grid: Boolean = false

  images: any = []
  file: any

  bannerFiledata: File;
  bannerFilename: any;
  bannerChangedEvent: any = '';
  loadBanner: boolean;

  product: FormControl = new FormControl('')
  productSku: FormControl = new FormControl('')
  searchProducts: Array<any> = []
  croppedBanner: any;

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
    this.base = environment.base
    this.managePage();
    this.initForm();
    this.getProduct();

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
      file: [''],
      products: [Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      isHighlighted: ['false', Validators.required],
      isActive: ['true', Validators.required],
      type: ['slider'],
      count: ['0'],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });

    this.collectionForm.get('background')?.setValue(AppSettings.BACKGROUND)
    this.background = AppSettings.BACKGROUND
    this.collectionForm.get('border')?.setValue(AppSettings.BORDER)
    this.border = AppSettings.BORDER
    this.collectionForm.get('color')?.setValue(AppSettings.COLOR)
    this.color = AppSettings.COLOR
    this.collectionForm.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.collectionForm.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.collectionForm.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
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

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
  }

  removeBanner() {
    this.croppedBanner = ''
    this.loadBanner = false
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

  selectImage(file: any) {
    this.file = file
  }

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

  toggleProductMethod(type: any) { this.isAutoCompleteEnabled = type }

  addProductSku(product: any) {
    if (!this.productIds.includes(product?._id)) {
      this.productDetails.push(product)
      this.productIds.push(product?._id)
    } else {
      this.productDetails = this.productDetails.filter(item => item?._id !== product?._id)
      this.productIds = this.productIds.filter(item => item !== product?._id)
    }
  }

  addCollection() {
    if (!this.collectionForm.valid) {
      this.toastr.error('Validation failed. Kindly try again with proper values.')
      return;
    }

    if (this.isAutoCompleteEnabled) {
      this.selectedProducts = []
      for (let product of this.productDetails) this.selectedProducts.push(product._id)
      const payload = this.createPayload()
      this.collectionService.addCollection(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.messaage);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
        }
      });
    } else {
      this.selectedProducts = this.productSku?.value.split(',')
      const payload = this.createPayload()
      this.collectionService.addCollectionSku(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
        } else {
          this.toastr.error(res?.messaage);
        }
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.productDetails]
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.productDetails = [...products]
  }

  createPayload() {
    let data = {
      name: this.collectionForm.get('name')?.value,
      subname: this.collectionForm.get('subname')?.value,
      isFeatured: this.collectionForm.get('isFeatured')?.value,
      isActive: this.collectionForm.get('isActive')?.value,
      isHighlighted: this.collectionForm.get('isHighlighted')?.value,
      isArchive: this.collectionForm.get('isArchive')?.value,
      type: this.collectionForm.get('type')?.value,
      count: this.collectionForm.get('count')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      file: this.file,
      bannerstring: this.croppedBanner,
      bannername: this.bannerFilename,
      products: this.selectedProducts,
      style: {
        background: this.collectionForm.get('background')?.value,
        border: this.collectionForm.get('border')?.value,
        radius: this.collectionForm.get('radius')?.value,
        text: {
          color: this.collectionForm.get('color')?.value,
          fontSize: this.collectionForm.get('fontSize')?.value,
          fontWeight: this.collectionForm.get('fontWeight')?.value,
        }
      }
    }
    return data
  }

  updateCollection() { }
}
