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
  uniqueEmail: boolean;

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
      firstname: ['', Validators.required],
      lastname: [''],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      walletBalance: ['', Validators.required],
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

  checkEmail() {
    let email = this.customersForm.get("email")?.value
    this.customerService.getCustomerByMail(email).subscribe((res: any) => {
      if (res?.result.length != 0) {
        this.uniqueEmail = false
        this.toastr.error("Email already exists")
      } else {
        this.uniqueEmail = true
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

  updateCustomer() { }

  addCustomer() {
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
    if (this.uniqueEmail == true) {
      this.customerService.addCustomer(data).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Customer added successfully');
          this.router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
        }
      })
    } else {
      this.toastr.error('Email already exists');
    }
  }
}