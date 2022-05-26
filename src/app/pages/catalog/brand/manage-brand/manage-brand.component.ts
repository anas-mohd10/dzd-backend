import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { ToastService } from '../../../../includes/services/toast.service';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-brand',
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss'],
})
export class ManageBrandComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private BrandService: BrandService,
    private toast: ToastService,
    // private toast: ToastrService
  ) {}

  get bf() {
    return this.brandForm.controls;
  }

  handleInputChange(fileInput: any) {
    const file = fileInput.dataTransfer
      ? fileInput.dataTransfer.files[0]
      : fileInput.target.files[0];
    this.fileData = <File>fileInput.target.files[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.params = this.route.snapshot
    this.managePage();
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
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

  //Update exsisting brand
  updateBrand() {}

  //Add brand
  addBrand() {
    if (!this.brandForm.valid) {
      return;
    }
    this.BrandService.addBrand(this.brandForm.value).subscribe((res: any) => {
      console.log(res)
      this.toast.success('Successfully added'); //Not working properly
      this.router.navigate([this.appRoute.brand.BRAND_LIST]);
    });
  }
}
