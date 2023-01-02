import { ProductService } from 'src/app/includes/services/product.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings, PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CategoryService } from 'src/app/includes/services/category.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  offerForm: FormGroup;
  appRoute = appRoutes;
  editMode = false;
  task = PageTasks.ADD;
  filedata: File;
  isSubmitted: boolean;

  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;

  //Styling variables
  background: any
  border: any
  color: any
  from_date: string;
  to_date: string;

  validDate: boolean = true;

  productsdata: any;
  products: []
  categoriesdata: any = []
  categories: any = []
  collectionsdata: any = []
  collections: any = []
  isValidValue: boolean;
  error_message: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private offerService: OfferService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private CategoryService: CategoryService,
    private CollectionService: CollectionService

  ) { }

  ngOnInit(): void {
    const get_date = new Date().getDate()
    const date = new Date()
    this.from_date = new Date(date.setDate(get_date + 1)).toISOString().split('T')[0]
    this.to_date = new Date(date.setDate(get_date + 3)).toISOString().split('T')[0]

    this.initForm();
    this.managePage();

    this.productService.getActiveProduct().subscribe((res: any) => {
      this.productsdata = res?.result
      this.cdr.markForCheck()
    })

    this.CategoryService.getActiveCategory().subscribe((res: any) => {
      this.categoriesdata = res?.result
      this.cdr.markForCheck()
    })

    this.CollectionService.getActiveCollection().subscribe((res: any) => {
      this.collectionsdata = res?.result
      this.cdr.markForCheck()
    })
  }

  initForm() {
    this.offerForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [''],
      description: ['', Validators.required],
      fromDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      type: ['', Validators.required],
      value: ['', Validators.required],
      isFeatured: ['false'],
      isActive: ['true'],
      categories: [],
      products: [],
      collections: [],
      background: [''],
      border: [''],
      radius: [''],
      color: [''],
      fontSize: [''],
      fontWeight: ['']
    });
    this.offerForm.get('fromDate')?.setValue(this.from_date)
    this.offerForm.get('lastDate')?.setValue(this.to_date)

    this.offerForm.get('background')?.setValue(AppSettings.BACKGROUND)
    this.background = AppSettings.BACKGROUND
    this.offerForm.get('border')?.setValue(AppSettings.BORDER)
    this.border = AppSettings.BORDER
    this.offerForm.get('color')?.setValue(AppSettings.COLOR)
    this.color = AppSettings.COLOR
    this.offerForm.get('radius')?.setValue(AppSettings.BORDER_RADIUS)
    this.offerForm.get('fontWeight')?.setValue(AppSettings.FONT_WEIGHT)
    this.offerForm.get('fontSize')?.setValue(AppSettings.FONT_SIZE)
  }

  get of() {
    return this.offerForm.controls;
  }

  // dateValidation() {
  //   const from = this.offerForm.get('fromDate')?.value
  //   const to = this.offerForm.get('lastDate')?.value
  //   if (from < this.from_date || from > to) {
  //     this.toastr.error('invalid date')
  //   } else if (to < this.to_date || to < from) {
  //     this.toastr.error('invalid date')
  //   } else {
  //     this.validDate = true
  //   }
  // }

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

  validateValue(_val: any) {
    const type = this.offerForm.get('type')?.value
    if (type == "%") {
      if (_val.value <= 100) {
        this.isValidValue = true
      } else {
        this.isValidValue = false
        this.error_message = 'Invalid value, kindly check and re-enter the value.'
      }
    } else {
      this.isValidValue = true
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateBrand();
    } else {
      this.addBrand();
    }
  }

  addBrand() {
    if (!this.offerForm.valid) {
      console.error("Validation error")
      return;
    }

    const payload = this.createPayload()
    if (payload) {
      if (this.isValidValue) {
        this.offerService.addOffer(payload).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error(res?.message);
          } else if (res.errorCode == 0) {
            this.toastr.success(res?.message);
            this.router.navigate([this.appRoute.offer.OFFER_LIST]);
          }
        });
      }
    }
  }

  createPayload() {
    const data = {
      name: this.offerForm.get('name')?.value,
      description: this.offerForm.get('description')?.value,
      fromDate: this.offerForm.get('fromDate')?.value,
      lastDate: this.offerForm.get('lastDate')?.value,
      isFeatured: this.offerForm.get('isFeatured')?.value,
      isActive: this.offerForm.get('isActive')?.value,
      filestring: this.croppedImage,
      filename: this.filename,
      value: this.offerForm.get('value')?.value,
      type: this.offerForm.get('type')?.value,
      categories: this.categories,
      products: this.products,
      collections: this.collections,
      style: {
        background: this.offerForm.get('background')?.value,
        border: this.offerForm.get('border')?.value,
        radius: this.offerForm.get('radius')?.value,
        text: {
          color: this.offerForm.get('color')?.value,
          fontSize: this.offerForm.get('fontSize')?.value,
          fontWeight: this.offerForm.get('fontWeight')?.value,
        }
      }
    }

    return data
  }

  updateBrand() { }
}
