import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { VouchersService } from 'src/app/includes/services/vouchers.service';
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
  file: any
  preview: string = ''

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private VouchersService: VouchersService,
    private Toast: HotToastService
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

  createVoucher() {
    if (!this.form.valid) {
      this.isSubmitted = true
      return
    }

    let formdata = new FormData()
    formdata.append("file", this.file)
    for (let _key of Object.keys(this.form.value)) formdata.append(_key, this.form.value[_key])

    this.VouchersService.createVoucher(formdata).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.form.reset()
        this.ChangeDetectorRef.markForCheck()
        this.Toast.success(res.message)
      } else {

      }
    })
  }

}
