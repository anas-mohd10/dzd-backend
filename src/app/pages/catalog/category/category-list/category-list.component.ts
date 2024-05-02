import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AppSettings } from 'src/app/config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-category',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryComponent implements OnInit {
  appRoute = appRoutes;
  base: any = ''
  form: FormGroup
  attributeForm: FormGroup

  categories: Array<any> = [];
  page: number = 1;
  limit: number = 40;
  totalResults: number = 0;
  totalPages: number = 1;
  isLastPage: Boolean = false;


  settings: any = {}



  totalCount: number = 0

  showAttributes: Boolean = false
  categoryname: any;
  attributeslength: any;
  showModal: Boolean = false
  catid: any;
  attributevalues: any;

  //Attrbiute variables
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

  attributerefid: any;
  categoryslug: any;

  categoryDetails: any = {}
  attributes: Array<any> = []
  attributeDetails: any
  isSubmitted: boolean = false;
  isText: boolean = false
  isColor: boolean = false
  isFile: boolean = false
  texts: Array<any> = []
  colors: Array<any> = []
  files: Array<any> = []
  values: Array<any> = []
  text: FormControl = new FormControl('')
  //Modal config starts
  attributeModalRef?: BsModalRef;
  @ViewChild('attributeModal') attributeModal: any;
  manageModalRef?: BsModalRef;
  @ViewChild('manageModal') manageModal: any;
  //Modal config ends

  get attributeFormControls() {
    return this.attributeForm.controls
  }

  constructor(private CategoryService: CategoryService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private AttributeService: AttributeService,
    private ToastrService: ToastrService,
    private FormBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.getCategories()
  }

  clearFilters() {
    this.initForm()
    this.getCategories()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getCategories()
  }

  getCategories() {
    this.CategoryService.searchCategory({
      ...this.form.value,
      page: this.page,
      limit: this.limit
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.page = res?.result?.page
        this.totalPages = res?.result?.totalPages
        this.totalResults = res?.result?.totalResults
        this.isLastPage = res?.result?.isLastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.form = new FormGroup({
      keyword: new FormControl(''),
      isActive: new FormControl(''),
      isFeatured: new FormControl(''),
    });

    this.attributeForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      isActive: ['true'],
      isFiltered: ['false'],
      isDelete: ['false']
    })
  }

  getAttributeDetails(attribute: any) {
    this.AttributeService.getAttributeDetails(this.categoryDetails?.catid, attribute).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.attributeDetails = res?.result
        } else {
          this.ToastrService.error(res?.message)
        }
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
  }

  saveAttribute() {
    let values = []
    switch (this.attributeForm.get('attributeType')?.value) {
      case 'Color':
        values = this.attributecolors
        break
      case 'Text':
        values = this.attributetexts
        break
      case 'File':
        values = this.attributeimages
        break
    }

    const data = {
      name: this.attributeForm.get('attributeName')?.value,
      type: this.attributeForm.get('attributeType')?.value,
      isActive: this.attributeForm.get('attributeStatus')?.value,
      isFilter: this.attributeForm.get('attributeFiltered')?.value,
      values: values,
      category: {
        id: this.attributevalues?.head?.category?.id?._id,
        refid: this.attributevalues?.head?.category?.id?.catid
      },
      attribute: {
        id: this.attributevalues?.head?._id,
        refid: this.attributevalues?.head?.refid
      }
    }

    this.AttributeService.updateAttribute(data).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
        setTimeout(() => {
          document.location.reload()
        }, 1000)
        this.ChangeDetectorRef.markForCheck()
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }

  openAttributeModal(template: TemplateRef<any>, category: any) {
    this.categoryDetails = category
    this.AttributeService.getAttributes(category.catid).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.attributes = res?.result
        } else {
          this.ToastrService.error(res?.message)
        }
        this.ChangeDetectorRef.markForCheck()
      }, error: (err: any) => {
        this.ToastrService.error(err?.message)
      }
    })
    this.attributeModalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered' });
  }

  openManageAttributeModal(template: TemplateRef<any>, attribute: any) {
    this.attributeModalRef?.hide()
    this.attributeDetails = attribute
    this.manageModalRef = this.BsModalService.show(template, { class: 'modal-xl modal-dialog-centered' });
    for (let _key of Object.keys(attribute)) this.attributeForm.get(_key)?.setValue(attribute[_key])
    attribute.type == 'text' ? this.isText = true : attribute.type == 'color' ? this.isColor = true : attribute.type == 'file' ? this.isFile = true : null
    for (let item of attribute.values) {
      switch (attribute.type) {
        case 'text':
          this.texts.push(item?.value)
          break
        case 'color':
          this.colors.push(item?.value)
          break
        case 'file':
          break
      }
    }
  }

  getAttributeType(event: any) {
    this.isText = event.target.value === 'text';
    this.isColor = event.target.value === 'color';
    this.isFile = event.target.value === 'file';
  }

  getAttributeValue(type: any, event: any) {
    switch (type) {
      case 'text':
        if (!this.texts.includes(event.target.value) && event.target.value) this.texts.push(event.target.value)
        this.text.setValue('')
        break
      case 'color':
        if (!this.colors.includes(event.target.value) && event.target.value) this.colors.push(event.target.value)
        break
      case 'file':
        break
    }
  }

  removeAttributeValue(type: any, value: any) {
    switch (type) {
      case 'text':
        this.texts = this.texts.filter((data: any) => data != value)
        break
      case 'color':
        this.colors = this.colors.filter((data: any) => data != value)
        break
      case 'file':
        break
    }
  }

  closeSubmit() {
    this.attributeDetails ? this.manageModalRef?.hide() : this.BsModalService?.hide()
    this.resetDetails()
  }

  onSubmit() {
    this.attributeForm.get('type')?.value == 'text' ?
      this.values = [...this.texts] : this.attributeForm.get('type')?.value == 'color' ?
        this.values = [...this.colors] : this.values = []

    if (!this.attributeForm.valid || this.values.length == 0) {
      this.ToastrService.error('Invalid form submission, kindly check all the fields and submit again.')
      return
    }

    if (this.attributeDetails) {
      this.AttributeService.updateAttribute({ ...this.attributeForm.value, values: this.values, category: this.categoryDetails?.catid, attribute: this.attributeDetails?.refid }).subscribe({
        next: (res: any) => {
          this.BsModalService.hide()
          this.ToastrService.success(res?.message)
          this.getCategories()
          this.resetDetails()
          this.ChangeDetectorRef.markForCheck()
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    } else {
      this.AttributeService.createAttribute({ ...this.attributeForm.value, values: this.values, category: this.categoryDetails?.catid }).subscribe({
        next: (res: any) => {
          this.BsModalService.hide()
          this.ToastrService.success(res?.message)
          this.getCategories()
          this.resetDetails()
          this.ChangeDetectorRef.markForCheck()
        }, error: (err: any) => {
          this.ToastrService.error(err?.message)
        }
      })
    }
  }

  resetDetails() {
    this.attributeForm.reset()
    this.texts = []
    this.colors = []
    this.files = []
    this.values = []
    this.text.setValue('')
  }
}
