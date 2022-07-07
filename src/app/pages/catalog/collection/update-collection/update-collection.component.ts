import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/includes/services/product.service';

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
  products: any;
  valueArray: any = [];
  productArray: any = [];
  productNames: any = [];
  productValues: any = [];
  isSubmitted: boolean;

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.collection = this.route.snapshot.queryParams.collection || '';
    this.getCollection();
    this.getProduct();
    this.managePage();
    this.initForm();
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      products: [],
      isFeatured: ['false', Validators.required],
      isActive: ['true', Validators.required],
    });
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
          this.products = res?.result;
          this.productArray = this.products;
          for (let i = 0; i < this.products.length; i++) {
            this.collectionForm
              .get('products')
              ?.setValue(this.products[i].name);
          }
          break;
      }
    });
  }

  getCollection() {
    this.collectionService
      .getCollectionBySlug(this.collection)
      .subscribe((res: any) => {
        switch (res?.errorCode) {
          case 0:
            this.collectionData = res?.result[0];
            this.collectionForm
              .get('name')
              ?.setValue(this.collectionData?.name);
            this.collectionForm
              .get('isFeatured')
              ?.setValue(this.collectionData?.isFeatured);
            this.collectionForm
              .get('isActive')
              ?.setValue(this.collectionData?.isActive);
            this.productValues = this.collectionData?.products;
            for (let i = 0; i < this.productValues.length; i++) {
              this.productNames.push(this.productValues[i].name);
              this.valueArray.push(this.productValues[i]._id);
            }
            break;
        }
      });
  }

  tagInput() {
    if (!this.valueArray.includes(this.collectionForm.get('products')?.value)) {
      this.valueArray.push(this.collectionForm.get('products')?.value);
      this.getProductNames(this.collectionForm.get('products')?.value);
    }
    this.collectionForm.get('products')?.setValue('');
  }

  getProductNames(value: any) {
    for (let i = 0; i < this.productArray.length; i++) {
      if (this.productArray[i]._id == value) {
        this.productNames.push(this.productArray[i].name);
      }
    }
  }

  tagRemove(value: any) {
    if(this.productNames.includes(value)){
      this.productNames.pop(value)
      this.getProductId(value)
    }
  }

  getProductId(value: any){
    for(let i=0; i<this.productArray.length; i++){
      if(this.productArray[i].name == value){
        this.valueArray.pop(this.productArray[i]._id)
      }
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

  addCollection(){}


  updateCollection(){
    if (!this.collectionForm.valid) {
      return;
    }

    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }

    for (const data of Object.keys(this.collectionForm.value)) {
      if (data != 'products') {
        formData.append(data, this.collectionForm.value[data]);
      }
    }

    console.log(this.valueArray)

    formData.append("products", this.valueArray);

    this.collectionService.updateCollection(this.collection, formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection Added Successfully');
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }
}
