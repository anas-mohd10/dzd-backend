import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';

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
  croppedImage: any;
  loadImage: boolean;
  imageChangedEvent: Event | undefined;
  filename: any;
  categories: any = [];
  root: any;
  parent: any;
  path: any;
  base: any
  img: any
  images: any = []
  file: any
  //Styling variables
  background: any
  border: any
  color: any

  restore = new FormControl('false');
  isArchived: boolean;
  catid: any;

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

  bannerFiledata: File;
  bannerFilename: string;
  bannerChangedEvent: any = '';
  loadBanner: boolean = false;
  bannerimg: any;
  croppedBanner : any

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private CategoryService: CategoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private AttributeService: AttributeService
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

    this.CategoryService.categoryImages({}).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.images = res?.result?.images
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      isRoot: ['check', Validators.required],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      parent: [''],
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

  bannerFile(event : any) {
    this.bannerFiledata = <File>event.target.files[0];
    this.bannerFilename = this.bannerFiledata.name
    this.bannerChangedEvent = event;
    this.loadBanner = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
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

  removeBanner() {
    this.croppedBanner = ''
    this.loadBanner = false
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

      this.AttributeService.getAttributeByCategory(this.categoryValues['catid']).subscribe((res: any) => {
        for (let value of res?.result) {
          this.attributes.push({
            name: value?.name,
            type: value?.type,
            isActive: value?.isActive,
            isFilter: value?.isFilter,
            values: value?.values,
            id: this.attributes.length,
            refid: value?.refid
          })
        }
        this.cdr.markForCheck()
      })

      this.uploadedimg = this.categoryValues?.file;
      this.img = this.base + "/" + res?.result[0].file
      this.bannerimg = this.base + "/" + res?.result[0].banner
      this.categoryForm.get('name')?.setValue(this.categoryValues.name);
      this.categoryForm.get('isRoot')?.setValue(this.categoryValues.isRoot);
      this.categoryForm.get('isActive')?.setValue(this.categoryValues.isActive);
      this.categoryForm.get('isFeatured')?.setValue(this.categoryValues.isFeatured);
      this.categoryForm.get('isArchive')?.setValue(this.categoryValues.isArchive);
      this.categoryForm.get('parent')?.setValue(this.categoryValues.path);
      this.categoryForm.get('background')?.setValue(this.categoryValues.style?.background);
      this.categoryForm.get('border')?.setValue(this.categoryValues.style?.border);
      this.categoryForm.get('radius')?.setValue(this.categoryValues.style?.radius);
      this.categoryForm.get('color')?.setValue(this.categoryValues.style?.text?.color);
      this.categoryForm.get('fontWeight')?.setValue(this.categoryValues.style?.text?.fontWeight);
      this.categoryForm.get('fontSize')?.setValue(this.categoryValues.style?.text?.fontSize);
      this.border = this.categoryValues.style?.border
      this.background = this.categoryValues.style?.background
      this.color = this.categoryValues.style?.text.color
      this.parent = this.categoryValues?.parent?.refid?._id
      this.catid = this.categoryValues?.parent?.catid
      this.root = this.categoryValues?.root?._id
      this.path = this.categoryValues?.path
      if (this.categoryValues.isRoot == true) this.isChecked = true;
      if (this.categoryValues.isArchive == true) this.isArchived = true
      this.cdr.markForCheck()
    });
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

  selectImage(file: any) {
    this.file = file
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
      file: this.file ? this.file : this.categoryValues?.file,
      bannerstring :  this.croppedBanner,
      bannername : this.bannerFilename,
      banner : this.categoryValues?.banner,
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
      },
      catid: this.categoryValues.catid
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
