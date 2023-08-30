import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { ProductHeadService } from 'src/app/includes/services/product.head.service';
import { TaxClassesService } from 'src/app/includes/services/tax-classes.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-update-head',
  templateUrl: './update-head.component.html',
  styleUrls: ['./update-head.component.scss']
})
export class UpdateHeadComponent implements OnInit {
  @Input() prodid: string;
  productheadform: FormGroup
  basicdetails: any = []
  returnValue: string;
  isReturn: boolean;
  isShipping: boolean;
  method: any;
  cod: string;
  isCod: boolean;
  parentCategory: any = [];
  selectedMainCategory: any = [];
  maincategories: any = [];
  showMainCategory: boolean;
  selectedDefaultCategory: string;
  subcategories: any[];
  isSubmitted: boolean = false;
  selectedTax: any
  selectedBrand: any
  basicImage: string | null | undefined;
  loadBasicImage: boolean;
  filebasicdata: File;
  basicfilename: string;
  imageBasicChangedEvent: any;
  appRoute = appRoutes
  basicfile: any = '';
  brandData: any;
  taxClassData: any;
  basicrawfile: any;
  defaultcategories: any[];
  isClose: any

  constructor(
    private formBuilder: FormBuilder,
    private ProductHeadService: ProductHeadService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private CategoryService: CategoryService,
    private ToastrService: ToastrService,
    private BrandService: BrandService,
    private TaxClassesService: TaxClassesService,
    private Router: Router
  ) { }

  @Output() close = new EventEmitter();

  onAddressTypeChange() {
    this.close.emit(this.isClose);
  }

  get hf() {
    return this.productheadform.controls;
  }

