import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes;
  categoryArray: any = [];

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
  categoryData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private CategoryService: CategoryService,
    private toastr: ToastrService
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
    this.getCategory();
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      rootCategory: ['', Validators.required],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      parentId: [''],
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
      this.addCategory();
    }
  }

  getCategory() {
    this.CategoryService.getCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
      for (let i = 0; i < res?.result.length; i++) {
        if (res?.result[i].parentId && !res?.result[i].rootId) {
          this.categoryArray.push(
            res?.result[i].parentId.name + ' > ' + res?.result[i].name
          );
        }
        if (!res?.result[i].parentId && res?.result[i].rootId) {
          this.categoryArray.push(
            res?.result[i].rootId.name + ' > ' + res?.result[i].name
          );
        }
        if (res?.result[i].parentId && res?.result[i].rootId) {
          this.categoryArray.push(
            res?.result[i].rootId.name +
              ' > ' +
              res?.result[i].parentId.name +
              ' > ' +
              res?.result[i].name
          );
        }
        if (!res?.result[i].parentId && !res?.result[i].rootId) {
          this.categoryArray.push(res?.result[i].name);
        }
      }
      this.categoryForm.get('parentId')?.setValue(this.categoryArray);
    });
  }

  //Update exsisting brand
  updateBrand() {}

  //Add brand
  addCategory() {
    if (this.categoryForm.get('rootCategory')?.value == true) {
      this.categoryForm.get('parentId')?.setValue('');
    }

    const splitCategory = this.categoryForm.get('parentId')?.value.split(' > ');
    for (let i = 0; i < splitCategory.length; i++) {}
    if (!this.categoryForm.valid) {
      return;
    }
    const formData = new FormData();
    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }

    for (const data of Object.keys(this.categoryForm.value)) {
      formData.append(data, this.categoryForm.value[data]);
    }
    this.CategoryService.addCategory(formData).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Category Added Successfully');
        this.router.navigate([this.appRoute.category.CATEGORY_LIST]);
      }
    });
  }
}
