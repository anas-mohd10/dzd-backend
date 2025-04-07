import { ProductService } from 'src/app/includes/services/product.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from 'src/app/includes/services/offer.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  form: FormGroup;
  appRoute = appRoutes;
  editMode = false;
  task = PageTasks.ADD;
  filedata: File;
  isSubmitted: boolean;
  croppedImage: string | null | undefined;
  loadImage: boolean;
  filename: string;
  imageChangedEvent: any;
  minDate: string = new Date().toISOString().split('T')[0];
  fromDate: string;
  toDate: string;
  validDate: boolean = true;
  products: Array<any> = []
  categories: Array<any> = []
  collections: Array<any> = []
  parents: Array<any> = []
  brands: Array<any> = []
  isValidValue: boolean = true;
  isProceedable: boolean = true
  dropdownInputs: Array<any> = []

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private HotToastService: HotToastService,
    private offerService: OfferService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const getDate = new Date().getDate()
    const date = new Date()
    this.fromDate = new Date(date.setDate(getDate)).toISOString().split('T')[0]
    this.toDate = new Date(date.setDate(getDate + 10)).toISOString().split('T')[0]

    this.initForm();
    this.managePage();
  }

  initForm() {
    this.form = this.FormBuilder.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['percentage'],
      offerType: ['complete'],
      value: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      isActive: ['true'],
    });

    this.form.get('startDate')?.setValue(this.fromDate)
    this.form.get('endDate')?.setValue(this.toDate)
  }

  get formControls() {
    return this.form.controls;
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

  validateValue() {
    let type = this.form.get('type')?.value
    let value = this.form.get('value')?.value
    type == 'percentage' ? value > 100 ? this.isValidValue = false : this.isValidValue = true : this.isValidValue = true
  }

  getTypes(type: string) {
    if (!type) return;
    if (type !== this.form.get('offerType')?.value) {
      switch (type) {
        case 'complete':
          this.products = [];
          this.collections = [];
          this.categories = [];
          this.brands = [];
          break;
        case 'products':
          this.collections = [];
          this.categories = [];
          this.brands = [];
          break;
        case 'collections':
          this.products = [];
          this.categories = [];
          this.brands = [];
          break;
        case 'categories':
          this.products = [];
          this.collections = [];
          this.brands = [];
          break;
        case 'parents':
          this.products = [];
          this.categories = [];
          this.collections = [];
          this.brands = [];
          break;
        case 'brands':
          this.products = [];
          this.collections = [];
          this.categories = [];
          break;
      }
    }
    this.dropdownInputs = []
    this.form.get('offerType')?.setValue(type);
    this.ChangeDetectorRef.markForCheck();
  }

  onSelect(event: { dropdownInputs: any[] }) {
    this.assignDropdownInputs(event.dropdownInputs)
    this.ChangeDetectorRef.markForCheck()
  }

  onRemoveSelected(item: any) {
    const isExists = this.dropdownInputs.some((input: any) => input._id === item._id)
    if (isExists) {
      this.HotToastService.info("Item removed successfully")
      this.dropdownInputs = this.dropdownInputs.filter((input: any) => input._id !== item._id);
    } else {
      this.HotToastService.success("Item added successfully")
      this.dropdownInputs.push(item);
    }

    this.assignDropdownInputs(this.dropdownInputs)
    this.ChangeDetectorRef.markForCheck()
  }

  assignDropdownInputs(dropdownInputs: any[]) {
    switch (this.form.get('offerType')?.value) {
      case 'products':
        this.products = dropdownInputs
        this.dropdownInputs = dropdownInputs
        break;
      case 'collections':
        this.collections = dropdownInputs
        this.dropdownInputs = dropdownInputs
        break;
      case 'categories':
        this.categories = dropdownInputs
        this.dropdownInputs = dropdownInputs
        break;
      case 'parents':
        this.parents = dropdownInputs
        this.dropdownInputs = dropdownInputs
        break;
      case 'brands':
        this.brands = dropdownInputs
        this.dropdownInputs = dropdownInputs
        break;
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
    if (!this.form.valid) {
      this.HotToastService.error('Please fill in all fields');
      this.isSubmitted = true
      return;
    }

    this.offerService.addOffer({
      ...this.form.value,
      offerType: this.form.get('offerType')?.value == 'complete' ? 'complete' : 'partial',
      categories: this.categories.length > 0 ? this.categories?.map((item: any) => item?._id) : null,
      products: this.products.length > 0 ? this.products?.map((item: any) => item?._id) : null,
      parents: this.parents.length > 0 ? this.parents?.map((item) => item?._id) : null,
      collections: this.collections.length > 0 ? this.collections?.map((item: any) => item?._id) : null,
      brands: this.brands.length > 0 ? this.brands?.map((item: any) => item?._id) : null,
    }).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.HotToastService.error(res?.message);
      } else if (res.errorCode == 0) {
        this.HotToastService.success(res?.message);
        this.Router.navigate([this.appRoute.offer.OFFER_LIST]);
      }
    })
  }

  updateBrand() { }
}
