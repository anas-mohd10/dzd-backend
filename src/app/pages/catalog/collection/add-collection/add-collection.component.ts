import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from '../../../../config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
// import { Options } from 'select2';
// import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss'],
})
export class AddCollectionComponent implements OnInit {
  collectionForm: FormGroup;
  task = PageTasks.ADD;
  // public options: Options;
  productValue: any;
  editMode = false;
  fileData: any;
  appRoute = appRoutes;
  collectionData: any;
  collection: any;
  collectionName: any;
  isSubmitted: boolean;
  selected: any;
  filtered: any;
  productData: any;
  products: Array<any>;

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  get value(): string[] {
    return this.productValue;
  }
  set value(value: string[]) {
    this.productValue = value;
  }

  ngOnInit(): void {
    this.managePage();
    this.initForm();
    this.getCollection();
    this.getProduct();
    // this.options = {
    //   width: '500',
    //   multiple: true,
    //   tags: true,
    // };
    // this.productValue = [""];
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      products: ['', Validators.required],
      featured: ['No', Validators.required],
      status: ['Active', Validators.required],
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

  getCollection() {
    this.collectionService.getCollection().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.collectionData = res?.result;
          this.collectionName = this.collectionData?.name;
          break;
      }
    });
  }

  getProduct() {
    this.productService.getProductNames().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.products = res?.result;
          for(let i=0; i<this.products.length; i++){
            this.collectionForm.get('products')?.setValue(this.products[i].name)
          }
          break;
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  // onOptionsSelected() {
  //   this.filtered = this.collectionData.filter(
  //     (t: { value: any }) => t.value == this.selected
  //   );
  // }

  addBrand() {
    if (!this.collectionForm.valid) {
      return;
    }

    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    for (const data of Object.keys(this.collectionForm.value)) {
      formData.append(data, this.collectionForm.value[data]);
    }
    console.log(this.collectionForm);
    this.collectionService.addCollection(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Collection Added Successfully');
        this.router.navigate([this.appRoute.collection.COLLECTION_LIST]);
      }
    });
  }

  updateBrand() {}
}
