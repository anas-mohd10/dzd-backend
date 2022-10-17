import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/includes/services/product.service'
import { LayoutService } from 'src/app/includes/services/layout.service';


@Component({
  selector: 'app-update-layout-list',
  templateUrl: './update-layout-list.component.html',
  styleUrls: ['./update-layout-list.component.scss']
})
export class UpdateLayoutListComponent implements OnInit {
  task = PageTasks.UPDATE;
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
  slug: any;
  layoutData: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductService,
    private layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getProducts()
    this.slug = this.route.snapshot.queryParams.layout || '';
    this.getLayoutBySlug()
  }

  initForm() {
    this.layoutForm = this.formBuilder.group({
      title: ['', Validators.required],
      validFrom: [''],
      validTo: [''],
      isActive: ['true'],
      gridCount: ['1'],
      type: ['slider'],
      product: [''],
      redirectionURL: [''],
      file: ['']
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

  getLayoutBySlug() {
    this.layoutService.getLayoutBySlug(this.slug).subscribe((res: any) => {
      this.layoutData = res?.result[0]
      this.layoutForm.get("title")?.setValue(res?.result[0].title)
      this.layoutForm.get("validFrom")?.setValue(res?.result[0].validFrom)
      this.layoutForm.get("validTo")?.setValue(res?.result[0].validTo)
      this.layoutForm.get("isActive")?.setValue(res?.result[0].isActive)
      this.layoutForm.get("gridCount")?.setValue(res?.result[0].gridCount)
      this.layoutForm.get("type")?.setValue(res?.result[0].type)
      this.cdr.markForCheck();
      for (let file of res?.result[0].files) {
        this.localData.push({
          id: file.id,
          product: file.product,
          url: file.redirectionURL,
          file: `http://localhost:3000/${file.file}`
        })
      }
    })
  }

  addFile() {
    //Form fields
    let product = this.layoutForm.get("product")?.value
    let redirectionURL = this.layoutForm.get("redirectionURL")?.value
    let maxVal = this.layoutForm.get("gridCount")?.value

    if (product && this.url != '') {
      if (maxVal > this.localData.length) {
        //Files for db
        this.files.push({
          product: product,
          id: this.files.length,
          redirectionURL: redirectionURL
        })

        //Localdata for preview purpose
        for (let prod of this.productsData) {
          if (prod._id == product) {
            this.localData.push({
              id: this.localData.length,
              product: prod.name,
              url: redirectionURL,
              file: this.url
            })
          }
        }

        //Reset values to null
        this.layoutForm.get("product")?.setValue('')
        this.layoutForm.get("redirectionURL")?.setValue('')
        this.layoutForm.get("file")?.setValue('')
        this.dataFiles.pop()
      } else {
        this.toastr.warning(`No. of files that can be uploaded is ${maxVal}. To upload more, change grid count value`);
      }
    } else {
      this.toastr.error(`Kindly fill required fields`);
    }
  }

  removeFile(id: any) {
    this.localData = this.localData.filter((_data: any) => _data.id != id)
    this.files = this.files.filter((_data: any) => _data.id != id)
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

  updateLayout() {
    if (!this.layoutForm.valid) {
      this.toastr.error('Kindly fill required fields...');
      return;
    }
    const formdata = new FormData();
    if (this.images != null && this.images != undefined) {
      for (let img of this.images) {
        formdata.append('file', img);
      }
      formdata.append('file', this.images)
    }
    for (const data of Object.keys(this.layoutForm.value)) {
      formdata.append(data, this.layoutForm.value[data]);
    }
    formdata.append("data", JSON.stringify(this.files))
    this.layoutService.updateLayout(this.slug, formdata).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Layout updated successfully');
        this.router.navigate([this.appRoute.layout.LAYOUT_LIST]);
      }
    })
  }

  addLayout() {
  }

  checkDate() {
    let validFrom = this.layoutForm.get("validFrom")?.value
    let validTo = this.layoutForm.get("validTo")?.value
    if (validFrom > validTo) {
      this.toastr.error(`Date is not Valid`);
    }
  }
}
