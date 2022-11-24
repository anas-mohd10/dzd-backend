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
  product: any = [];
  filedata: File;
  filename: string;
  imageChangedEvent: any;
  loadImage: boolean;
  croppedImage: any;
  base: any
  //Styling variables
  background: any
  border: any
  color: any
  restore = new FormControl('false');
  isArchived: boolean;
  selectedProducts: any = []

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
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      subname: ['', Validators.required],
      products: [],
      isFeatured: ['false', Validators.required],
      isActive: ['true', Validators.required],
      isArchive: ['false', Validators.required],
      background: [''],
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
          this.collectionForm.get('name')?.setValue(this.collectionData?.name);
          this.collectionForm.get('subname')?.setValue(this.collectionData?.subname);
          this.collectionForm.get('isFeatured')?.setValue(this.collectionData?.isFeatured);
          this.collectionForm.get('isActive')?.setValue(this.collectionData?.isActive);
          this.collectionForm.get('isArchive')?.setValue(this.collectionData?.isArchive);
          this.collectionForm.get('background')?.setValue(this.collectionData?.style.background);
          this.collectionForm.get('border')?.setValue(this.collectionData?.style.border);
          this.collectionForm.get('radius')?.setValue(this.collectionData?.style.radius);
          this.collectionForm.get('color')?.setValue(this.collectionData?.style.text.color);
          this.collectionForm.get('fontSize')?.setValue(this.collectionData?.style.text.fontSize);
          this.collectionForm.get('fontWeight')?.setValue(this.collectionData?.style.text.fontWeight);
          this.color = this.collectionData?.style.text.color
          this.background = this.collectionData?.style.background
          this.border = this.collectionData?.style.border
          this.selectedProducts = this.collectionData?.products
          if (this.collectionData.isArchive == true) {
            this.isArchived = true
          }
          this.cdr.markForCheck()
          break
      }
    });
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

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
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

  addCollection() { }

  updateCollection() {
    if (!this.collectionForm.valid) {
      return;
    }

    const payload = this.createPayload()

    this.collectionService.updateCollection(this.collectionData?.colid, payload).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection Added Successfully');
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
      isActive: this.collectionForm.get('isActive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      products: this.selectedProducts,
      file: '',
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
      colid: this.collectionData?.colid
    }
    if (this.uploadedimg != '') {
      data.file = this.uploadedimg
    }

    return data
  }
}
