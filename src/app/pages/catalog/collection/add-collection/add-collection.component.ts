import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from '../../../../config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

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
  croppedImage: any = '';
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
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      subname: ['', Validators.required],
      file: [''],
      products: [Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      isActive: ['true', Validators.required],
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

  addCollection() {
    if (!this.collectionForm.valid) {
      console.error("error");
      return;
    }

    const payload = this.createPayload()

    this.collectionService.addCollection(payload).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection added successfully');
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }

  createPayload() {
    let data = {
      name: this.collectionForm.get('name')?.value,
      subname: this.collectionForm.get('subname')?.value,
      isFeatured: this.collectionForm.get('isFeatured')?.value,
      isActive: this.collectionForm.get('isActive')?.value,
      isArchive: this.collectionForm.get('isArchive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
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
