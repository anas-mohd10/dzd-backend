import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';

@Component({
  selector: 'app-update-customers',
  templateUrl: './update-customers.component.html',
  styleUrls: ['./update-customers.component.scss']
})
export class UpdateCustomersComponent implements OnInit {
  task = PageTasks.UPDATE;
  editMode = false;
  appRoute = appRoutes
  customersForm: FormGroup
  isSubmitted = false;
  uniqueEmail: boolean = true;
  customerData: any;
  slug: any;
  uniqueNum: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm()
    this.managePage()
    this.slug = this.route.snapshot.queryParams.customer || ''
    this.getCustomerDetails()
  }

  initForm() {
    this.customersForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      walletBalance: [''],
      isActive: ['true', Validators.required],
      isHome: ['', Validators.required],
      firstline: ['', Validators.required],
      secondline: [''],
      area: [''],
      city: ['', Validators.required],
      landmark: ['', Validators.required],
      pincode: ['', Validators.required],
      lat: [''],
      lng: [''],
      state: ['', Validators.required],
    });
  }

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

  getCustomerDetails() {
    this.customerService.getCustomerBySlug(this.slug).subscribe((res: any) => {
      this.customerData = res?.result[0]
      this.customersForm.get("firstname")?.setValue(this.customerData.firstname)
      this.customersForm.get("lastname")?.setValue(this.customerData.lastname)
      this.customersForm.get("mobile")?.setValue(this.customerData.mobile)
      this.customersForm.get("email")?.setValue(this.customerData.email)
      this.customersForm.get("isActive")?.setValue(this.customerData.isActive)
      this.customersForm.get("walletBalance")?.setValue(this.customerData.walletBalance)
      this.customersForm.get("isHome")?.setValue(this.customerData.isHome)
      this.customersForm.get("firstline")?.setValue(this.customerData.address[0].firstline)
      this.customersForm.get("secondline")?.setValue(this.customerData.address[0].secondline)
      this.customersForm.get("area")?.setValue(this.customerData.address[0].area)
      this.customersForm.get("landmark")?.setValue(this.customerData.address[0].landmark)
      this.customersForm.get("city")?.setValue(this.customerData.address[0].city)
      this.customersForm.get("pincode")?.setValue(this.customerData.address[0].pincode)
      this.customersForm.get("lat")?.setValue(this.customerData.address[0].lat)
      this.customersForm.get("lng")?.setValue(this.customerData.address[0].lng)
      this.customersForm.get("state")?.setValue(this.customerData.address[0].state)
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
      firstname: this.customersForm.get("firstname")?.value,
      lastname: this.customersForm.get("lastname")?.value,
      email: this.customersForm.get("email")?.value,
      mobile: this.customersForm.get("mobile")?.value,
      isHome: this.customersForm.get("isHome")?.value,
      address: [{
        firstline: this.customersForm.get("firstline")?.value,
        secondline: this.customersForm.get("secondline")?.value,
        area: this.customersForm.get("area")?.value,
        city: this.customersForm.get("city")?.value,
        pincode: this.customersForm.get("pincode")?.value,
        state: this.customersForm.get("state")?.value,
        lat: this.customersForm.get("lat")?.value,
        lng: this.customersForm.get("lng")?.value,
        landmark: this.customersForm.get("landmark")?.value,
      }],
      walletBalance: this.customersForm.get("walletBalance")?.value,
      isActive: this.customersForm.get("isActive")?.value,
    }
    console.log(this.uniqueEmail);
    if (this.uniqueEmail == true) {
      this.customerService.updateCustomer(this.slug, data).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Customer updated successfully');
          this.router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
        }
      })
    } else {
      this.toastr.error('Email already exists');
    }
  }

  addCustomer() { }
}
