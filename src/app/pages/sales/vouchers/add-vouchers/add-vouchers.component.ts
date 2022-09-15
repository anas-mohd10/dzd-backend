import { VouchersService } from './../../../../includes/services/vouchers.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { CategoryService } from 'src/app/includes/services/category.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-add-vouchers',
  templateUrl: './add-vouchers.component.html',
  styleUrls: ['./add-vouchers.component.scss']
})
export class AddVouchersComponent implements OnInit {
  voucherForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  filedata: File;
  isSubmitted: boolean;
  appRoute = appRoutes;
  isInvalid: boolean = false;

  categories: any = []; //Array of category ids
  categoriesData: any = []; //Data fetched from database
  category: any = []; //Array of categorty name and id

  products: any = []; //Array of product ids
  productsData: any = []; //Data fetched from database
  product: any = []; //Array of product name and id

  collections: any = []; //Array of collection ids
  collectionsData: any = []; //Data fetched from database
  collection: any = []; //Array of collection name and id

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private vouchersService: VouchersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getCategories()
    this.getProducts()
    this.getCollections()
  }

  initForm() {
    this.voucherForm = this.formBuilder.group({
      title: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      file: [''],
      maxDiscount: [''],
      minPurchase: [''],
      categories: [[]],
      products: [[]],
      collections: [[]],
      isMultiple: ['false'],
      isActive: ['true'],
    });
  }

  get vf() {
    return this.voucherForm.controls;
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


  getCategories() {
    this.categoryService.getCategory().subscribe((res: any) => {
      this.categoriesData = res?.result
    })
  }

  getProducts() {
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.productsData = res?.result
    })
  }

  getCollections() {
    this.collectionService.getCollection().subscribe((res: any) => {
      this.collectionsData = res?.result
    })
  }

  //Tag input add function
  tagInput(event: any, type: any) {
    let value = event.value
    if (type == "category") {
      if (!this.categories.includes(value)) {
        this.categories.push(value)
        for (let category of this.categoriesData) {
          if (category?._id == value) {
            this.category.push({
              name: category?.name,
              id: category?._id
            })
          }
        }
      } else {
        this.toastr.info('Category already added')
      }
      this.voucherForm.get("categories")?.setValue('')
    } else if (type == "product") {
      if (!this.products.includes(value)) {
        this.products.push(value)
        for (let product of this.productsData) {
          if (product?._id == value) {
            this.product.push({
              name: product?.name,
              id: product?._id
            })
          }
        }
      } else {
        this.toastr.info('Product already added')
      }
      this.voucherForm.get("products")?.setValue('')
    } else if (type == "collection") {
      if (!this.collections.includes(value)) {
        this.collections.push(value)
        for (let collection of this.collectionsData) {
          if (collection?._id == value) {
            this.collection.push({
              name: collection?.name,
              id: collection?._id
            })
          }
        }
      } else {
        this.toastr.info('Collection already added')
      }
      this.voucherForm.get("collections")?.setValue('')
    }
  }

  tagRemove(name: any, id: any, type: any) {
    if (type == "category") {
      this.categories = this.categories.filter((_data: any) => _data != id)
      this.category = this.category.filter((_data: any) => _data.name != name)
      this.voucherForm.get("categories")?.setValue('')
    }
    if (type == "product") {
      this.products = this.products.filter((_data: any) => _data != id)
      this.product = this.product.filter((_data: any) => _data.name != name)
      this.voucherForm.get("products")?.setValue('')
    }
    if (type == "collection") {
      this.collections = this.collections.filter((_data: any) => _data != id)
      this.collection = this.collection.filter((_data: any) => _data.name != name)
      this.voucherForm.get("collections")?.setValue('')
    }
  }

  handleInputChange(event: any) {
    const file = event.dataTransfer
      ? event.dataTransfer.files[0]
      : event.target.files[0];
    this.filedata = <File>event.target.files[0];
  }

  checkDate() {
    let validFrom = this.voucherForm.get("fromDate")?.value
    let validTo = this.voucherForm.get("lastDate")?.value
    if (validTo) {
      if (validFrom > validTo) {
        this.toastr.error(`Date is not Valid`);
        this.isInvalid = true
      } else {
        this.isInvalid = false
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateVoucher();
    } else {
      this.addVoucher();
    }
  }

  updateVoucher() { }

  addVoucher() {
    if (!this.voucherForm.valid) {
      this.toastr.error("Validation error occured")
      return;
    }
    const formdata = new FormData();
    if (this.filedata != null && this.filedata != undefined) {
      formdata.append('file', this.filedata);
    }
    for (const data of Object.keys(this.voucherForm.value)) {
      if (data != 'collections' || 'categories' || 'products') {
        formdata.append(data, this.voucherForm.value[data]);
      }
    }
    formdata.append('categories', JSON.stringify(this.categories));
    formdata.append('products', JSON.stringify(this.products));
    formdata.append('collections', JSON.stringify(this.collections));
    if (!this.isInvalid) {
      this.vouchersService.addVoucher(formdata).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Voucher added successfully');
          this.router.navigate([this.appRoute.vouchers.VOUCHERS_LIST]);
        }
      })
    } else {
      this.toastr.error(`Date is not Valid`);
    }
  }
}
