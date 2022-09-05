import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/includes/services/product.service'

@Component({
  selector: 'app-add-layout-list',
  templateUrl: './add-layout-list.component.html',
  styleUrls: ['./add-layout-list.component.scss']
})
export class AddLayoutListComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  layoutForm: FormGroup
  isSubmitted = false;
  productsData: any;
  images: any = [];
  files: any = []
  localData: any = []
  dataFiles: any = []
  url: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getProducts()
  }

  initForm() {
    this.layoutForm = this.formBuilder.group({
      title: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      isActive: ['true'],
      gridCount: ['1'],
      type: ['slider'],
      productId: [''],
      redirectionURL: [''],
      image: [''],
      // files: this.formBuilder.array([]),
    });
  }

  get lf() {
    return this.layoutForm.controls;
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

  getProducts() {
    this.productService.getActiveProduct().subscribe((res: any) => {
      this.productsData = res?.result
    })
  }

  addFile() {
    let product = this.layoutForm.get("productId")?.value
    let redirectionURL = this.layoutForm.get("redirectionURL")?.value
    let maxVal = this.layoutForm.get("gridCount")?.value
    if (maxVal > this.localData.length) {
      this.files.push({
        productId: product,
        redirectionURL: redirectionURL
      })

      for (let prod of this.productsData) {
        if (prod._id == product) {
          this.localData.push({
            product: prod.name,
            url: redirectionURL,
            file: this.url
          })
        }
      }
    } else {
      this.toastr.warning(`No. of files that can be uploaded is ${maxVal}. To upload more, change grid count value`);
    }
    this.layoutForm.get("productId")?.setValue('')
    this.layoutForm.get("redirectionURL")?.setValue('')
    this.layoutForm.get("image")?.setValue('')
    this.dataFiles.pop()
  }

  handleInputChange(event: any) {
    if (event.target.files.length > 0) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.url = e.target.result
      }
      for (let i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i])
        this.dataFiles.push(event.target.files[i])
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateLayout();
    } else {
      this.addLayout();
    }
  }

  updateLayout() { }

  addLayout() {
    if (!this.layoutForm.valid) {
      this.toastr.error('Kindly fill required fields');
      return;
    }
    console.log(this.layoutForm.value);
  }
}
