import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CustomersService } from 'src/app/includes/services/customers.service';
import { VouchersService } from 'src/app/includes/services/vouchers.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-voucher',
  templateUrl: './update-voucher.component.html',
  styleUrls: ['./update-voucher.component.scss'],
})
export class UpdateVoucherComponent implements OnInit {
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
  voucherQuery: string;
  vocuherDetails: any;
  modalRef?: BsModalRef;

  constructor(
    private CustomersService: CustomersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private VouchersService: VouchersService,
    private Toast: HotToastService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private BsModalService: BsModalService
  ) {}

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.voucherQuery = this.ActivatedRoute.snapshot.params.voucher || '';

    this.form = new FormGroup({
      user: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      countryCode: new FormControl('', Validators.required),
      voucher: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      message: new FormControl(''),
    });

    this.VouchersService.getVoucherDetails(this.voucherQuery).subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.vocuherDetails = res?.result;
          for (let key of Object.keys(res?.result))
            this.form.get(key)?.setValue(res?.result[key]);
          this.vocuherDetails?.background
            ? (this.preview =
                this.base + '/' + this.vocuherDetails?.background?.path)
            : null;
          this.form.get('user')?.setValue(res?.result?.user?.name);
          this.ChangeDetectorRef.markForCheck();
        }
      }
    );

    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    );
  }

  toggleDropdown() {
    this.isToggle = !this.isToggle;
  }

  handleMedia(event: any) {
    this.form.get('background')?.setValue(event?._id);
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

  optCustomer(customer: any) {
    this.customers = [];
    this.keyword = '';
    this.optedCustomer = customer;
    this.form.get('user')?.setValue(customer?.name);
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  decline() {
    this.modalRef?.hide();
  }

  confirm() {
    this.VouchersService.deleteVoucher(this.vocuherDetails?.refid).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Router.navigate([appRoutes.vouchers.list]);
          this.Toast.success(res.message);
          this.modalRef?.hide();
        } else {
          this.Toast.error(res.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err.error.message);
      },
    });
  }

  onSubmit() {
    this.form.get('user')?.setValue(this.vocuherDetails?.user?._id);

    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    let formdata = new FormData();
    for (let _key of Object.keys(this.form.value))
      formdata.append(_key, this.form.value[_key]);
    this.file ? formdata.append('file', this.file) : null;
    formdata.append('refid', this.vocuherDetails?.refid);

    this.VouchersService.updateVoucher(formdata).subscribe({
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
