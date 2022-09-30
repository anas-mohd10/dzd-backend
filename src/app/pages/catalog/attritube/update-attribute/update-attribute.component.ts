import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { AttributeService } from '../../../../includes/services/attribute.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-update-attribute',
  templateUrl: './update-attribute.component.html',
  styleUrls: ['./update-attribute.component.scss'],
})
export class UpdateAttributeComponent implements OnInit {
  attributeForm: FormGroup;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;
  slug: any
  category: any;
  categoryData: any;
  status: boolean;
  type: any;
  textArray: any = [];
  colorArray: any = [];
  imageArray: any = [];
  textFlag: boolean = false;
  colorFlag: boolean = false;
  imageFlag: boolean = false;
  values: any = [];
  images: any = [];
  localdata: any = []
  url: any;
  filedata: any
  attribute: any;
  croppedImage: string | null | undefined;
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;
  imgs: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private AttributeService: AttributeService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.slug = this.route.snapshot.queryParams.category || '';
    this.attribute = this.route.snapshot.queryParams.attribute || '';
    this.initForm();
    this.managePage();
    this.getCategoryDetails();
  }

  initForm() {
    this.attributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['check', Validators.required],
      file: [''],
      values: [],
      colorValue: [],
      imageValue: [],
      isFiltered: ['false', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  get af() {
    return this.attributeForm.controls;
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

  addFile() {
    if (this.croppedImage) {
      this.imgs.push({
        id: this.imgs.length,
        url: this.croppedImage,
        name: this.filename
      })
      this.loadImage = false
      this.croppedImage = ''
      this.attributeForm.get('file')?.setValue('')
    }
  }

  removeFile(id: any) {
    this.imgs = this.imgs.filter((_data: any) => _data.id != id)
  }

  getCategoryDetails() {
    this.CategoryService.getCategoryBySlug(this.slug).subscribe((res) => {
      this.categoryData = res;
      this.category = this.categoryData.result[0]._id;
      return this.getAttributeDetails(this.attribute, this.category);
    });
  }

  getAttributeDetails(attribute: any, category: any) {
    this.AttributeService.getAttributeBuSlug(attribute, category).subscribe((res: any) => {
      this.attributeForm.get('name')?.setValue(res?.result[0].name);
      this.attributeForm.get('isActive')?.setValue(res?.result[0].isActive);
      this.attributeForm.get('isFiltered')?.setValue(res?.result[0].isFiltered);
      this.attributeForm.get('type')?.setValue(res?.result[0].type);
      this.type = res?.result[0].type
      if (this.type == 'text') {
        this.textFlag = true;
        this.colorFlag = false;
        this.imageFlag = false;
        this.textArray = res?.result[0].values;
      } else if (this.type == 'color') {
        this.textFlag = false;
        this.colorFlag = true;
        this.imageFlag = false;
        this.colorArray = res?.result[0].values;
      } else if (this.type == 'image') {
        this.textFlag = false;
        this.colorFlag = false;
        this.imageFlag = true;
        for (let file of res?.result[0].files) {
          this.localdata.push({
            id: this.localdata.length,
            url: '',
            file: file
          })
        }
      }
    }
    );
  }

  tagInput() {
    if (this.attributeForm.get('values')?.value != ' ' || '' || null) {
      this.textArray.push(this.attributeForm.get('values')?.value);
      this.attributeForm.get('values')?.setValue('');
    }
  }

  tagRemove(value: any) {
    const index = this.textArray.indexOf(value);
    if (index > -1) {
      this.textArray.splice(index, 1);
    }
  }

  changeValueType() {
    this.type = this.attributeForm.get('type')?.value;
    if (this.type == 'text') {
      this.textFlag = true;
      this.colorFlag = false;
      this.imageFlag = false;
    } else if (this.type == 'color') {
      this.textFlag = false;
      this.colorFlag = true;
      this.imageFlag = false;
    } else if (this.type == 'image') {
      this.textFlag = false;
      this.colorFlag = false;
      this.imageFlag = true;
    }
  }

  getColorCode() {
    this.colorArray.push(this.attributeForm.get('colorValue')?.value);
  }

  colorRemove(color: any) {
    const index = this.colorArray.indexOf(color);
    if (index > -1) {
      this.colorArray.splice(index, 1);
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

  updateBrand() {
    if (!this.attributeForm.valid) {
      console.log("Validation error");
      return;
    }

    const data = {
      name: this.attributeForm.get('name')?.value,
      type: this.attributeForm.get('type')?.value,
      isActive: this.attributeForm.get('isActive')?.value,
      isFiltered: this.attributeForm.get('isFiltered')?.value,
      values: [],
      files: [],
      category: this.category
    }
    if (this.type == 'color') {
      data.values = this.colorArray;
    } else if (this.type == 'text') {
      data.values = this.textArray;
    } else if (this.type == 'image') {
      data.files = this.imgs
      this.values = []
    }

    this.AttributeService.updateAttribute(this.attribute, this.category, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error('Something went wrong');
      } else if (res?.errorCode == 0) {
        this.toastr.success('Attribute updated successfully');
        this.router.navigate([this.appRoute.attribute.ATTRIBUTE_LIST], {
          queryParams: { category: this.slug },
        });
      }
    });
  }

  addBrand() { }
}
