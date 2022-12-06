import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageTasks } from 'src/app/config/constants';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { InvoiceSettingsService } from 'src/app/includes/services/invoice.settings.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  appRoute = appRoutes
  invoiceSettingsForm: FormGroup
  invoiceSettingsData: any = []
  task = PageTasks.ADD;
  editMode: boolean;
  isSubmitted: boolean;
  currentData: { code: any; startingRange: any; };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceSettingsService: InvoiceSettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.managePage()
    this.initForm()
    this.task = this.route.snapshot.params.task || PageTasks.ADD;
    this.getInvoice()
  }

  get isf() {
    return this.invoiceSettingsForm.controls;
  }

  initForm() {
    this.invoiceSettingsForm = this.formBuilder.group({
      code: ['', Validators.required],
      startingRange: ['', Validators.required],
    });
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

  getInvoice() {
    this.invoiceSettingsService.getInvoiceSettings().subscribe((res: any) => {
      this.invoiceSettingsData = res?.result
      let isDataLem = this.invoiceSettingsData.length
      if (this.invoiceSettingsData.length > 0) {
        this.currentData = {
          code: res?.result[isDataLem - 1].code,
          startingRange: res?.result[isDataLem - 1].startingRange
        }
        this.invoiceSettingsForm.get("code")?.setValue(res?.result[isDataLem - 1].code)
        this.invoiceSettingsForm.get("startingRange")?.setValue(res?.result[isDataLem - 1].startingRange)
      }
    })
  }

  resetAll() {
    this.invoiceSettingsForm.get("code")?.setValue('')
    this.invoiceSettingsForm.get("startingRange")?.setValue('')
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.editMode) {
      this.updateInvoiceSettings();
    } else {
      this.addInvoiceSettings();
    }
  }

  updateInvoiceSettings() { }

  addInvoiceSettings() {
    if (!this.invoiceSettingsForm.valid) {
      return;
    }

    let data = {
      code: this.invoiceSettingsForm.get("code")?.value,
      startingRange: this.invoiceSettingsForm.get("startingRange")?.value
    }
    if (this.currentData) {
      if (this.currentData["code"] == this.invoiceSettingsForm.get("code")?.value
        && this.currentData["startingRange"] == this.invoiceSettingsForm.get("startingRange")?.value) {
        this.toastr.info('Make any changes');
      } else {
        this.invoiceSettingsService.addInvoiceSettings(data).subscribe((res: any) => {
          if (res.errorCode != 0) {
            this.toastr.error('Something went wrong');
          } else if (res.errorCode == 0) {
            this.toastr.success('Invoice added successfully');
            this.router.navigateByUrl(this.appRoute.invoiceSettings.INVOICE_SETTINGS_LIST)
            // window.open(this.appRoute.invoiceSettings.INVOICE_SETTINGS_LIST, '_self')
          }
        })
      }
    } else {
      this.invoiceSettingsService.addInvoiceSettings(data).subscribe((res: any) => {
        if (res.errorCode != 0) {
          this.toastr.error('Something went wrong');
        } else if (res.errorCode == 0) {
          this.toastr.success('Invoice added successfully');
          this.router.navigateByUrl(this.appRoute.invoiceSettings.INVOICE_SETTINGS_LIST)
          // window.open(this.appRoute.invoiceSettings.INVOICE_SETTINGS_LIST, '_self')
        }
      })
    }
  }
}
