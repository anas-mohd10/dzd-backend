import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from '../../../../config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  get value(): string[] {
    return this.productValue;
  }
  set value(value: string[]) {
    this.productValue = value;
  }

  ngOnInit(): void {
    this.managePage();
    this.initForm();
    this.getProduct();
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      products: [Validators.required],
      isFeatured: ['false', Validators.required],
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
          for (let product of res?.result) {
            this.products.push({
              key: this.products.length,
              name: product.name.toLowerCase(),
              file: product.file,
              id: product._id,
              selected: false
            })
          }
          break;
      }
      this.array = [...this.products]
    });
  }

  //Add and remove tag input product
  handleProduct(e: any, key: any) {
    for (let data of this.array) {
      if (e.checked == true) {
        if (data.key == key) {
          data.selected = true
        }
      } else {
        if (data.key == key) {
          data.selected = false
        }
      }
    }
  }

  //Custom search
  searchValue(e: any) {
    this.products = [...this.array]
    let key = e.value.toLowerCase()
    let result = []
    for (let prod of this.products) {
      if (prod.name.includes(key)) {
        result.push({
          key: prod.key,
          id: prod.id,
          name: prod.name,
          file: prod.file,
          selected: prod.selected
        })
      }
    }
    if (result.length > 0) {
      this.products = [...result]
    } else {
      this.products = []
    }
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
    if (this.array.length != 0) {
      for (let i = 0; i < this.array.length; i++) {
        if (this.array[i].selected == false) {
          this.array.splice(i, 1)
        }
      }
    }
    let data = {
      name: this.collectionForm.get('name')?.value,
      isFeatured: this.collectionForm.get('isFeatured')?.value,
      isActive: this.collectionForm.get('isActive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      products: this.array,
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
    this.collectionService.addCollection(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection added successfully');
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }

  updateCollection() { }
}
