import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AttributeService } from 'src/app/includes/services/attribute.service';
// import { ToastService } from 'src/app/includes/services/toast.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AppSettings } from 'src/app/config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryComponent implements OnInit {
  appRoute = appRoutes;
  base: any = ''
  categoryform: FormGroup
  attributeform: FormGroup

  categories: Array<any> = [];
  form: FormGroup;
  settings: any = {}
  page: number = 1
  limit: FormControl = new FormControl('15')
  lastPage: Boolean = false;
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
  attributes: Array<any> = []
  attributerefid: any;
  categoryslug: any;

  constructor(private CategoryService: CategoryService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private AttributeService: AttributeService,
    private ToastrService: ToastrService,
    private FormBuilder: FormBuilder,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router
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

  getNextPage() {
    this.page += 1
    this.getCategories()
  }

  getPreviousPage() {
    this.page -= 1
    this.getCategories()
  }

  getCategories() {
    this.CategoryService.searchCategory({ ...this.categoryform.value, page: this.page, limit: this.limit.value }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.page = res?.result?.page
        this.totalCount = res?.result?.total_item
        this.lastPage = res?.result?.lastPage
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.categoryform = this.formBuilder.group({
      keyword: [''],
      isActive: [''],
      isFeatured: [''],
    });

    this.attributeform = this.formBuilder.group({
      attributeName: [''],
      attributeType: [''],
      attributeColor: [''],
      attributeText: [''],
      attributeStatus: ['true'],
      attributeFiltered: ['false']
    })
  }

  onReload() {
    this.initForm()
    this.getCategories()
  }

  getAttributes(catid: any, name: any, slug: any) {
    this.categoryname = name
    this.catid = catid
    this.categoryslug = slug

    this.AttributeService.getAttributeByCategory(catid).subscribe((res: any) => {
      res?.errorCode == 0 ? this.attributes = res?.result : this.ToastrService.error(res?.message)
      this.ChangeDetectorRef.markForCheck()
    })
  }

  hideAttributesContainer() {
    this.showAttributes = !this.showAttributes;
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
  }

  getAttributeDetails(refid: any) {
    this.attributerefid = refid
    this.showModal = !this.showModal

    this.AttributeService.getAttributeById(this.catid, refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.attributevalues = res?.result
        this.attributeform.get('attributeName')?.setValue(res?.result?.head?.name)
        this.attributeform.get('attributeStatus')?.setValue(res?.result?.head?.isActive)
        this.attributeform.get('attributeFiltered')?.setValue(res?.result?.head?.isFiltered)
        this.attributeform.get('attributeType')?.setValue(res?.result?.head?.type)
        switch (res?.result?.head?.type) {
          case 'Color':
            this.showColorPicker = true
            for (let value of res?.result?.value) {
              this.attributecolors.push({
                id: this.attributecolors.length,
                value: value.value,
                refid: value.refid
              })
            }
            this.ChangeDetectorRef.markForCheck()
            break
          case 'Text':
            this.showTextInput = true
            for (let value of res?.result?.value) {
              this.attributetexts.push({
                id: this.attributetexts.length,
                value: value.value,
                refid: value.refid
              })
            }
            this.ChangeDetectorRef.markForCheck()
            break
          case 'File':
            this.showFileInput = true
            for (let value of res?.result?.value) {
              this.attributeimages.push({
                id: this.attributeimages.length,
                value: environment.base + "/" + value.value,
                refid: value.refid
              })
            }
            this.ChangeDetectorRef.markForCheck()
            break
        }
      } else {
        this.ToastrService.error(res?.message)
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  hideEditModal() {
    this.showModal = !this.showModal
    this.attributevalues = []
    this.attributetexts = []
    this.attributecolors = []
    this.attributeimages = []
    this.showColorPicker = false
    this.showTextInput = false
    this.showFileInput = false
  }

  navigateToUpdate() {
    this.Router.navigate([this.appRoute.category.UPDATE_CATEGORY], { queryParams: { category: this.categoryslug } })
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
  }

  //Attribute section start
  showAttributeSection() {
    this.showAttributes = !this.showAttributes
  }

  handleAttributeType(e: any) {
    this.attributetype = e.value
    switch (this.attributetype) {
      case 'Color':
        this.showColorPicker = true
        this.showTextInput = false
        this.showFileInput = false
        this.attributetexts = []
        this.attributeform.get('attributeText')?.setValue('')
        this.attributeimages = []
        break
      case 'Text':
        this.showColorPicker = false
        this.showTextInput = true
        this.showFileInput = false
        this.attributecolors = []
        this.attributeform.get('attributeColor')?.setValue(AppSettings.PRIMARY_COLOR)
        this.attributeimages = []
        break
      case 'File':
        this.showColorPicker = false
        this.showTextInput = false
        this.showFileInput = true
        this.attributetexts = []
        this.attributeform.get('attributeText')?.setValue('')
        this.attributecolors = []
        this.attributeform.get('attributeColor')?.setValue(AppSettings.PRIMARY_COLOR)
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
            this.attributeform.get('attributeText')?.setValue('')
          } else {
            this.ToastrService.error('Attribute text already exists')
          }
        } else {
          this.ToastrService.error('Attribute text cannot be null')
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

  closeModal() {
    this.attributevalues = []
    this.attributetexts = []
    this.attributecolors = []
    this.attributeimages = []
    this.showColorPicker = false
    this.showTextInput = false
    this.showFileInput = false
  }

  removeAttributeValues(key: any, id: any) {
    switch (key) {
      case 'color':
        for (let data of this.attributecolors) {
          if (data?.id == id) {
            if (data?.refid) {
              this.deleteAttributeValue(data?.refid)
            }
          }
        }
        this.attributecolors = this.attributecolors.filter((data: any) => data.id != id)
        break
      case 'text':
        for (let data of this.attributetexts) {
          if (data?.id == id) {
            if (data?.refid) {
              this.deleteAttributeValue(data?.refid)
            }
          }
        }
        this.attributetexts = this.attributetexts.filter((data: any) => data.id != id)
        break
      case 'file':
        for (let data of this.attributeimages) {
          if (data?.id == id) {
            if (data?.refid) {
              this.deleteAttributeValue(data?.refid)
            }
          }
        }
        this.attributeimages = this.attributeimages.filter((data: any) => data.id != id)
        break
    }
    if (this.attributecolors.length > 0 || this.attributetexts.length > 0 || this.attributeimages.length > 0) {
      this.showSaveButton = true
    } else if (this.attributecolors.length == 0 || this.attributetexts.length == 0 || this.attributeimages.length == 0) {
      this.showSaveButton = false
    }
  }

  deleteAttributeValue(id: any) {
    this.AttributeService.deleteAttribute(id).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ToastrService.success(res?.message)
      }
    })
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
    let values = []
    switch (this.attributeform.get('attributeType')?.value) {
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
      name: this.attributeform.get('attributeName')?.value,
      type: this.attributeform.get('attributeType')?.value,
      isActive: this.attributeform.get('attributeStatus')?.value,
      isFilter: this.attributeform.get('attributeFiltered')?.value,
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
  //Attribute section end
}
