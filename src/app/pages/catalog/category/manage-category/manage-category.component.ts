import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss'],
})

export class ManageCategoryComponent implements OnInit {
  categoryForm: FormGroup;
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private CategoryService: CategoryService
  ) {}

  get bf() {
    return this.categoryForm.controls;
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
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      rootCategory: ['', Validators.required],
      parentId: ['-- Select Parent Category --', Validators.required]
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
