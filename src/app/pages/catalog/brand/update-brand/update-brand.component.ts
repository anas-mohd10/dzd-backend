import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss'],
})
export class UpdateBrandComponent implements OnInit {
  brandForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;

  isSubmitted = false;
  params: any;
  fileData: File;
  status: boolean;
  brand: any;
  brandData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private toastr: ToastrService
  ) {}

  get bf() {
    return this.brandForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.brand = this.route.snapshot.queryParams.brand || '';
    this.managePage();
    this.getBrand()
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
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

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer? fileInput.dataTransfer.files[0]: fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  getBrand() {
    this.brandService.getBrandBySlug(this.brand).subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brandData = res?.result[0];
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
  addBrand() {}

  updateBrand() {
    if (!this.brandForm.valid) {
      return;
    }
    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }
    for (const data of Object.keys(this.brandForm.value)) {
      if(this.brandForm.value[data] != '' || null){
        formData.append(data, this.brandForm.value[data])
      } 
    }

    this.brandService.updateBrand(this.brand, formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Brand Updated Successfully');
        this.router.navigate([this.appRoute.brand.BRAND_LIST]);
      }
    });
  }
}
