import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  task = PageTasks.UPDATE;
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
  splitCategory: any;
  rootCategory: any = '';
  parentCategory: any = '';
  category: any;
  categoryValues: any;
  previewImg: any;
  parentIdValue: string;
  uploadedImg: any;

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
    if (this.categoryForm.get('rootId')?.value == 'false') {
      this.isChecked = false;
    } else if (this.categoryForm.get('rootId')?.value == 'true') {
      this.isChecked = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.category = this.route.snapshot.queryParams.category || '';
    this.managePage();
    this.getCategory();
    this.getCategoryBySlug();
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      rootId: ['check', Validators.required],
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

  getCategoryBySlug() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe(
      (res: any) => {
        this.categoryValues = res?.result[0];
        this.categoryForm.get('name')?.setValue(this.categoryValues.name);
        this.categoryForm.get('rootId')?.setValue(this.categoryValues.isRoot);
        this.categoryForm
          .get('isActive')
          ?.setValue(this.categoryValues.isActive);
        this.categoryForm
          .get('isFeatured')
          ?.setValue(this.categoryValues.isFeatured);
        this.parentIdValue =
          this.categoryValues.rootId.name +
          '>>' +
          this.categoryValues.parentId.name +
          '>>' +
          this.categoryValues.name;
          console.log(this.parentIdValue)
        this.categoryForm.get('parentId')?.setValue(this.parentIdValue);
      }
    );
  }

  getCategory() {
    this.CategoryService.getCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
      this.uploadedImg = this.categoryData?.file
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
          if (res?.result[i].parentId._id != res?.result[i].rootId._id) {
            this.categoryArray.push(
              res?.result[i].rootId.name +
                ' > ' +
                res?.result[i].parentId.name +
                ' > ' +
                res?.result[i].name
            );
          } else if (res?.result[i].parentId._id == res?.result[i].rootId._id) {
            this.categoryArray.push(
              res?.result[i].rootId.name + ' > ' + res?.result[i].name
            );
          }
        }
        if (!res?.result[i].parentId && !res?.result[i].rootId) {
          this.categoryArray.push(res?.result[i].name);
        }
      }
      this.categoryForm.get('parentId')?.setValue(this.categoryArray);
    });
  }

  //Update exsisting category
  updateBrand() {}

  //Add Category
  addCategory() {
    const formData = new FormData();
    if (this.categoryForm.get('rootId')?.value == 'true') {
      this.categoryForm.get('parentId')?.setValue('');
      this.rootCategory = '';
      this.parentCategory = '';
      formData.append('isRoot', 'true');
    }

    if (this.categoryForm.get('parentId')?.value.includes('>')) {
      this.splitCategory = this.categoryForm
        .get('parentId')
        ?.value.split(' > ');
      for (let i = 0; i < this.categoryData.length; i++) {
        if (this.splitCategory[0] == this.categoryData[i].name) {
          this.rootCategory = this.categoryData[i]._id;
        }
        if (
          this.splitCategory[this.splitCategory.length - 1] ==
          this.categoryData[i].name
        ) {
          this.parentCategory = this.categoryData[i]._id;
        }
      }
    } else {
      this.splitCategory = this.categoryForm.get('parentId')?.value;
      console.log(this.splitCategory);
      for (let i = 0; i < this.categoryData.length; i++) {
        if (this.categoryData[i].name == this.splitCategory) {
          this.rootCategory = this.categoryData[i]._id;
          this.parentCategory = this.categoryData[i]._id;
        }
      }
      for (let i = 0; i < this.splitCategory.length; i++) {}
    }

    if (!this.categoryForm.valid) {
      console.error('Validation error');
      return;
    }

    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
    }else{
      formData.append('file', this.uploadedImg)
    }

    for (const data of Object.keys(this.categoryForm.value)) {
      if (data != 'rootId' || 'parentId') {
        formData.append(data, this.categoryForm.value[data]);
      }
    }

    formData.append('rootId', this.rootCategory);
    formData.append('parentId', this.parentCategory);

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
