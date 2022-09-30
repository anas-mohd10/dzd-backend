import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
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
  isSubmitted = false;
  params: any;
  filedata: File;
  isChecked = false;
  categoryData: any;
  splitCategory: any;
  rootCategory: any = '';
  parentCategory: any = '';
  category: any;
  categoryValues: any;
  previewImg: any;
  parentIdValue: string;
  uploadedimg: any;
  croppedImage: string | null | undefined;
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;

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

  handleCheckBox() {
    console.log(this.categoryForm.get('isRoot')?.value);
    if (this.categoryForm.get('isRoot')?.value == 'false') {
      this.isChecked = false;
    } else if (this.categoryForm.get('isRoot')?.value == 'true') {
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
      isRoot: ['check', Validators.required],
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

  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  removeImage() {
    this.croppedImage = ''
    this.loadImage = false
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
    this.CategoryService.getCategoryBySlug(this.category).subscribe((res: any) => {
      this.categoryValues = res?.result[0];
      this.uploadedimg = this.categoryValues?.file;
      this.categoryForm.get('name')?.setValue(this.categoryValues.name);
      this.categoryForm.get('isRoot')?.setValue(this.categoryValues.isRoot);
      this.categoryForm.get('isActive')?.setValue(this.categoryValues.isActive);
      this.categoryForm.get('isFeatured')?.setValue(this.categoryValues.isFeatured);
      if (this.categoryValues.isRoot == true) {
        this.isChecked = true;
      } else {
        this.parentIdValue = this.categoryValues.rootId.name + ' > ' + this.categoryValues.parentId.name + ' > ' + this.categoryValues.name;
        this.categoryForm.get('parentId')?.setValue(this.parentIdValue);
      }
    }
    );
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
  updateBrand() {
    const data = {
      name: this.categoryForm.get('name')?.value,
      isRoot: this.categoryForm.get('isRoot')?.value,
      // root: this.root,
      // parent: this.parent,
      isActive: this.categoryForm.get('isActive')?.value,
      isFeatured: this.categoryForm.get('isFeatured')?.value,
      filestring: this.croppedImage,
      filename: this.filename
    }

    this.CategoryService.updateCategory(this.category, data).subscribe(
      (res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something Went Wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Category Added Successfully');
          this.router.navigate([this.appRoute.category.CATEGORY_LIST]);
        }
      }
    );
  }

  //Add Category
  addCategory() { }
}
