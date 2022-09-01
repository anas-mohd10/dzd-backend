
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageTasks } from 'src/app/config/constants/page-tasks';
import { appRoutes } from 'src/app/config/routes';
import { BannerService } from 'src/app/includes/services/banner.service';
import { ProductService } from 'src/app/includes/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-banner-list',
  templateUrl: './update-banner-list.component.html',
  styleUrls: ['./update-banner-list.component.scss']
})
export class UpdateBannerListComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  bannerForm: FormGroup
  slug: any = ''
  bannerData: any
  productsData: any;
  images: any = [];
  eImages: any = [] //Exsisting images
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerService: BannerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.queryParams.banner || ''
    this.getBanner()
    this.getProduct()
    this.initForm()
    this.managePage()
  }

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result
    })
  }

  getBanner() {
    console.log(this.slug);
    this.bannerService.getBanner(this.slug).subscribe((res: any) => {
      this.bannerData = res?.result[0]
      this.eImages.push(this.bannerData?.bFile)
      this.eImages.push(this.bannerData?.mbFile)
      this.bannerForm.get("title")?.setValue(res?.result[0].title)
      this.bannerForm.get("position")?.setValue(res?.result[0].position)
      this.bannerForm.get("validFrom")?.setValue(res?.result[0].validFrom)
      this.bannerForm.get("validTo")?.setValue(res?.result[0].validTo)
      this.bannerForm.get("isActive")?.setValue(res?.result[0].isActive)
      this.bannerForm.get("product")?.setValue(res?.result[0].product)
      this.bannerForm.get("redirectURL")?.setValue(res?.result[0].redirectURL)
    })
  }

  handleInputChange(event: any) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i])
      }
    }
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

  onSubmit() {
    if (!this.bannerForm.valid) {
      return;
    }
    const formData = new FormData();
    if (this.images != null && this.images != undefined) {
      for (let img of this.images) {
        formData.append('file', img);
      }
      formData.append('file', this.images)
    } else {
      formData.append("bFile", this.eImages[0])
      formData.append("mbFile", this.eImages[1])
    }
    console.log(this.images);
    console.log(this.eImages);
    for (const data of Object.keys(this.bannerForm.value)) {
      formData.append(data, this.bannerForm.value[data]);
    }
    this.bannerService.updateBanner(this.slug, formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Banner updated successfully');
        this.router.navigate([this.appRoute.banner.BANNER_LIST]);
      }
    })
  }


}
