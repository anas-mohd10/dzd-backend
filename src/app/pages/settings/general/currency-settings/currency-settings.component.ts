import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { appRoutes } from 'src/app/config/routes';
import { CurrencyService } from 'src/app/includes/services/currency.service';
import { codes } from 'currency-codes'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

interface CurrencyDoc {
  _id: string
  defaultCurrency: string
  currencies: string[]
  isAutomated: boolean
  conversionRates: { [key: string]: number }
}

const initialCurrencyDoc: CurrencyDoc = {
  _id: '',
  defaultCurrency: '',
  currencies: [],
  isAutomated: false,
  conversionRates: {}
}

@Component({
  selector: 'app-currency-settings',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.scss']
})
export class CurrencySettingsComponent implements OnInit {
  appRoute = appRoutes
  currencyCodes: string[] = codes()
  form: FormGroup = new FormGroup({})
  currencies: string[] = []
  isEditMode: Boolean = false
  isMultiCurrency: FormControl = new FormControl(false)
  availableCurrency: FormControl = new FormControl('')
  isSubmitted: Boolean = false
  currencyDoc: CurrencyDoc = initialCurrencyDoc
  conversionCurrencies: { currency: string, rate: number }[] = []
  modalRef: BsModalRef | null = null

  constructor(
    private BsModalService: BsModalService,
    private AppSettingsService: AppSettingsService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private CurrencyService: CurrencyService,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      currencies: new FormControl([], Validators.required),
      defaultCurrency: new FormControl('', Validators.required),
      isAutomated: new FormControl(false),
      conversionRates: new FormControl({}),
    })

    this.getSettings()

    this.fetchCurrencyDoc()
  }

  toggleMultiCurrency(event: { switchId: string, toggleState: boolean }) {
    this.AppSettingsService.updateSettings({ isMultiCurrency: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.getSettings()
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.isMultiCurrency.patchValue(res.result.isMultiCurrency)
          this.ChangeDetectorRef.detectChanges()
        } else {
          this.HotToastService.error(res.message)
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  onSwitchChange(event: { switchId: string, toggleState: boolean }) {
    this.form.patchValue({ [event.switchId]: event.toggleState })
  }

  toggleCurrency(type: 'add' | 'remove' = 'add', currencyValue?: string) {
    const currency: string = this.availableCurrency.value
    if (type === 'add') {
      const isExists: boolean = this.currencies.includes(currency)
      if (isExists) {
        this.currencies = this.currencies.filter(c => c !== currency)
        this.form.removeControl(`currency-${currency}`)
        this.HotToastService.success(`${currency} removed from the list`)
      } else {
        this.currencies.push(currency)
        this.form.addControl(`currency-${currency}`, new FormControl(1))
        this.HotToastService.success(`${currency} added to the list`)
      }
    } else if (type === 'remove') {
      this.currencies = this.currencies.filter(c => c !== currencyValue)
      this.form.removeControl(`currency-${currencyValue}`)
      this.HotToastService.success(`${currencyValue} removed from the list`)
    }
    this.availableCurrency.patchValue('')
    this.ChangeDetectorRef.markForCheck()
  }

  fetchCurrencyDoc() {
    this.CurrencyService.currencyDetails().subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.currencyDoc = res.result
          this.form.patchValue({
            defaultCurrency: res.result.defaultCurrency,
            isAutomated: res.result.isAutomated
          })
          this.currencies = res.result.currencies
          this.currencies.forEach((currency: string) => {
            this.form.addControl(
              `currency-${currency}`,
              new FormControl(res.result.conversionRates ? res.result.conversionRates[currency] : 1)
            )
          })
          this.isEditMode = true
          this.ChangeDetectorRef.detectChanges()
        } else {
          this.HotToastService.error(res.message)
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  open(template: TemplateRef<any>) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  forceSync() {

  }

  get formControls() {
    return this.form.controls
  }

  saveChanges() {
    const conversionRates: { [key: string]: number } = {};
    for (let formValue of Object.keys(this.form.controls)) {
      if (formValue.includes('currency-')) {
        conversionRates[formValue.split('-')[1]] = this.form.get(formValue)?.value;
      }
    }

    if (Object.keys(conversionRates).length === 0) {
      this.HotToastService.error('Conversion rates are required');
      return;
    }

    this.form.patchValue({ 
      conversionRates,
      currencies: this.currencies 
    });

    if (!this.form.valid) {
      this.isSubmitted = true;
      this.HotToastService.error('Please fill all the required fields');
      return;
    }

    if (this.isEditMode) {
      this.CurrencyService.updateCurrencyDetails(this.currencyDoc._id, this.form.value).subscribe({
        next: (res: any) => {
          if (res && res.errorCode == 0) {
            this.fetchCurrencyDoc()
            this.HotToastService.success(res.message)
          } else {
            this.HotToastService.error(res.message)
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message)
        }
      })
    } else {
      this.CurrencyService.createCurrencyDetails(this.form.value).subscribe({
        next: (res: any) => {
          if (res && res.errorCode == 0) {
            this.fetchCurrencyDoc()
            this.HotToastService.success(res.message)
          } else {
            this.HotToastService.error(res.message)
          }
        },
        error: (err: any) => {
          this.HotToastService.error(err.error.message)
        }
      })
    }

    this.isEditMode = false
    this.form.patchValue(initialCurrencyDoc)
    this.ChangeDetectorRef.markForCheck()
  }
}
