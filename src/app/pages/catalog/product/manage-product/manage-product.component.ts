import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
})
export class ManageProductComponent implements OnInit {
  productForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;

  validationMessages = {
    name: [
      {
        type: 'required',
        message: 'Category name is required',
      },
    ],
  };

  isSubmitted = false;
  params: any;
  fileData: File;
  isChecked = false;
  productType : any
  isSingle: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ProductService
  ) {}

  get pf() {
    return this.productForm.controls;
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  handleCheckBox() {
    if (this.isChecked == false) {
      this.isChecked = true;
    } else if (this.isChecked == true) {
      this.isChecked = false;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.params = this.route.snapshot;
    this.managePage();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      productType: ['configurable', Validators.required],
      sku: ['', Validators.required],
      hsn: ['', Validators.required],
      mrpPrice: ['', Validators.required],
      offerprice: ['', Validators.required],
      stock: ['', Validators.required],
      moq: ['', Validators.required],
      stockwarning: ['', Validators.required],
      productdescription: ['', Validators.required],
      featuredescription: ['', Validators.required],
      additionalbutton: ['', Validators.required],
      buttonredireturl: ['', Validators.required],
      returndays: ['', Validators.required],
      weight: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  handleProductType(){
    this.productType = this.productForm.get('productType')
    if(this.productType.value == "single"){
      this.isSingle = true
    }else if(this.productType.value == "configurable"){
      this.isSingle = false
    }
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  //Update exsisting brand
  updateBrand() {}

  //Add brand
  addBrand() {
    console.log('Clicked submit button');
    // console.log()
    this.productType = this.productForm.get('productType')

    //   if (!this.categoryForm.valid) {
    //     return;
    //   }
    //   const formData = new FormData();
    //   if (this.fileData != null && this.fileData != undefined) {
    //     formData.append("file", this.fileData);
    //   }
    //   for (const data of Object.keys(this.brandForm.value)) {
    //     formData.append(data, this.brandForm.value[data]);
    //   }
    //   this.CategoryService.addBrand(formData).subscribe((res: any) => {
    //     console.log(res)
    //     this.router.navigate([this.appRoute.brand.BRAND_LIST]);
    //   });
  }
}
