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
  isSubmitted = false;
  fileData: File;
  isChecked = false;
  categoryData: any;
  splitCategory: any;
  rootCategory: any = '';
  parentCategory: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private CategoryService: CategoryService,
    private toastr: ToastrService
  ) { }

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
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.managePage();
    this.getCategory();
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      rootId: ['false', Validators.required],
      parentId: [],
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
      this.addCategory();
    }
  }

  getCategory() {
    this.CategoryService.getCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
      for (let i = 0; i < res?.result.length; i++) {
        if (res?.result[i].parentId && !res?.result[i].rootId) {
          this.categoryArray.push(res?.result[i].parentId.name + ' > ' + res?.result[i].name);
        }
        if (!res?.result[i].parentId && res?.result[i].rootId) {
          this.categoryArray.push(res?.result[i].rootId.name + ' > ' + res?.result[i].name);
        }
        if (res?.result[i].parentId && res?.result[i].rootId) {
          if (res?.result[i].parentId._id != res?.result[i].rootId._id) {
            this.categoryArray.push(res?.result[i].rootId.name + ' > ' + res?.result[i].parentId.name + ' > ' + res?.result[i].name);
          } else if (res?.result[i].parentId._id == res?.result[i].rootId._id) {
            this.categoryArray.push(res?.result[i].rootId.name + ' > ' + res?.result[i].name);
          }
        }
        if (!res?.result[i].parentId && !res?.result[i].rootId) {
          this.categoryArray.push(res?.result[i].name);
        }
      }
      this.categoryForm.get('parentId')?.setValue(this.categoryArray);
    });
  }

  updateBrand() { }

  addCategory() {
    const formData = new FormData();
    if (this.categoryForm.get('rootId')?.value == 'true') {
      this.categoryForm.get('parentId')?.setValue('');
      this.rootCategory = '';
      this.parentCategory = '';
      formData.append('isRoot', 'true');
    }

    if (this.categoryForm.get('parentId')?.value.includes('>')) {
      this.splitCategory = this.categoryForm.get('parentId')?.value.split(' > ');
      for (let i = 0; i < this.categoryData.length; i++) {
        if (this.splitCategory[0] == this.categoryData[i].name) {
          this.rootCategory = this.categoryData[i]._id;
        }
        if (this.splitCategory[this.splitCategory.length - 1] == this.categoryData[i].name) {
          this.parentCategory = this.categoryData[i]._id;
        }
      }
    } else {
      this.splitCategory = this.categoryForm.get('parentId')?.value;
      for (let i = 0; i < this.categoryData.length; i++) {
        if (this.categoryData[i].name == this.splitCategory[0]) {
          this.rootCategory = this.categoryData[i]._id;
          this.parentCategory = this.categoryData[i]._id;
        }
      }
      for (let i = 0; i < this.splitCategory.length; i++) { }
    }

    if (!this.categoryForm.valid) {
      console.error('Validation error');
      return;
    }

    if (this.fileData != null && this.fileData != undefined) {
      formData.append('file', this.fileData);
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
