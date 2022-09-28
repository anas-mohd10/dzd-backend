import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from '../../../../config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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
  array: any = []

  isSubmitted: boolean;
  isAllSelected: Boolean = false
  isChecked: Boolean = false

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
              name: product.name,
              file: product.file,
              id: product._id
            })
          }
          break;
      }
    });
  }

  handleProduct(e: any, key: any) {
    let products = [...this.products]
    products = products.filter((_data) => _data.key == key)
    this.array.push(products[0])
  }

  removeProduct(key: any) {
    let products = [...this.array]
    products = products.filter((_data) => _data.key != key)
    this.array = [...products]
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCollection();
    } else {
      this.addCollection();
    }
  }

  handleInputChange(fileInput: any) {
    this.filedata = <File>fileInput.target.files[0];
  }

  addCollection() {
    if (!this.collectionForm.valid) {
      console.error("error");
      return;
    }

    const formData = new FormData();
    if (this.filedata != null && this.filedata != undefined) {
      formData.append('file', this.filedata);
    }

    for (const data of Object.keys(this.collectionForm.value)) {
      if (data != 'products') {
        formData.append(data, this.collectionForm.value[data]);
      }
    }
    // formData.append("products", this.valueArray);
    this.collectionService.addCollection(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection Added Successfully');
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }

  updateCollection() { }
}
