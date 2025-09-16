import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { LocationService } from 'src/app/includes/services/location.service';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as countries from 'i18n-iso-countries';
import * as en from 'i18n-iso-countries/langs/en.json';
import * as ar from 'i18n-iso-countries/langs/ar.json';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

countries.registerLocale(en);
countries.registerLocale(ar);

interface Country {
  name: string;
  code: string;
}

interface dbCountry {
  _id: string;
  name: string;
  code: string;
  phoneCode: string;
}

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  appRoute = appRoutes;
  countries: Country[] = [];
  dbCountries: dbCountry[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalResults: number = 0;
  platformString: string = localStorage.getItem('language') || 'en';
  modalRef?: BsModalRef;
  bulkImportRef?: BsModalRef;
  importFile: FormControl = new FormControl(null);
  confirmationRef?: BsModalRef;
  toggledCountry: string | null;
  form: FormGroup = new FormGroup({})

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private LocationService: LocationService,
    private HotToastService: HotToastService,
    private Router: Router,
    private HttpClient: HttpClient,
    private BsModalService: BsModalService
  ) { }

  open(template: TemplateRef<any>, country?: any) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
    if (country) {
      this.form.patchValue(country)
    }
  }

  openBulkImport(template: TemplateRef<any>) {
    this.bulkImportRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
  }

  changeImportFile(event: any) {
    this.importFile.patchValue(event.target.files[0])
  }

  closeBulkImport() {
    this.importFile.patchValue(null)
    this.bulkImportRef?.hide()
  }

  removeImportFile() {
    this.importFile.patchValue(null)
    this.ChangeDetectorRef.markForCheck()
  }

  importCountries() {
    if (!this.importFile.value) {
      this.HotToastService.error('Please select a file to import')
      return
    }

    const formData: FormData = new FormData()
    formData.append('file', this.importFile.value)

    this.LocationService.bulkImportLocations(formData).subscribe({
      next: (res: any) => {
        this.closeBulkImport()
        this.HotToastService.success(res.message)
        this.Router.navigate([`${appRoutes.bulk.import}/${res?.result?.importId}`])
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  // changeCountry(event: any) {
  //   const countryDetails: any = this.countries.find((country: any) => country.name == event.target.value)
  //   this.form.patchValue({
  //     code: countryDetails.code
  //   })
  // }

  changeCountry(event: any) {
    const countryDetails: any = this.countries.find((country: any) => country.name == event.target.value)
    this.form.patchValue({
      code: countryDetails.code
      // phoneCode field will remain empty for manual entry
    })
  }

  close() {
    this.modalRef?.hide()
    this.form.patchValue({ code: '', name: '', phoneCode: '' })
  }
  
  formatPhoneCode(phoneCode: string): string {
    if (!phoneCode) return '';

    // If it already starts with '+', return as is
    if (phoneCode.startsWith('+')) {
      return phoneCode;
    }

    return '+' + phoneCode;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      phoneCode: new FormControl('',[Validators.required])
    })

    for (let _key of Object.keys(countries.getNames(this.platformString, { select: "official" }))) {
      this.countries.push({
        name: countries.getNames(this.platformString, { select: "official" })[_key],
        code: _key
      });
    }

    this.fetchResults();
  }

  openConfirmation(template: TemplateRef<any>, countryId: string) {
    this.toggledCountry = countryId
    this.confirmationRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  decline() {
    this.toggledCountry = null
    this.confirmationRef?.hide()
  }

  confirm() {
    this.LocationService.deleteCountry(this.toggledCountry).subscribe({
      next: (res: any) => {
        this.decline()
        this.fetchResults()
        this.HotToastService.success(res.message)
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  fetchResults() {
    this.LocationService.getCountries({ pageIndex: this.pageIndex, pageSize: this.pageSize }).subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.dbCountries = res.result.countries;
          this.totalPages = res.result.totalPages;
          this.totalResults = res.result.totalResults;
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchResults();
  }

  saveChanges() {
    if (!this.form.valid) {
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    this.LocationService.createCountry({ ...this.form.value, language: this.platformString }).subscribe({
      next: (res: any) => {
        if (res && res.errorCode == 0) {
          this.close()
          this.HotToastService.success(res.message)
          this.fetchResults()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  downloadSampleFile() {
    const filePath: string = `../../../../../../assets/files/locations.csv`
    this.HttpClient.get(filePath, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;
          const filename = filePath.split('/').pop() || 'sample-locations.csv';
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error('Download failed:', error);
        }
      );
  }
}
