import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})

export class UpdateProductComponent implements OnInit {
  productform: FormGroup;
  productheadform: FormGroup
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes;
  isSubmitted = false;

  filedata: File;
  fileThumbnaildata: File
  filebasicdata: File;
  type: any;
  isSingle: boolean = true;

  brandData: any;
  categoryData: any;
  taxClassData: any;
  productsData: any;

  searchKeyowrds: any = [];
  categoryNames: any = [];
  categoryid: any = [];

  returnValue: any;
  isReturn: boolean = false;
  isShipping: boolean = false;
  isCod: boolean = false;
  method: any;
  cod: any;

  relProductNames: any = [];
  relProductIds: any = [];

  croppedImage: string | null | undefined;
  thumbnailImage: string | null | undefined;
  basicImage: string | null | undefined;
  loadImage: boolean;
  loadThumbnailImage: boolean;
  loadBasicImage: boolean = false;
  imageChangedEvent: Event | undefined;
  imageThumbnailChangedEvent: Event | undefined;
  filename: any;
  thumbnailFilename: any
  basicfilename: any
  imageBasicChangedEvent: Event | undefined;

  //Styling variables
  background: any
  border: any
  color: any

  selectedCategories: any = []
  selectedBrand: any
  selectedProducts: any = []
  imageFiles: any = []
  files: any = []

  errors: any
  validError: any
  // url: any;
  format: string | undefined;
  url: string | ArrayBuffer | null | undefined;
  playVideo: boolean;
  video: string | ArrayBuffer | null;
  videoFile: any = {}
  disableButton: boolean = false;

  productfiles: any = []
  thumbnailfile: any = ''
  videofile: any = ''
  thumbnail: any
  productvideo: any

  selectedTax: any

  //categories
  maincategories: any = []
  selectedMainCategory: any
  subcategories: any = []
  selectedSubCategory: any
  showMainCategory: Boolean = false
  parentCategory: any = []
  subCategory: any = []
  selectedDefaultCategory: any
  headAdded: Boolean = false

