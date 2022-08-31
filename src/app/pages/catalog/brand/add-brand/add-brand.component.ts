import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss'],
})
export class AddBrandComponent implements OnInit {
  brandForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;

  validationMessages = {
    name: [
      {
        type: 'required',
        message: 'Brand name is required',
      },
    ],
  };

  isSubmitted = false;
  params: any;
  fileData: File;
  status: boolean;
  imageArray: any;
  previewURL: any;
  uploadedImg: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private BrandService: BrandService,
    private toastr: ToastrService
  ) { }

  get bf() {
    return this.brandForm.controls;
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
    this.uploadedImg = true;
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.params = this.route.snapshot;
    this.managePage();
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  handleCheckBox() { }

  //Update exsisting brand
  updateBrand() { }

  //Add brand
  addBrand() {
    if (!this.brandForm.valid) {
      return;
    }
    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }

    for (const data of Object.keys(this.brandForm.value)) {
      formData.append(data, this.brandForm.value[data]);
    }

    this.BrandService.addBrand(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Brand Added Successfully');
        this.router.navigate([this.appRoute.brand.BRAND_LIST]);
      }
    });
  }
}
