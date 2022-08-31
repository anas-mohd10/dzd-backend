import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-banner-list',
  templateUrl: './add-banner-list.component.html',
  styleUrls: ['./add-banner-list.component.scss']
})
export class AddBannerListComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  bannerForm: FormGroup
  isSubmitted = false;
  productsData: any;
  fileData: File;
  uploadedImg: boolean;
  bannerFile: File;
  mobileBannerFile: File;
  images: any = []

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.getProduct()
  }

  initForm() {
    this.bannerForm = this.formBuilder.group({
      title: ['', Validators.required],
      position: ['TOP', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      redirectURL: [''],
      isActive: ['true', Validators.required],
      product: [''],
    });
  }

  get hf() {
    return this.bannerForm.controls;
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

  handleInputChange(event: any) {
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      this.images = event.target.files
    }
  }

  onSubmit() {
    if (!this.bannerForm.valid) {
      return;
    }
    console.log(this.images);
    const formData = new FormData();
    if (this.images != null && this.images != undefined) {
      for (let img of this.images) {
        formData.append('file', img);
      }
    }
    for (const data of Object.keys(this.bannerForm.value)) {
      formData.append(data, this.bannerForm.value[data]);
    }
    this.bannerService.addBaner(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Banner Added Successfully');
        this.router.navigate([this.appRoute.banner.BANNER_LIST]);
      }
    })
  }

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result
    })
  }
}
