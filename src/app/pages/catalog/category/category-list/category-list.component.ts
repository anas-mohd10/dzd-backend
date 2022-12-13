import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { CategoryService } from '../../../../includes/services/category.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  base: any
  categoryform: FormGroup
  categories: any = []
  attributeform: FormGroup

  //Page and limit for query
  page: any = 1;
  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  limit: any;
  selectedpage: any = 1
  max: any = 3

  //Total no. of data from backend
  totalcount: any;
  totaldata: any;
  count: any = 0

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any

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
  attributes: any = []
  attributerefid: any;
  categoryslug: any;

  constructor(private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
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
    setTimeout(() => {
      this.setPages()
    })

    this.categoryService.searchCategory(this.categoryform.value, this.page).subscribe((res: any) => {
      this.categories = res?.result?.data;
      this.count = this.categories.length
      this.totalcount = res?.result?.total_item
      this.limit = res?.result?.items_per_page
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.setPages()
      this.cdr.markForCheck();
    });
  }

  initForm() {
    this.categoryform = this.formBuilder.group({
      name: [''],
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
    this.categoryform.get('name')?.setValue('')
    this.categoryform.get('isActive')?.setValue('')
    this.categoryform.get('isFeatured')?.setValue('')
    this.searchCategory()
  }

  searchCategory() {
    this.currpage = 1
    this.categoryService.searchCategory(this.categoryform.value, this.page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.count = this.categories.length
        this.totalcount = res?.result?.total_item
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
      }
    })
  }

  fetchBrand(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.categoryform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.categoryform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.categoryform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.categoryform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.categoryform.value, this.currpage, this.limit)
      } else {
        this.getData(this.categoryform.value, this.currpage, this.limit)
      }
    }
  }

  setPages() {
    this.currpage = 1
    this.selectedpage = 1
    this.pages.length = 0
    if (this.totaldata > 3) {
      for (let i = 1; i <= this.max; i++) {
        this.pages.push(i)
      }
    } else {
      for (let i = 1; i <= this.totaldata; i++) {
        this.pages.push(i)
      }
    }
  }

  getData(data: any, page: any, limit: any) {
    this.categoryService.searchCategory(data, page).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.count = this.categories.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }

  showAttributesContainer(catid: any, name: any, slug: any) {
    this.showAttributes = !this.showAttributes;
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
    this.categoryname = name
    this.catid = catid
    this.categoryslug = slug

    this.AttributeService.getAttributeByCategory(catid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.attributes = res?.result
        this.attributeslength = this.attributes.length
      } else {
        this.ToastrService.error(res?.message)
      }
      this.cdr.markForCheck()
    })
  }

  hideAttributesContainer() {
    this.showAttributes = !this.showAttributes;
    let bodyEl = document.querySelector('body');
    bodyEl?.classList.toggle('overflow-hidden')
  }

  showEditModal(refid: any) {
    this.attributerefid = refid
    this.showModal = !this.showModal
    // let bodyEl = document.querySelector('body');
    // bodyEl?.classList.toggle('overflow-hidden')

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
            this.cdr.markForCheck()
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
            this.cdr.markForCheck()
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
            this.cdr.markForCheck()
            break
        }
      } else {
        this.ToastrService.error(res?.message)
        this.cdr.markForCheck()
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
        this.AttributeService.getAttributeByCategory(res?.result?.category?.refid).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.attributes = res?.result
            this.attributeslength = this.attributes.length
          } else {
            this.ToastrService.error(res?.message)
          }
          this.cdr.markForCheck()
        })
        this.attributevalues = []
        this.attributetexts = []
        this.attributecolors = []
        this.attributeimages = []
        this.showColorPicker = false
        this.showTextInput = false
        this.showFileInput = false
        this.showModal = !this.showModal;
        this.cdr.markForCheck()
      } else {
        this.ToastrService.error(res?.message)
      }
    })
  }
  //Attribute section end
}
