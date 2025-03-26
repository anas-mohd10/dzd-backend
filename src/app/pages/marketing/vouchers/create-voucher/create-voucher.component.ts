import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { validators } from 'src/app/config/constants/mobile-validators';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { VouchersService } from 'src/app/includes/services/vouchers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.scss'],
})
export class CreateVoucherComponent implements OnInit {
  appRoute = appRoutes;
  form: FormGroup;
  customers: Array<any> = [];
  keyword: string;
  optedCustomer: any;
  isToggle: boolean = false;
  settings: any;
  base: string = environment.base;
  isSubmitted: boolean = false;
  file: any;
  preview: string = '';

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private VouchersService: VouchersService,
    private Toast: HotToastService,
    private Router: Router
  ) {}

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
      ]),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      countryCode: new FormControl('', Validators.required),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]),
      background: new FormControl(''),
      message: new FormControl('Hope you enjoy this Gift Card!'),
    });

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    );
  }

  updateMobilePattern(newPattern: string) {
    const validators = this.form.get('mobile')?.validator;
    const newValidators = [Validators.required];
    if (newPattern) newValidators.push(Validators.pattern(newPattern));
    this.form.get('mobile')?.setValidators(newValidators);
    this.form.get('mobile')?.updateValueAndValidity();
  }

  handleMobilePattern() {
    switch (this.form.get('countryCode')?.value) {
      case '+91':
        this.updateMobilePattern(
          `^[0-9]{${validators.india.validation.maximum}}$`
        );
        break;
      case '+971':
        this.updateMobilePattern(
          `^[0-9]{${validators.uae.validation.maximum}}$`
        );
        break;
    }
  }

  handleMedia(event: any) {
    this.form.get('background')?.setValue(event?._id);
  }

  toggleDropdown() {
    this.isToggle = !this.isToggle;
  }

  getCustomers() {
    if (this.keyword) {
      this.CustomersService.searchCustomers({
        page: 1,
        limit: 50,
        keyword: this.keyword,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.customers = res?.result?.data;
            this.ChangeDetectorRef.markForCheck();
          }
        },
      });
    } else {
      this.customers = [];
    }
  }

  // Update the optCustomer method
  optCustomer(customer: any) {
    this.customers = [];
    this.keyword = customer.name;
    this.optedCustomer = customer;
    
    // Auto-populate form fields
    this.form.patchValue({
      user: customer.name,
      name: customer.name,
      email: customer.email,
      countryCode: customer.countryCode,
      mobile: customer.mobile
    });
    
    // Trigger mobile pattern validation
    this.handleMobilePattern();
  }

  onSubmit() {
    this.form.get('user')?.setValue(this.optedCustomer?._id);
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.VouchersService.createVoucher({
      ...this.form.value,
      paymentStatus: 'success',
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.vouchers.list]);
          this.Toast.success(res.message);
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }
}