  productHeadId: any
  basicfile: any = ''
  isUnit: Boolean = false
  producthhead: any
  attributes: any = []
  attrCardSelected: Boolean = false
  selectedAttribute: any = []
  attributesRefid: any = []
  attributesId: any = []
  showMedia: Boolean = false
  showProduct: Boolean = true
  slug: any;
  productheadfile: any;
  isArchived: Boolean = false
  restore = new FormControl('false')
  prodid: any
  img: string;
  vid: any = ''
  base: string;
  submitting: boolean;
  isVideo: boolean;
  settings: any = {}
  attributesValues: any = [];
  selectedAttributesValues: any = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Type here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'manrope', name: 'Manrope' },
      { class: 'Manrope', name: 'Manrope' },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private taxClassService: TaxClassesService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private AttributeService: AttributeService,
    private AppSettingsService: AppSettingsService
  ) { }

  get pf() {
    return this.productform.controls;
  }

  ngOnInit(): void {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.cdr.markForCheck()
      }
    })
    this.initForm();
    this.base = environment.base
    this.task = this.route.snapshot.params.task || PageTasks.UPDATE;
    this.prodid = this.route.snapshot.queryParams.id || ''

    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();

    this.categoryService.getMainCategories().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.maincategories = res?.result
        this.subcategories = [...this.maincategories, ...this.subcategories]
        this.cdr.markForCheck()
      }
    })

    this.productService.getProductbyId({ prodid: this.prodid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.isUnit = true

        this.productform.get('name')?.setValue(res?.result[0]?.name)

        this.productform.get('mrpPrice')?.setValue(res?.result[0]?.price?.mrp)
        this.productform.get('offerPrice')?.setValue(res?.result[0]?.price?.offer)

        this.categoryService.getSubCategoriesbyId(res?.result[0]?.product?.id?.parentCategory?.id).subscribe((res: any) => {
          if (res?.errorCode == 0) this.subcategories = res?.result
          this.cdr.markForCheck()
        })

        this.selectedSubCategory = res?.result[0]?.category?.id

        this.AttributeService.getAttributeByCategory(res?.result[0]?.product?.id?.defaultCategory?.refid).subscribe((res: any) => {
          if (res?.errorCode == 0) this.attributes = res?.result
          this.cdr.markForCheck()
        })

        if (res?.result[0]?.attributes.length > 0) {
          for (let attribute of res?.result[0]?.attributes) {
            this.attributesValues.push({
              head: { name: attribute?.head?.id?.name, id: attribute?.head?.id?._id, refid: attribute?.head?.id?.refid, type: attribute?.head?.id?.type },
              value: { name: attribute?.value?.id?.value, id: attribute?.value?.id?._id, refid: attribute?.value?.id?.refid }
            })
            this.selectedAttributesValues.push({
              type: attribute?.head?.id?.name,
              refid: attribute?.head?.id?.refid
            })
          }
        }

        this.productform.get('sku')?.setValue(res?.result[0]?.sku)
        this.productform.get('stock')?.setValue(res?.result[0]?.stock)
        this.productform.get('moq')?.setValue(res?.result[0]?.moq)
        this.productform.get('maxOrderQuantity')?.setValue(res?.result[0]?.maxOrderQuantity)
        this.productform.get('stockWarning')?.setValue(res?.result[0]?.stockWarning)
        this.productform.get('additionalbutton')?.setValue(res?.result[0]?.details?.additionalbutton)
        this.productform.get('buttonredireturl')?.setValue(res?.result[0]?.details?.buttonredireturl)

        this.productform.get('unit')?.setValue(res?.result[0]?.unit?.type)
        this.productform.get('value')?.setValue(res?.result[0]?.unit?.value)

        this.searchKeyowrds = res?.result[0]?.searchKeywords
        this.selectedProducts = res?.result[0]?.relatedProducts
        this.productform.get('isFeatured')?.setValue(res?.result[0]?.isFeatured)
        this.productform.get('isActive')?.setValue(res?.result[0]?.isActive)
        this.productform.get('isVisible')?.setValue(res?.result[0]?.isVisible)
        this.productform.get('isArchive')?.setValue(res?.result[0]?.isArchive)
        this.productform.get('description')?.setValue(res?.result[0]?.details?.description)
        this.productform.get('longDescription')?.setValue(res?.result[0]?.details?.longDescription)
        this.productform.get('features')?.setValue(res?.result[0]?.details?.features)

        if (res?.result[0]?.isArchive == true) this.isArchived = true

        this.productform.get('background')?.setValue(res?.result[0]?.style?.background)
        this.productform.get('border')?.setValue(res?.result[0]?.style?.border)
        this.productform.get('radius')?.setValue(res?.result[0]?.style?.radius)
        this.productform.get('color')?.setValue(res?.result[0]?.style?.text?.color)
        this.productform.get('fontSize')?.setValue(res?.result[0]?.style?.text?.fontSize)
        this.productform.get('fontWeight')?.setValue(res?.result[0]?.style?.text?.fontWeight)

        this.img = environment.base + "/" + res?.result[0]?.thumbnail
        this.vid = environment.base + "/" + res?.result[0]?.video
        this.isVideo = res?.result[0]?.video ? true : false

        for (let file of res?.result[0]?.files) {
          this.imageFiles.push({ fileString: '', filename: '', url: environment.base + "/" + file, id: this.imageFiles.length })
          this.files.push({ url: file, id: this.files.length })
        }

        this.cdr.markForCheck()
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    let products = [...this.imageFiles]
    moveItemInArray(products, event.previousIndex, event.currentIndex);
    this.imageFiles = [...products]
    let productsFiles = [...this.files]
    moveItemInArray(productsFiles, event.previousIndex, event.currentIndex);
    this.files = [...productsFiles]
  }

  initForm() {
    this.productform = this.formBuilder.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      mrpPrice: ['', Validators.required],
      offerPrice: [''],
      stock: ['', Validators.required],
      moq: ['', Validators.required],
      maxOrderQuantity: ['', Validators.required],
      stockWarning: [''],
      description: [''],
      features: [''],
      longDescription: [''],
      categories: [],
      additionalbutton: [''],
      buttonredireturl: [''],
      isActive: ['true', Validators.required],
      isVisible: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      value: [''],
      unit: [''],
      searchKeywords: [],
      relatedProducts: [],
      position: [''],
      file: [''],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });

    this.productform.get('background')?.setValue(AppSettings.BACKGROUND)
    this.background = AppSettings.BACKGROUND
    this.productform.get('border')?.setValue(AppSettings.BORDER)
    this.border = AppSettings.BORDER
    this.productform.get('color')?.setValue(AppSettings.COLOR)
    this.color = AppSettings.COLOR
    this.productform.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.productform.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.productform.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
  }

  tagInput(event: any) {
    let _value = event.value
    if (_value) {
      if (this.productform.get('searchKeywords')?.value != ' ' || '' || null) {
        this.searchKeyowrds.push(this.productform.get('searchKeywords')?.value);
        this.productform.get('searchKeywords')?.setValue('');
      }
    }
  }

  tagRemove(value: any) {
    this.searchKeyowrds = this.searchKeyowrds.filter((_data: any) => _data != value)
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

  getBrandDetail() {
    this.brandService.getActiveBrands().subscribe((res: any) => {
      this.brandData = res?.result;
    });
  }

  getCategoryDetail() {
    this.categoryService.getActiveCategory().subscribe((res: any) => {
      this.categoryData = res?.result;
    });
  }

  getTaxClassDetail() {
    this.taxClassService.getTaxClasses().subscribe((res: any) => {
      this.taxClassData = res?.result;
    });
  }

  getProducts() {
    this.productService.getProduct().subscribe((res: any) => {
      this.productsData = res?.result;
    });
  }

  addImage() {
    this.imageFiles.push({
      fileString: this.croppedImage,
      filename: this.filename,
      url: this.url,
      id: this.imageFiles.length
    })
    this.files.push({
      id: this.files.length,
      file: this.croppedImage,
      name: this.filename
    })
    this.croppedImage = ''
    this.filename = ''
    this.loadImage = false
  }

  removeFile(id: any) {
    console.log(this.imageFiles)
    console.log(this.files)

    this.imageFiles = this.imageFiles.filter((_data: any) => _data.id != id)
    this.files = this.files.filter((_data: any) => _data.id != id)
  }

  handleInputChange(event: any) {
    if (event.target.files.length > 0) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.url = e.target.result
      }
    }
    this.filedata = <File>event.target.files[0];
    this.filename = this.filedata.name
    this.imageChangedEvent = event;
    this.loadImage = true
    this.cdr.markForCheck()
  }

  handleInputThumbnailChange(event: any) {
    this.fileThumbnaildata = <File>event.target.files[0];
    this.thumbnailFilename = this.fileThumbnaildata.name
    this.imageThumbnailChangedEvent = event;
    this.loadThumbnailImage = true
    this.cdr.markForCheck()
  }

  imageCropped(event: ImageCroppedEvent) {
    setTimeout(() => {
      this.croppedImage = event.base64;
    }, 800)
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

  imageThumbnailCropped(event: ImageCroppedEvent) {
    setTimeout(() => {
      this.thumbnailImage = event.base64;
    }, 800)
  }

  thumbnailImageLoaded() {
    // show cropper
  }

  cropperThumbnailReady() {
    // cropper ready
  }

  loadThumbnailImageFailed() {
    // show message
  }

  removeThumbnailImage() {
    this.thumbnailImage = ''
    this.loadThumbnailImage = false
  }

  videoUpload(event: any) {
    if (event.target.files.length > 0) {
      let reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e: any) => {
        this.toastr.info('Video uploading in progress', '', { timeOut: 2000 })
        setTimeout(() => {
          this.video = e.target.result
          this.toastr.success('Video successfully uploaded', '', { timeOut: 2000 })
          this.videoFile = {
            video: this.video,
            name: event.target.files[0].name
          }
          this.cdr.markForCheck()
        }, 2000)
      }
    }
  }

  selectAttribute(attrType: any, type: any, id: any, refid: any, value: any, valueid: any, valuerefid: any) {
    if (this.selectedAttributesValues.some((e: any) => e.type === type)) {
      let index = this.attributesValues.findIndex((e: any) => e?.head?.name === type);
      this.attributesValues.splice(index, 1)
      this.attributesValues.splice(index, 0, {
        head: { name: type, id: id, refid: refid, type: attrType },
        value: { name: value, id: valueid, refid: valuerefid }
      })
      this.selectedAttributesValues.push({ type: type, refid: valuerefid })
    } else {
      this.attributesValues.push({
        head: { name: type, id: id, refid: refid, type: attrType },
        value: { name: value, id: valueid, refid: valuerefid }
      })
      this.selectedAttributesValues.push({ type: type, refid: valuerefid })
    }
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

  getUnit() {
    this.isUnit = true
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  updateProduct() {
    if (!this.productform.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.disableButton = true
      this.submitting = true
      setTimeout(() => {
        this.productService.updateProduct(this.prodid, payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
            this.submitting = false
            this.cdr.markForCheck()
          } else {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.product.PRODUCT_LIST]);
          }
        });
      }, 2000)
    }
  }

  addProduct() {
  }

  createPayload() {
    let categoryRefid = []
    for (let category of this.subcategories) {
      for (let _category of this.selectedSubCategory) {
        if (category?._id == _category) {
          categoryRefid.push(category.catid)
        }
      }
    }

    const data = {
      name: this.productform.get('name')?.value,
      sku: this.productform.get('sku')?.value,
      stock: this.productform.get('stock')?.value,
      moq: this.productform.get('moq')?.value,
      maxOrderQuantity: this.productform.get('maxOrderQuantity')?.value,
      price: {
        mrp: this.productform.get('mrpPrice')?.value,
        offer: this.productform.get('offerPrice')?.value,
      },
      style: {
        background: this.productform.get('background')?.value,
        border: this.productform.get('border')?.value,
        radius: this.productform.get('radius')?.value,
        text: {
          color: this.productform.get('color')?.value,
          fontSize: this.productform.get('fontSize')?.value,
          fontWeight: this.productform.get('fontWeight')?.value,
        }
      },
      unit: {
        value: this.productform.get('value')?.value,
        type: this.productform.get('unit')?.value,
      },
      details: {
        description: this.productform.get('description')?.value,
        longDescription: this.productform.get('longDescription')?.value,
        features: this.productform.get('features')?.value,
        additionalbutton: this.productform.get('additionalbutton')?.value,
        buttonredireturl: this.productform.get('buttonredireturl')?.value,
      },
      category: {
        id: this.selectedSubCategory,
        refid: categoryRefid
      },
      attributes: this.attributesValues,
      stockWarning: this.productform.get('stockWarning')?.value,
      isActive: this.productform.get('isActive')?.value,
      isArchive: this.productform.get('isArchive')?.value,
      isVisible: this.productform.get('isVisible')?.value,
      isFeatured: this.productform.get('isFeatured')?.value,
      searchKeywords: this.searchKeyowrds,
      relatedProducts: this.selectedProducts,
      files: this.files,
      video: this.videoFile,
      thumbFilename: this.thumbnailFilename,
      thumbFilestring: this.thumbnailImage,
      prodid: this.prodid
    }
    return data
  }

  restoreProduct() {
    if (this.restore.value == 'true') {
      this.productService.restoreProducts({ prodid: this.prodid }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.toastr.success(res?.message);
          this.router.navigate([this.appRoute.product.ARCHIVED_PRODUCT]);
        } else {
          this.toastr.error(res?.message);
        }
      })
    } else {
      this.router.navigate([this.appRoute.product.ARCHIVED_PRODUCT]);
    }
  }

  //<----- Product head management ----->
  goToNextTab(e: any) {
    switch (e) {
      case 'product':
        this.showProduct = true
        this.showMedia = false
        this.headAdded = true
        window.scrollTo(0, 0);
        break
      case 'media':
        this.showProduct = false
        this.showMedia = true
        this.headAdded = true
        window.scrollTo(0, 0);
        break
    }
  }

  goToPreviousTab(e: any) {
    switch (e) {
      case 'product':
        this.showProduct = true
        this.showMedia = false
        this.headAdded = true
        window.scrollTo(0, 0);
        break
      case 'basic':
        this.showProduct = false
        this.showMedia = false

        document.querySelector('.nav-home-tab')?.classList.add('active')
        this.headAdded = false
        window.scrollTo(0, 0);
        break
    }
  }
}
