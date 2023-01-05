import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';

@Component({
  selector: 'app-add-customers',
  templateUrl: './add-customers.component.html',
  styleUrls: ['./add-customers.component.scss']
})
export class AddCustomersComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  customersForm: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean = false
  uniqueNum: boolean = false
  addresses: any = []
  address: any
  validBtn: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
  }

  initForm() {
    this.customersForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      countryCode: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      walletBalance: [''],
      isActive: ['true', Validators.required],
      type: [''],
      firstline: [''],
      secondline: [''],
      area: [''],
      city: [''],
      landmark: [''],
      pincode: ['',],
      lat: [''],
      lng: [''],
      state: [''],
    });
  }

  // [Validators.required, Validators.pattern("^[1-9]{1}[0-9]{2}[0-9]{3}$")]

  get cf() {
    return this.customersForm.controls;
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
    if (e.value) {
      data.mobile = e.value
    }
    this.customerService.getCustomerByNum(data).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueNum = false
        this.toastr.error("Mobile number already exists")
      } else {
        this.uniqueNum = true
      }
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

  addAddress() {
    if (this.customersForm.get("type")?.value) {
      if (this.customersForm.get("firstline")?.value) {
        if (this.customersForm.get("city")?.value) {
          if (this.customersForm.get("landmark")?.value) {
            if (this.customersForm.get("pincode")?.value) {
              if (this.customersForm.get("state")?.value) {
                this.addAddressFields()
                this.address = this.addresses[0]
                if (this.addresses.length > 0) {
                  this.validBtn = true
                }
                this.customersForm.get("firstline")?.setValue('')
                this.customersForm.get("secondline")?.setValue('')
                this.customersForm.get("area")?.setValue('')
                this.customersForm.get("city")?.setValue('')
                this.customersForm.get("pincode")?.setValue('')
                this.customersForm.get("state")?.setValue('')
                this.customersForm.get("lat")?.setValue('')
                this.customersForm.get("lng")?.setValue('')
                this.customersForm.get("landmark")?.setValue('')
                this.customersForm.get("type")?.setValue('')
              } else {
                this.toastr.error('Address state required! 😔');
              }
            } else {
              this.toastr.error('Address pincode required! 😔');
            }
          } else {
            this.toastr.error('Address landmark required! 😔');
          }
        } else {
          this.toastr.error('Address city required! 😔');
        }
      } else {
        this.toastr.error('Address line 1 required! 😔');
      }
    } else {
      this.toastr.error('Address type required! 😔');
    }
  }

  addAddressFields() {
    this.addresses.push({
      firstline: this.customersForm.get("firstline")?.value,
      secondline: this.customersForm.get("secondline")?.value,
      area: this.customersForm.get("area")?.value,
      city: this.customersForm.get("city")?.value,
      pincode: this.customersForm.get("pincode")?.value,
      state: this.customersForm.get("state")?.value,
      lat: this.customersForm.get("lat")?.value,
      lng: this.customersForm.get("lng")?.value,
      landmark: this.customersForm.get("landmark")?.value,
      type: this.customersForm.get("type")?.value,
      id: this.addresses.length + Math.floor(100 + Math.random() * 90)
    });
  }

  selectAddress(id: any) {
    this.address = this.addresses[id]
  }

  removeAddress(id: any) {
    const defaultaddress = this.addresses[id]
    if (defaultaddress == this.address) {
      this.address = {}
    }
    this.addresses.splice(id, 1)
    if (this.addresses.length > 0) {
      this.address = this.addresses[0]
    } else {
      this.toastr.error("Cannot remove this address, add more address to remove this.");
    }
  }

  updateCustomer() { }

  addCustomer() {
    if (!this.customersForm.valid) {
      this.toastr.error('Something wrong occured');
      return;
    }

    if (this.addresses.length > 0 && this.address) {
      let data = {
        name: this.customersForm.get("name")?.value,
        email: this.customersForm.get("email")?.value,
        countryCode: this.customersForm.get("countryCode")?.value,
        mobile: this.customersForm.get("mobile")?.value,
        address: this.address,
        checkoutAddress: this.addresses,
        walletBalance: this.customersForm.get("walletBalance")?.value,
        isActive: this.customersForm.get("isActive")?.value,
      }
      if (this.uniqueEmail == true && this.uniqueNum == true) {
        this.customerService.addCustomer(data).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error('Something went wrong');
          } else if (res.errorCode == 0) {
            this.toastr.success('Customer added successfully');
            this.router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
          }
        })
      } else {
        this.toastr.error('Email or Mobile number already exists');
      }
    } else {
      this.toastr.error('Add atleast one address to continue🙂');
    }
  }
}
