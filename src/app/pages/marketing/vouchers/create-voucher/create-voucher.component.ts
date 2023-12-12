import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-voucher',
  templateUrl: './create-voucher.component.html',
  styleUrls: ['./create-voucher.component.scss']
})
export class CreateVoucherComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  customers: Array<any> = []
  keyword: string;
  optedCustomer: any
  isToggle: boolean = false
  settings: any
  base: string = environment.base
  isSubmitted: boolean = false

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  get formControls() {
    return this.form.controls
  }

  ngOnInit(): void {
    this.getCustomers()

    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9]*)$')]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      countryCode: new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9]*)$')]),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^(0|[1-9]*)$')]),
      message: new FormControl('')
    })

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  toggleDropdown() {
    this.isToggle = !this.isToggle
  }

  getCustomers() {
    if (this.keyword) {
      this.CustomersService.searchCustomers({ page: 1, limit: 50, keyword: this.keyword }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.customers = res?.result?.data
            this.ChangeDetectorRef.markForCheck()
          } else {

          }
        }, error: (err: any) => {

        }
      })
    } else {
      this.customers = []
    }
  }

  optCustomer(customer: any) {
    this.customers = []
    this.keyword = ''
    this.optedCustomer = customer
  }

}
