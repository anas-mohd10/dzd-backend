import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/includes/services/product.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.managePage();
    this.initForm();
    this.collection = this.route.snapshot.queryParams.collection || '';
    this.getProduct();
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      products: [],
      isFeatured: ['false', Validators.required],
      isActive: ['true', Validators.required],
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
            this.array.push({
              key: this.array.length,
              id: product._id,
              name: product.name.toLowerCase(),
              file: product.file,
              selected: false
            })
          }
          break;
      }
      this.getCollection()
      this.products = [...this.array]
    });
  }

  getCollection() {
    this.collectionService.getCollectionBySlug(this.collection).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.collectionData = res?.result[0];
          this.uploadedimg = this.collectionData?.file
          this.collectionForm.get('name')?.setValue(this.collectionData?.name);
          this.collectionForm.get('isFeatured')?.setValue(this.collectionData?.isFeatured);
          this.collectionForm.get('isActive')?.setValue(this.collectionData?.isActive);
          for (let prod of res?.result[0].products) {
            this.product.push({
              key: prod.key,
              id: prod.id?._id,
              name: prod.id?.name.toLowerCase(),
              file: prod.id?.file,
              selected: true
            })
          }
          break;
      }
      this.checkProduct()
    });
  }

  checkProduct() {
    for (let prod of this.product) {
      for (let arr of this.products) {
        if (arr.id == prod.id) {
          if (arr.selected != true) {
            arr.selected = true
          }
        }
      }
    }
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
      file: ''
    }
    if (this.uploadedimg != '') {
      data.file = this.uploadedimg
    }
    this.collectionService.updateCollection(this.collection, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection Added Successfully');
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }
}
