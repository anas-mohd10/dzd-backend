import { ChangeDetectorRef, Component, OnInit, ElementRef } from '@angular/core';
import { AppSettings, PageTasks } from '../../../../config/constants';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { ProductService } from '../../../../includes/services/product.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { environment } from 'src/environments/environment.prod';
import { AttributeService } from 'src/app/includes/services/attribute.service';
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})

export class UpdateProductComponent implements OnInit {
  productform: FormGroup;
  productheadform: FormGroup
  task = PageTasks.ADD;
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
  restore: any
  prodid: any

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
    private AttributeService: AttributeService
  ) { }

  get pf() {
    return this.productform.controls;
  }

  ngOnInit(): void {
    this.initForm();

    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.prodid = this.route.snapshot.queryParams.id || ''

    this.managePage();
    this.getBrandDetail();
    this.getCategoryDetail();
    this.getTaxClassDetail();
    this.getProducts();

    this.categoryService.getMainCategories().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.maincategories = res?.result
        this.cdr.markForCheck()
      }
    })
 
    this.productService.getProductbyId({ prodid: this.prodid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        
      }
    })
  }

  initForm() {
    this.productform = this.formBuilder.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      mrpPrice: ['', Validators.required],
      offerPrice: [''],
      stock: ['', Validators.required],
      moq: ['', Validators.required],
      stockWarning: [''],
      description: [''],
      features: [''],
      categories: [],
      brandId: [''],
      additionalbutton: [''],
      buttonredireturl: [''],
      isActive: ['true', Validators.required],
      isFeatured: ['false', Validators.required],
      isArchive: ['false', Validators.required],
      value: ['', Validators.required],
      unit: ['', Validators.required],
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

  mainCategory() {
    this.parentCategory = []
    for (let _cat of this.maincategories) {
      for (let cat of this.selectedMainCategory) {
        if (_cat?._id == cat) {
          this.parentCategory.push({
            id: _cat?._id,
            name: _cat?.name,
            refid: _cat?.catid
          })
        }
      }
    }
    if (this.parentCategory.length > 0) {
      this.showMainCategory = true
    } else {
      this.selectedDefaultCategory = ''
      this.showMainCategory = false
    }
    for (let cat of this.parentCategory) {
      this.categoryService.getSubCategoriesbyId(this.parentCategory[0]).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.subcategories = [...res?.result]
          this.cdr.markForCheck()
        }
      })
    }
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

  selectAttribute(id: any, refid: any) {
    if (this.attributesRefid.includes(refid)) {
      let index = this.attributesRefid.indexOf(refid)
      if (index >= 0) {
        this.attributesRefid.splice(index, 1)
        this.selectedAttribute = this.selectedAttribute.filter((data: any) => data['refid'] != refid)
      }
    } else {
      this.selectedAttribute.push({ id: id, refid: refid })
      this.attributesRefid.push(refid)
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

  onSubmitAddMore() {
    this.productform.reset()
  }

  updateProduct() { }

  addProduct() {
    if (!this.productform.valid) {
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      this.disableButton = true
      this.toastr.info('Adding product...', '', { timeOut: 2000 })
      setTimeout(() => {
        this.productService.addProduct(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.product.PRODUCT_LIST]);
            this.ngOnInit();
          }
        });
      }, 2000)
    }
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
      product: {
        id: this.producthhead['_id'],
        refid: this.producthhead['prodid'],
      },
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
        features: this.productform.get('features')?.value,
        additionalbutton: this.productform.get('additionalbutton')?.value,
        buttonredireturl: this.productform.get('buttonredireturl')?.value,
      },
      category: {
        id: this.selectedSubCategory,
        refid: categoryRefid
      },
      attribute: {
        id: this.attributesId,
        refid: this.attributesRefid
      },
      stockWarning: this.productform.get('stockWarning')?.value,
      isActive: this.productform.get('isActive')?.value,
      isArchive: this.productform.get('isArchive')?.value,
      isFeatured: this.productform.get('isFeatured')?.value,
      searchKeywords: this.searchKeyowrds,
      relatedProducts: this.selectedProducts,
      files: this.files,
      video: this.videoFile,
      thumbFilename: this.thumbnailFilename,
      thumbFilestring: this.thumbnailImage
    }
    return data
  }

  restoreProduct() { }

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

  goToPreviousTab() {

  }
}
