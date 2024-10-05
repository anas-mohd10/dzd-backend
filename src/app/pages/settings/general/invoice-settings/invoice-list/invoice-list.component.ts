
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { InvoiceSettingsService } from 'src/app/includes/services/invoice.settings.service';
interface InvoiceProps {
  code: string;
  startingRange: number;
  orderStartingRange: number,
  invoiceTemplate: string;
}

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  appRoute = appRoutes
  form: FormGroup
  invoiceSettingsData: any = []
  task = PageTasks.ADD;
  editMode: boolean;
  isSubmitted: boolean;
  currentData: InvoiceProps;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private invoiceSettingsService: InvoiceSettingsService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getInvoice()
  }

  get formControls() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
      orderStartingRange: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      startingRange: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      invoiceTemplate: ['', Validators.required],
    });
  }

  getInvoice() {
    this.invoiceSettingsService.getInvoiceSettings().subscribe({
      next: (res: any) => {
        this.invoiceSettingsData = res?.result
        this.currentData = {
          code: res?.result?.code,
          orderStartingRange: res?.result?.orderStartingRange,
          startingRange: res?.result?.startingRange,
          invoiceTemplate: res?.result?.invoiceTemplate
        }
        this.form.patchValue(res?.result)
      }
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    let data = {
      code: this.form.get("code")?.value,
      startingRange: this.form.get("startingRange")?.value,
      orderStartingRange: this.form.get("orderStartingRange")?.value,
      invoiceTemplate: this.form.get("invoiceTemplate")?.value
    }
    if (this.currentData) {
      if (this.currentData["code"] == this.form.get("code")?.value
        && this.currentData["startingRange"] == this.form.get("startingRange")?.value
        && this.currentData["orderStartingRange"] == this.form.get("orderStartingRange")?.value
        && this.currentData["invoiceTemplate"] == this.form.get("invoiceTemplate")?.value) {
        this.HotToastService.info('Make any changes');
      } else {
        this.invoiceSettingsService.addInvoiceSettings(this.form.value).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.HotToastService.error('Something went wrong');
          } else if (res.errorCode == 0) {
            this.HotToastService.success('Invoice added successfully');
            this.router.navigateByUrl(this.appRoute.invoiceSettings.INVOICE_SETTINGS_LIST)
          }
        })
      }
    } else {
      this.invoiceSettingsService.addInvoiceSettings(data).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.HotToastService.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.HotToastService.success('Invoice added successfully');
          this.router.navigateByUrl(this.appRoute.invoiceSettings.INVOICE_SETTINGS_LIST)
        }
      })
    }
  }
}
