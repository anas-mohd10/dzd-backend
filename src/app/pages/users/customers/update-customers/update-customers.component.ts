
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-customers',
  templateUrl: './update-customers.component.html',
  styleUrls: ['./update-customers.component.scss']
})
export class UpdateCustomersComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ElementRef;
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  customersForm: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean = true;
  customerData: any;
  slug: any;
  uniqueNum: boolean;
  addresses: Array<any> = []
  address: any
  validBtn: boolean = false
  selectedID: any = ''
  selectedAddress: string = ''

  isAddressSubmitted: boolean = false
  addressForm: FormGroup
  defaultAddress: FormControl = new FormControl('')
  isEditAddress: boolean = false
  addressDetails: any = {}

  deleteModalRef?: BsModalRef

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.customer || ''
    this.getCustomerDetails()
    this.getAddress()
  }

  initForm() {
    this.customersForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      walletBalance: [''],
      isActive: ['true', Validators.required],
    });

    this.addressForm = new FormGroup({
      name: new FormControl(''),
      countryCode: new FormControl(''),
      mobile: new FormControl('', [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]{10}$")]),
      firstlane: new FormControl('', Validators.required),
      secondlane: new FormControl(''),
      city: new FormControl('', Validators.required),
      area: new FormControl(''),
      landmark: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      pincode: new FormControl(''),
      state: new FormControl('', Validators.required),
      lat: new FormControl(''),
      lng: new FormControl(''),
    })
  }

  get cf() {
    return this.customersForm.controls;
  }

  get addressControls() {
    return this.addressForm.controls;
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

  checkEmail(e: any) {
    const data = { email: '' }
    if (e.value) {
      data.email = e.value
    }
    this.customerService.getCustomerByMail(data).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueEmail = false
        this.toastr.error("Email already exists")
      } else {
        this.uniqueEmail = true
      }
    })
  }

  validateNumber(e: any) {
    const data = { mobile: '' }
    if (e.value) data.mobile = e.value

    this.customerService.getCustomerByNum(data).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueNum = false
        this.toastr.error("Mobile number already exists")
      } else {
        this.uniqueNum = true
      }
    })
  }

  addAddress() {
    if (!this.addressForm.valid) {
      this.isAddressSubmitted = true
      return
    }

    let payload = {
      ...this.addressForm?.value,
      coordinates: {
        lat: this.addressForm?.get('lat')?.value,
        lng: this.addressForm?.get('lng')?.value,
      },
      customer: this.customerData?._id
    }

    if (!this.isEditAddress) {
      this.customerService.addAddress(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.getAddress()
          this.addressForm.reset()
          this.toastr.success(res?.message)
        } else {
          this.toastr.error(res?.message)
        }
      })
    } else {
      payload['refid'] = this.addressDetails?.refid
      this.customerService.updateCustomerAddress(payload).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.getAddress()
          this.addressForm.reset()
          this.toastr.success(res?.message)
        } else {
          this.toastr.error(res?.message)
        }
      })
    }
  }

  getAddress() {
    this.customerService.getAddress({ userid: this.slug }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.addresses = res?.result
        this.cdr.markForCheck()
      }
    })
  }

  editAddress(refid: any) {
    this.isEditAddress = true
    this.customerService.getAddressDetails(refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.addressDetails = res?.result
        for (let _key of Object.keys(res?.result)) {
          this.addressForm.get(_key)?.setValue(res?.result[_key])
          this.addressForm.get('lat')?.setValue(res?.result?.coordinates?.lat)
          this.addressForm.get('lng')?.setValue(res?.result?.coordinates?.lng)
          this.cdr.markForCheck()
        }
      }
    })
  }

  setDefaultAddress(refid: any) {
    this.customerService.updateDefaultAddress(refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getAddress()
        this.toastr.success(res?.message)
        this.cdr.markForCheck()
      }
    })
  }

  selectAddress(refid: any) {
    this.selectedAddress = refid
  }

  confirm() {
    this.customerService.deleteAddress(this.selectedAddress).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getAddress()
        this.toastr.success(res?.message)
        this.cdr.markForCheck()
      }
    })
    this.deleteModalRef?.hide()
  }

  decline() {
    this.deleteModalRef?.hide()
  }

  openModal(template: TemplateRef<any>, address: any) {
    this.deleteModalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered' });
    this.selectedAddress = address
  }

  getCustomerDetails() {
    this.customerService.getCustomerBySlug(this.slug).subscribe((res: any) => {
      this.customerData = res?.result[0]
      this.customersForm.get("name")?.setValue(this.customerData.name)
      this.customersForm.get("mobile")?.setValue(this.customerData.mobile)
      this.customersForm.get("email")?.setValue(this.customerData.email)
      this.customersForm.get("countryCode")?.setValue(this.customerData.countryCode)
      this.customersForm.get("isActive")?.setValue(this.customerData.isActive)
      this.customersForm.get("walletBalance")?.setValue(this.customerData.walletBalance)
      this.cdr.markForCheck()
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateCustomer();
    } else {
      this.addCustomer();
    }
  }

  updateCustomer() {
    if (!this.customersForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }

    let data = {
      name: this.customersForm.get("name")?.value,
      email: this.customersForm.get("email")?.value,
      countryCode: this.customersForm.get("countryCode")?.value,
      mobile: this.customersForm.get("mobile")?.value,
      walletBalance: this.customersForm.get("walletBalance")?.value,
      isActive: this.customersForm.get("isActive")?.value,
    }
    this.customerService.updateCustomer(this.slug, data).subscribe((res: any) => {
      if (res.errorCode != 0) {
        this.toastr.error(res?.message);
      } else if (res.errorCode == 0) {
        this.toastr.success(res?.message);
        this.router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
      }
    })
  }

  addCustomer() { }
}
