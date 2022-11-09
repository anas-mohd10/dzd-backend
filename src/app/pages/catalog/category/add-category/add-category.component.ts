import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
  croppedImage: string | null | undefined;
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;
  path: any;
  catid: any;

  //Styling variables
  background: any
  border: any
  color: any

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private CategoryService: CategoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
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
      isRoot: ['false', Validators.required],
      parent: [],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
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
          this.categories.push(res?.result[i].parent.refid.name + ' > ' + res?.result[i].name);
        }
        if (!res?.result[i].parent && res?.result[i].root) {
          this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].name);
        }
        if (res?.result[i].parent && res?.result[i].root) {
          if (res?.result[i].parent.refid._id != res?.result[i].root._id) {
            this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].parent.refid.name + ' > ' + res?.result[i].name);
          } else if (res?.result[i].parent.refid._id == res?.result[i].root._id) {
            this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].name);
          }
        }
        if (!res?.result[i].parent && !res?.result[i].root) {
          this.categories.push(res?.result[i].name);
        }
      }
      this.cdr.markForCheck()
    });
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
    this.path = event.value
    let split = val.split(" > ")
    let len = split.length
    for (let category of this.categoryData) {
      if (len > 1) {
        if (split[0] == category.name) {
          this.root = category._id
        }
        if (split[len - 1] == category.name) {
          this.parent = category._id
          this.catid = category.catid
        }
      } else if (len == 1) {
        if (split[0] == category.name) {
          this.root = category._id
          this.parent = category._id
          this.catid = category.catid
        }
      }
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

  getColors(type: any, e: any) {
    if (type == "background") {
      this.background = e.value
    } else if (type == "border") {
      this.border = e.value
    } else if (type == "color") {
      this.color = e.value
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

    const data = {
      name: this.categoryForm.get('name')?.value,
      isRoot: this.categoryForm.get('isRoot')?.value,
      root: this.root,
      parent: { refid: this.parent, catid: this.catid },
      isActive: this.categoryForm.get('isActive')?.value,
      isFeatured: this.categoryForm.get('isFeatured')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      path: this.path,
      style: {
        background: this.categoryForm.get('background')?.value,
        border: this.categoryForm.get('border')?.value,
        radius: this.categoryForm.get('radius')?.value,
        text: {
          color: this.categoryForm.get('color')?.value,
          fontSize: this.categoryForm.get('fontSize')?.value,
          fontWeight: this.categoryForm.get('fontWeight')?.value,
        }
      }
    }

    if (data.isRoot == 'true') {
      delete data.root
      delete data.parent.refid
      delete data.parent.catid
      // delete data.path
    }

    this.CategoryService.addCategory(data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something Went Wrong');
      } else if (res.errorCode == 0) {
        this.toastr.success('Category Added Successfully');
        this.router.navigate([this.appRoute.category.CATEGORY_LIST]);
      }
    });
  }
}
