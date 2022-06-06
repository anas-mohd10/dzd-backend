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
import { BrandService } from 'src/app/includes/services/brand.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;

  validationMessages = {
    name: [
      {
        type: 'required',
        message: 'Product name is required',
      },
    ],
  };

  isSubmitted = false;
  params: any;
  fileData: File;
  isChecked = false;
  productType: any;
  isSingle: boolean = false;
  brandData: any;
  selected: any;
  filtered: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ProductService,
    private brandService: BrandService
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
    this.getBrandDetail();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      productType: ['configurable', Validators.required],
      sku: ['', Validators.required],
      hsn: ['', Validators.required],
      brand: ['-- Select Brand --', Validators.required],
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

  handleProductType() {
    this.productType = this.productForm.get('productType');
    if (this.productType.value == 'single') {
      this.isSingle = true;
    } else if (this.productType.value == 'configurable') {
      this.isSingle = false;
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

  getBrandDetail() {
    this.brandService.getBrand().subscribe((res: any) => {
      this.brandData = res?.result;
      console.log(this.brandData);
    });
  }

  onOptionsSelected() {
    this.filtered = this.brandData.filter(
      (t: { value: any }) => t.value == this.selected
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  updateProduct() {}

  addProduct() {}
}
