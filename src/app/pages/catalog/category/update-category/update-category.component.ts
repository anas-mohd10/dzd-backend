import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';

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
  categories: any = [];
  root: any;
  parent: any;
  path: any;
  base: any
  img: any

  //Styling variables
  background: any
  border: any
  color: any

  restore = new FormControl('false');
  isArchived: boolean;
  catid: any;

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

  handleCheckBox() {
    if (this.categoryForm.get('isRoot')?.value == 'false') {
      this.isChecked = false;
    } else if (this.categoryForm.get('isRoot')?.value == 'true') {
      this.isChecked = true;
    }
  }

  ngOnInit(): void {
    this.base = environment.base
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
      isArchive: ['false', Validators.required],
      parentId: [''],
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
    }
  }

  getCategoryBySlug() {
    this.CategoryService.getCategoryBySlug(this.category).subscribe((res: any) => {
      this.categoryValues = res?.result[0];
      this.uploadedimg = this.categoryValues?.file;
      this.img = this.base + "/" + res?.result[0].file
      this.categoryForm.get('name')?.setValue(this.categoryValues.name);
      this.categoryForm.get('isRoot')?.setValue(this.categoryValues.isRoot);
      this.categoryForm.get('isActive')?.setValue(this.categoryValues.isActive);
      this.categoryForm.get('isFeatured')?.setValue(this.categoryValues.isFeatured);
      this.categoryForm.get('isArchive')?.setValue(this.categoryValues.isArchive);
      this.categoryForm.get('parentId')?.setValue(this.categoryValues.path);
      this.categoryForm.get('background')?.setValue(this.categoryValues.style.background);
      this.categoryForm.get('border')?.setValue(this.categoryValues.style.border);
      this.categoryForm.get('radius')?.setValue(this.categoryValues.style.radius);
      this.categoryForm.get('color')?.setValue(this.categoryValues.style.text.color);
      this.categoryForm.get('fontWeight')?.setValue(this.categoryValues.style.text.fontWeight);
      this.categoryForm.get('fontSize')?.setValue(this.categoryValues.style.text.fontSize);
      this.border = this.categoryValues.style.border
      this.background = this.categoryValues.style.background
      this.color = this.categoryValues.style.text.color
      this.parent = this.categoryValues?.parent?.refid?._id
      this.catid = this.categoryValues?.parent?.catid
      this.root = this.categoryValues?.root?._id
      this.path = this.categoryValues?.path
      this.cdr.markForCheck()
      if (this.categoryValues.isRoot == true) {
        this.isChecked = true;
      }
      if (this.categoryValues.isArchive == true) {
        this.isArchived = true
      }
    });
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

  //Update exsisting category
  updateBrand() {
    if (!this.categoryForm.valid) {
      console.error('Validation error');
      return;
    }
    const payload = this.createPayload()
    if (payload) {
      this.CategoryService.updateCategory(this.category, payload).subscribe(
        (res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.category.CATEGORY_LIST]);
          }
        }
      );
    } else {
      this.toastr.error('Category not updated');
    }
  }

  createPayload() {
    const data = {
      name: this.categoryForm.get('name')?.value,
      isRoot: this.categoryForm.get('isRoot')?.value,
      root: this.root,
      parent: { refid: this.parent, catid: this.catid },
      isActive: this.categoryForm.get('isActive')?.value,
      isFeatured: this.categoryForm.get('isFeatured')?.value,
      isArchive: this.categoryForm.get('isArchive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      path: this.path,
      file: '',
      style: {
        background: this.categoryForm.get('background')?.value,
        border: this.categoryForm.get('border')?.value,
        radius: this.categoryForm.get('radius')?.value,
        text: {
          color: this.categoryForm.get('color')?.value,
          fontSize: this.categoryForm.get('fontSize')?.value,
          fontWeight: this.categoryForm.get('fontWeight')?.value,
        }
      },
      catid: this.categoryValues.catid
    }
    if (this.uploadedimg != '') {
      data.file = this.uploadedimg
    }
    if (data.isRoot == 'true') {
      delete data.root
      delete data.parent.refid
      delete data.parent.catid
      delete data.path
    }
    return data
  }

  restoreBrand() {
    if (this.restore.value == "true") {
      this.CategoryService.restoreCategory({ catid: this.categoryValues?.catid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.category.ARCHIVED_CATEGORY]);
        } else {
          this.toastr.error(res?.message);
        }
      })
    } else {
      this.router.navigate([this.appRoute.category.ARCHIVED_CATEGORY]);
    }
  }
}
