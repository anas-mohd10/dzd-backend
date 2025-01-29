import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { validators } from 'src/app/config/constants/mobile-validators';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-customers',
  templateUrl: './add-customers.component.html',
  styleUrls: ['./add-customers.component.scss']
})
export class AddCustomersComponent implements OnInit {
  task = PageTasks.ADD;
  editMode = false;
  appRoute = appRoutes
  form: FormGroup
  isSubmitted = false;
  isEmailExists: boolean = false
  isPhoneExists: boolean = false

  constructor(
    private CustomersService: CustomersService,
    private Router: Router,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
      ]),
      countryCode: new FormControl('+971', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      isActive: new FormControl('true'),
    });
    this.handleMobilePattern()
  }

  updateMobilePattern(newPattern: string) {
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get("countryCode")?.value) {
      case "+91":
        this.updateMobilePattern(`^[0-9]{${validators.india.validation.maximum}}$`);
        break;
      case "+971":
        this.updateMobilePattern(`^[0-9]{${validators.uae.validation.maximum}}$`);
        break;
      case "+964":
        this.updateMobilePattern(`^[0-9]{${validators.iraq.validation.maximum}}$`);
        break;
    }
  }

  get formControls() {
    return this.form.controls;
  }

  //Function to check whether the email address exists
  emailExists(emailString: any) {
    this.CustomersService.customerDetails({ email: emailString.value }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        if (res?.result) {
          this.isEmailExists = true
          this.HotToastService.error('Email address already exists')
        } else {
          this.isEmailExists = false
        }
      } else {
        this.HotToastService.error(res?.message)
      }
    })
  }
  //Function to check whether the email address exists

  //Function to check whether the phone exists
  phoneExists(phoneString: any) {
    this.CustomersService.customerDetails({
      countryCode: this.form.get('countryCode')?.value,
      mobile: phoneString.value
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        if (res?.result) {
          this.isPhoneExists = true
          this.HotToastService.error('Email address already exists')
        } else {
          this.isPhoneExists = false
        }
      } else {
        this.HotToastService.error(res?.message)
      }
    })
  }
  //Function to check whether the phone exists

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return;
    }

    let emailId: string = this.form.get('email')?.value;
    emailId = emailId.toLowerCase()
    this.form.patchValue({ email: emailId })

    if (this.isPhoneExists && this.isPhoneExists == true) {
      this.HotToastService.error('Email address / Phone already exists');
    } else {
      this.CustomersService.addCustomer(this.form.value).subscribe({
        next: (res: any) => {
          if (res.errorCode == 0) {
            this.HotToastService.success(res?.message);
            this.Router.navigate([this.appRoute.customers.CUSTOMERS_LIST]);
          } else if (res.errorCode == 0) {
            this.HotToastService.error(res?.message);
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.error?.message);
        }
      })
    }
  }
}
