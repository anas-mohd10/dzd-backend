import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;

  selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }

  form: FormGroup;
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

  isRoot: boolean = true
  isArchived: boolean = false;

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
  banner: any;
  croppedBanner: any
  attributeForm!: FormGroup
  isAttrSubmitted: boolean = false

  coverModalRef?: BsModalRef;
  mediaModalRef?: BsModalRef;
  existModalRef?: BsModalRef;
  quesModalRef?: BsModalRef;
  @ViewChild('coverModal') coverModal: any;
  @ViewChild('mediaModal') mediaModal: any;
  @ViewChild('existingModal') existingModal: any;
  @ViewChild('quesModal') quesModal: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private CategoryService: CategoryService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private AttributeService: AttributeService,
    private BsModalService: BsModalService
  ) { }

  get bf() {
    return this.form.controls;
  }

  get af() {
    return this.attributeForm.controls;
  }

  isRootCategory(event: any) {
    event.target.value == 'false' ? this.isRoot = false : this.isRoot = true
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
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      isRoot: ['true', Validators.required],
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
    });

    this.attributeForm = new FormGroup({
      attributeName: new FormControl('', [Validators.required]),
      attributeType: new FormControl('', [Validators.required]),
      attributeStatus: new FormControl('true'),
      attributeFiltered: new FormControl('false')
    })
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



  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  bannerCropped(event: ImageCroppedEvent) {
    this.croppedBanner = event.base64;
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

      // this.AttributeService.getAttributeByCategory(this.categoryValues['catid']).subscribe((res: any) => {
      //   for (let value of res?.result) {
      //     this.attributes.push({
      //       name: value?.name,
      //       type: value?.type,
      //       isActive: value?.isActive,
      //       isFilter: value?.isFilter,
      //       values: value?.values,
      //       id: this.attributes.length,
      //       refid: value?.refid
      //     })
      //   }

      //   this.cdr.markForCheck()
      // })

      this.uploadedimg = this.categoryValues?.file;
      this.img = this.base + "/" + res?.result[0].file
      this.banner = res?.result[0].banner ? this.base + "/" + res?.result[0].banner : null
      this.form.get('name')?.setValue(this.categoryValues.name);
      this.form.get('isRoot')?.setValue(this.categoryValues.isRoot);
      this.form.get('isActive')?.setValue(this.categoryValues.isActive);
      this.form.get('isFeatured')?.setValue(this.categoryValues.isFeatured);
      this.form.get('isArchive')?.setValue(this.categoryValues.isArchive);
      this.form.get('parent')?.setValue(this.categoryValues.path);
      this.form.get('background')?.setValue(this.categoryValues.style?.background);
      this.form.get('border')?.setValue(this.categoryValues.style?.border);
      this.form.get('radius')?.setValue(this.categoryValues.style?.radius);
      this.form.get('color')?.setValue(this.categoryValues.style?.text?.color);
      this.form.get('fontWeight')?.setValue(this.categoryValues.style?.text?.fontWeight);
      this.form.get('fontSize')?.setValue(this.categoryValues.style?.text?.fontSize);

      this.border = this.categoryValues.style?.border
      this.background = this.categoryValues.style?.background
      this.color = this.categoryValues.style?.text.color
      this.parent = this.categoryValues?.parent?.refid?._id
      this.catid = this.categoryValues?.parent?.catid
      this.root = this.categoryValues?.root?._id
      this.path = this.categoryValues?.path

      this.categoryValues.isRoot ? this.isRoot = true : this.isRoot = false
      this.categoryValues.isArchive ? this.isArchived = true : this.isArchived = false

      this.cdr.markForCheck()
    });
  }

  getCategory() {
    this.CategoryService.getCategory().subscribe((res: any) => {
      this.categoryData = res?.result;

      for (let i = 0; i < res?.result.length; i++) {
        if (res?.result[i].isActive == true && res?.result[i].isArchive == false) {
          if (res?.result[i].parent && !res?.result[i].root) this.categories.push(res?.result[i].parent.refid.name + ' > ' + res?.result[i].name);
          if (!res?.result[i].parent && res?.result[i].root) this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].name);
          if (!res?.result[i].parent && !res?.result[i].root) this.categories.push(res?.result[i].name);
          if (res?.result[i].parent && res?.result[i].root) {
            if (res?.result[i].parent.refid._id != res?.result[i].root._id) {
              this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].parent.refid.name + ' > ' + res?.result[i].name);
            } else if (res?.result[i].parent.refid._id == res?.result[i].root._id) {
              this.categories.push(res?.result[i].root.name + ' > ' + res?.result[i].name);
            }
          }
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

  selectImage(file: any) {
    this.file = file
  }

  //Update exsisting category
  updateBrand() {
    if (!this.form.valid) {
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
      name: this.form.get('name')?.value,
      isRoot: this.form.get('isRoot')?.value,
      root: this.root,
      parent: { refid: this.parent, catid: this.catid },
      isActive: this.form.get('isActive')?.value,
      isFeatured: this.form.get('isFeatured')?.value,
      isArchive: this.form.get('isArchive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      path: this.path,
      file: this.file ? this.file : this.categoryValues?.file,
      bannerstring: this.croppedBanner,
      bannername: this.bannerFilename,
      banner: this.categoryValues?.banner,
      attributes: this.attributes,
      style: {
        background: this.form.get('background')?.value,
        border: this.form.get('border')?.value,
        radius: this.form.get('radius')?.value,
        text: {
          color: this.form.get('color')?.value,
          fontSize: this.form.get('fontSize')?.value,
          fontWeight: this.form.get('fontWeight')?.value,
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


  //Media managment starts
  handleInputChange(event: any) {
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
    this.BsModalService.show(this.mediaModal, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
    this.quesModalRef?.hide()
  }

  bannerFile(event: any) {
    this.bannerFiledata = <File>event.target.files[0];
    this.bannerFilename = this.bannerFiledata.name
    this.bannerChangedEvent = event;
    this.loadBanner = true
    this.BsModalService.show(this.coverModal, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
  }

  openQuesModal(template: TemplateRef<any>) {
    this.quesModalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered' });
  }

  openCoverModal(template: TemplateRef<any>) {
    this.coverModalRef = this.BsModalService.show(template);
  }

  openMediaModal(template: TemplateRef<any>) {
    this.mediaModalRef = this.BsModalService.show(template);
  }

  openExistingModal(template: TemplateRef<any>) {
    this.existModalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered' });
    this.quesModalRef?.hide()
  }

  closeMedia(type: any) {
    if (type == 'cover') {
      this.croppedBanner = ''
      this.bannerFilename = ''
    } else if (type == 'thumbnail') {
      this.croppedImage = ''
      this.filename = ''
    }
    this.BsModalService.hide()
  }

  saveMedia(type: any) {
    if (type == 'cover') {

    } else if (type == 'thumbnail') {

    }

    this.BsModalService.hide()
  }

  saveExistingMedia(type: any, image: any) {
    if (type == 'cover') {

    } else if (type == 'thumbnail') {

    }

    this.BsModalService.hide()
  }

  removeCoverImage() {

  }
  //Media management ends
}
