import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
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

  //Attrbiute variables
  showAttributes: Boolean = false
  attributetype: any;
  showColorPicker: Boolean = false
  showTextInput: Boolean = false
  showFileInput: Boolean = false
  attributecolors: any = []
  attributetexts: any = []
  attributeimages: any = []
  attributecroppped: string | null | undefined;
  loadAttributeImage: Boolean = false
  attrImageChange: Event | undefined
  attrfilename: any = ''
  attrfiledata: any = ''
  showSaveButton: Boolean = false
  attributes: any = []


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
      isArchive: ['false', Validators.required],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: [''],
      attributeName: [''],
      attributeType: [''],
      attributeColor: [''],
      attributeText: [''],
      attributeStatus: ['true'],
      attributeFiltered: ['false']
    });

    this.categoryForm.get('background')?.setValue(AppSettings.BACKGROUND)
    this.background = AppSettings.BACKGROUND
    this.categoryForm.get('border')?.setValue(AppSettings.BORDER)
    this.border = AppSettings.BORDER
    this.categoryForm.get('color')?.setValue(AppSettings.COLOR)
    this.color = AppSettings.COLOR
    this.categoryForm.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.categoryForm.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.categoryForm.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
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
      this.cdr.markForCheck()
      for (let i = 0; i < res?.result.length; i++) {
        if (res?.result[i].isActive == true && res?.result[i].isArchive == false) {
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
      }
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

  //Attribute section start
  // showAttributeSection() {
  //   this.showAttributes = !this.showAttributes
  // }

  handleAttributeType(e: any) {
    this.attributetype = e.value
    switch (this.attributetype) {
      case 'Color':
        this.showColorPicker = true
        this.showTextInput = false
        this.showFileInput = false
        this.attributetexts = []
        this.categoryForm.get('attributeText')?.setValue('')
        this.attributeimages = []
        break
      case 'Text':
        this.showColorPicker = false
        this.showTextInput = true
        this.showFileInput = false
        this.attributecolors = []
        this.categoryForm.get('attributeColor')?.setValue(AppSettings.PRIMARY_COLOR)
        this.attributeimages = []
        break
      case 'File':
        this.showColorPicker = false
        this.showTextInput = false
        this.showFileInput = true
        this.attributetexts = []
        this.categoryForm.get('attributeText')?.setValue('')
        this.attributecolors = []
        this.categoryForm.get('attributeColor')?.setValue(AppSettings.PRIMARY_COLOR)
        break
    }
  }

  handleAttrributeValues(key: any, e: any) {
    switch (key) {
      case 'color':
        this.attributecolors.push({
          id: this.attributecolors.length,
          value: e.value
        })
        break
      case 'text':
        if (e.value != '') {
          if (!this.valueExists(e.value)) {
            this.attributetexts.push({
              id: this.attributetexts.length,
              value: e.value
            })
            this.categoryForm.get('attributeText')?.setValue('')
          } else {
            this.toastr.error('Attribute text already exists')
          }
        } else {
          this.toastr.error('Attribute text cannot be null')
        }
        break
      case 'file':
        if (this.attributecroppped != '') {
          if (!this.imageValueExists(this.attributecroppped)) {
            this.attributeimages.push({
              id: this.attributeimages.length,
              value: this.attributecroppped,
              name: this.attrfilename
            })
            this.attributecolors = ''
            this.loadAttributeImage = false
          }
        }
    }
    if (this.attributecolors.length > 0 || this.attributetexts.length > 0 || this.attributeimages.length > 0) {
      this.showSaveButton = true
    } else if (this.attributecolors.length == 0 || this.attributetexts.length == 0 || this.attributeimages.length == 0) {
      this.showSaveButton = false
    }
  }

  valueExists(value: any) {
    return this.attributetexts.some((check: any) => {
      return check.value == value
    })
  }

  imageValueExists(value: any) {
    return this.attributeimages.some((check: any) => {
      return check.value == value
    })
  }

  removeAttributeValues(key: any, id: any) {
    switch (key) {
      case 'color':
        this.attributecolors = this.attributecolors.filter((data: any) => data.id != id)
        break
      case 'text':
        this.attributetexts = this.attributetexts.filter((data: any) => data.id != id)
        break
      case 'file':
        this.attributeimages = this.attributeimages.filter((data: any) => data.id != id)
        break
    }
    if (this.attributecolors.length > 0 || this.attributetexts.length > 0 || this.attributeimages.length > 0) {
      this.showSaveButton = true
    } else if (this.attributecolors.length == 0 || this.attributetexts.length == 0 || this.attributeimages.length == 0) {
      this.showSaveButton = false
    }
  }

  removeAttribute(id: any) {
    this.attributes = this.attributes.filter((data: any) => data.id != id)
  }

  handleAttrInputChange(event: any) {
    this.attrfiledata = <File>event.target.files[0];
    this.attrfilename = this.attrfiledata.name
    this.attrImageChange = event;
    this.loadAttributeImage = true
  }

  attrImageCropped(event: ImageCroppedEvent) {
    this.attributecroppped = event.base64;
  }

  attrImageLoaded() {
    // show cropper
  }

  attrCropperReady() {
    // cropper ready
  }

  loadAttrImageFailed() {
    // show message
  }

  removeAttrImage() {
    this.attributecroppped = ''
    this.loadAttributeImage = false
  }

  saveAttribute() {
    let name = this.categoryForm.get('attributeName')?.value
    let type = this.attributetype
    let status = this.categoryForm.get('attributeStatus')?.value
    let filtered = this.categoryForm.get('attributeFiltered')?.value
    let len = this.attributes.length
    if (name) {
      if (type) {
        if (status) {
          if (this.attributecolors.length > 0 || this.attributetexts.length > 0 || this.attributeimages.length > 0) {
            let values = []
            if (type == 'Color') {
              values = this.attributecolors
            } else if (type == 'Text') {
              values = this.attributetexts
            } else if (type == 'File') {
              values = this.attributeimages
            }
            this.attributes.push({
              name: name,
              type: type,
              isActive: status,
              isFiltered: filtered,
              values: values,
              id: this.attributes.length
            })
            let new_len = this.attributes.length
            if (new_len == (len + 1)) {
              this.categoryForm.get('attributeColor')?.setValue(AppSettings.PRIMARY_COLOR)
              this.categoryForm.get('attributeText')?.setValue('')
              this.categoryForm.get('attributeName')?.setValue('')
              this.categoryForm.get('attributeStatus')?.setValue('true')
              this.categoryForm.get('attributeType')?.setValue('')
              this.attributeimages = []
              this.attributetexts = []
              this.attributecolors = []
              this.showSaveButton = false
              this.showColorPicker = false
              this.showTextInput = false
              this.showFileInput = false
            }
          }
        }
      }
    }
  }
  //Attribute section end

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

    const payload = this.createPayload()
    if (payload) {
      this.CategoryService.addCategory(payload).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error(res?.message);
        } else if (res.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.category.CATEGORY_LIST]);
        }
      });
    } else {
      this.toastr.error('Category not created');
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
      attributes: this.attributes,
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
      delete data.path
    }

    return data
  }
}