  ngOnInit(): void {
    this.initForm()

    this.BrandService.getActiveBrands().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.brandData = res?.result;
        this.ChangeDetectorRef.markForCheck()
      }
    });

    this.CategoryService.getMainCategories().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.maincategories = res?.result
        this.getProductHead()
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.TaxClassesService.getTaxClasses().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.taxClassData = res?.result;
        this.ChangeDetectorRef.markForCheck()
      }
    });
  }

  getProductHead() {
    this.ProductHeadService.getproductHead(this.prodid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.basicdetails = res?.result[0]
        this.basicrawfile = this.basicdetails?.file
        this.basicfile = environment.base + "/" + this.basicdetails?.file
        this.selectedBrand = this.basicdetails?.brand
        this.selectedTax = this.basicdetails?.tax
        this.selectedMainCategory = this.basicdetails?.parentCategory?.id
        this.selectedDefaultCategory = this.basicdetails?.defaultCategory?.id
        this.productheadform.get('name')?.setValue(this.basicdetails?.name)
        this.productheadform.get('hsn')?.setValue(this.basicdetails?.hsn)
        this.productheadform.get('sku')?.setValue(this.basicdetails?.sku)
        this.productheadform.get('cod')?.setValue(this.basicdetails?.cod?.isPresent)
        this.productheadform.get('codCharge')?.setValue(this.basicdetails?.cod?.value)
        this.productheadform.get('shippingMethod')?.setValue(this.basicdetails?.shipping?.method)
        this.basicdetails?.shipping?.method == 'Paid' ? this.isShipping = true : this.isShipping = false
        this.basicdetails?.return?.isPresent == true ? this.isReturn = true : this.isReturn = false
        this.basicdetails?.cod?.isPresent == true ? this.isCod = true : this.isCod = false
        this.productheadform.get('shippingCost')?.setValue(this.basicdetails?.shipping?.value)
        this.productheadform.get('returnable')?.setValue(this.basicdetails?.return?.isPresent)
        this.productheadform.get('returnDays')?.setValue(this.basicdetails?.return?.value)
        this.productheadform.get('isActive')?.setValue(this.basicdetails?.isActive)
        this.productheadform.get('isArchive')?.setValue(this.basicdetails?.isArchive)
        this.CategoryService.getSubCategoriesbyId(this.basicdetails?.parentCategory?.id).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.defaultcategories = [...res?.result]
            this.appendMainCategory()
            this.showMainCategory = true
            this.ChangeDetectorRef.markForCheck()
          }
        })
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.productheadform = this.formBuilder.group({
      name: ['', Validators.required],
      hsn: [''],
      sku: ['', Validators.required],
      tax: [''],
      cod: ['false', Validators.required],
      codCharge: [0],
      returnable: ['false', Validators.required],
      returnDays: [0],
      shippingMethod: ['Unpaid', Validators.required],
      shippingCost: [0],
      isActive: ['true', Validators.required],
      isArchive: ['false', Validators.required],
    })
  }

  checkReturnable(event: any) {
    this.returnValue = event.value;
    if (this.returnValue == 'true') {
      this.isReturn = true;
    }
    if (this.returnValue == 'false') {
      this.isReturn = false;
    }
  }

  checkShippingMethod(event: any) {
    this.method = event.value;
    if (this.method === 'Paid') {
      this.isShipping = true;
    }
    if (this.method == 'Unpaid' || this.method == 'External') {
      this.isShipping = false;
    }
  }

  checkCod(event: any) {
    this.cod = event.value;
    if (this.cod == 'true') {
      this.isCod = true;
    }
    if (this.cod == 'false') {
      this.isCod = false;
    }
  }

  mainCategory() {
    this.CategoryService.getSubCategoriesbyId(this.selectedMainCategory).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.defaultcategories = [...res?.result]
        this.appendMainCategory()
        this.showMainCategory = true
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  appendMainCategory() {
    for (let _main of this.maincategories) {
      for (let _sel of this.selectedMainCategory) {
        if (_main?._id == _sel) {
          this.defaultcategories.push({
            _id: _main?._id,
            name: _main?.name,
            catid: _main?.catid
          })
        }
      }
    }
  }

  handleInputBasicChange(event: any) {
    this.filebasicdata = <File>event.target.files[0];
    this.basicfilename = this.filebasicdata.name
    this.imageBasicChangedEvent = event;
    this.loadBasicImage = true
    this.ChangeDetectorRef.markForCheck()
  }

  imageBasicCropped(event: ImageCroppedEvent) {
    setTimeout(() => {
      this.basicImage = event.base64;
    }, 800)
  }

  basicImageLoaded() {
    // show cropper
  }

  cropperBasicReady() {
    // cropper ready
  }

  loadBasicImageFailed() {
    // show message
  }

  removeBasicImage() {
    this.basicImage = ''
    this.loadBasicImage = false
  }

  hideEditModal() {
    console.log("hide edit modal");

    this.close.emit(this.isClose = true);
  }

  onSubmit() {
    if (!this.productheadform.valid) {
      this.ToastrService.error('Validation failed')
      return
    }

    const payload = this.createHeadPayload()
    if (payload) {
      this.ProductHeadService.updateProductHead(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.ToastrService.success(res?.message)
          document.location.reload()
        } else {
          this.ToastrService.error(res?.message)
        }
      })
    }
  }

  createHeadPayload() {
    let refids = []
    let refid = ''
    let file: any

    for (let category of this.maincategories) {
      for (let _cat of this.selectedMainCategory) {
        if (category?._id == _cat) {
          refids.push(category?.catid)
        }
      }
    }


    for (let category of this.defaultcategories) {
      if (this.selectedDefaultCategory == category?._id) {
        refid = category?.catid
      }
    }

    if (this.basicfilename != '' && this.basicImage) {
      file = {
        file: this.basicImage,
        name: this.basicfilename
      }
    } else {
      file = this.basicrawfile
    }

    let data = {
      name: this.productheadform.get('name')?.value,
      hsn: this.productheadform.get('hsn')?.value,
      sku: this.productheadform.get('sku')?.value,
      tax: this.selectedTax,
      brand: this.selectedBrand,
      isActive: this.productheadform.get('isActive')?.value,
      isArchive: this.productheadform.get('isArchive')?.value,
      parentCategory: {
        id: this.selectedMainCategory,
        refid: refids
      },
      defaultCategory: {
        id: this.selectedDefaultCategory,
        refid: refid
      },
      prodid: this.basicdetails?.prodid,
      cod: {
        isPresent: this.productheadform.get('cod')?.value,
        value: this.productheadform.get('codCharge')?.value
      },
      shipping: {
        method: this.productheadform.get('shippingMethod')?.value,
        value: this.productheadform.get('shippingCost')?.value
      },
      return: {
        isPresent: this.productheadform.get('returnable')?.value,
        value: this.productheadform.get('returnDays')?.value
      },
      file: file
    }

    return data
  }
}
