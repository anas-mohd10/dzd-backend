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
  categories: any = [];
  isSubmitted = false;
  filedata: File;
  isChecked = false;
  categoryData: any;
  splitCategory: any;
  root: any = '';
  parent: any = '';

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
      root: ['false', Validators.required],
      parent: [],
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

  getCategory() {
    this.CategoryService.getCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
      for (let i = 0; i < res?.result.length; i++) {
        if (res?.result[i].parent && !res?.result[i].root) {
          this.categories.push(res?.result[i].parent.name + ' > ' + res?.result[i].name);
        }
        if (!res?.result[i].parent && res?.result[i].root) {
          this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].name);
        }
        if (res?.result[i].parent && res?.result[i].root) {
          if (res?.result[i].parent._id != res?.result[i].root._id) {
            this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].parent.name + ' > ' + res?.result[i].name);
          } else if (res?.result[i].parent._id == res?.result[i].root._id) {
            this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].name);
          }
        }
        if (!res?.result[i].parent && !res?.result[i].root) {
          this.categories.push(res?.result[i].name);
        }
      }
    });
  }

  handleInputChange(fileInput: any) {
    this.filedata = <File>fileInput.target.files[0];
  }

  handleCheckBox(event: any) {
    if (event.value == 'false') {
      this.isChecked = false;
    } else if (event.value == 'true') {
      this.isChecked = true;
    }
  }

  getParent(event: any) {
    let val = event.value
    let split = val.split(" > ")
    let len = split.length
    for (let category of this.categoryData) {
      if (len > 1) {
        if (split[0] == category.name) {
          this.root = category._id
        }
        if (split[len - 1] == category.name) {
          this.parent = category._id
        }
      } else if (len == 1) {
        if (split[0] == category.name) {
          this.root = category._id
          this.parent = category._id
        }
      }
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

  updateBrand() { }

  addCategory() {
    if (!this.categoryForm.valid) {
      console.error('Validation error');
      return;
    }

    const formdata = new FormData();
    if (this.categoryForm.get('root')?.value == 'true') {
      this.root = '';
      this.parent = '';
      formdata.append('isRoot', 'true');
    }
    if (this.filedata != null && this.filedata != undefined) {
      formdata.append('file', this.filedata);
    }
    for (const data of Object.keys(this.categoryForm.value)) {
      formdata.append(data, this.categoryForm.value[data]);

    }
    formdata.append('root', this.root);
    formdata.append('parent', this.parent);
    this.CategoryService.addCategory(formdata).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Category Added Successfully');
        this.router.navigate([this.appRoute.category.CATEGORY_LIST]);
      }
    });
  }
}
