import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { LocationService } from 'src/app/includes/services/location.service';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface City {
  _id: string;
  name: string;
  countryId: string;
  stateId: string;
  createdAt: string;
  updatedAt: string;
}

interface State {
  _id: string;
  name: string;
  countryId: string;
  createdAt: string;
}

interface Country {
  _id: string;
  name: string;
  code: string;
}

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  appRoute = appRoutes;
  cities: City[] = [];
  countryId: string = '';
  stateId: string = '';
  modalRef?: BsModalRef;
  stateDetails: State | null;
  countryDetails: Country | null;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalResults: number = 0;
  confirmationRef?: BsModalRef;
  toggledCity: string | null;
  form: FormGroup = new FormGroup({})
  platformString: string = localStorage.getItem('language') || 'en';

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private LocationService: LocationService,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe((params: any) => {
      this.countryId = params.countryId;
      this.stateId = params.stateId;
    });

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    })

    this.LocationService.getCountry(this.countryId).subscribe({
      next: (res: any) => {
        this.countryDetails = res.result;
        this.ChangeDetectorRef.markForCheck();
      }
    })

    this.LocationService.getState(this.stateId).subscribe({
      next: (res: any) => {
        this.stateDetails = res.result;
        this.ChangeDetectorRef.markForCheck();
      }
    })

    this.fetchResults();
  }

  get formControls() {
    return this.form.controls;
  }

  fetchResults() {
    this.LocationService.getCities({
      countryId: this.countryId,
      stateId: this.stateId,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe({
      next: (res: any) => {
        this.cities = res.result.cities;
        this.totalPages = res.result.totalPages;
        this.totalResults = res.result.totalResults;
        this.ChangeDetectorRef.markForCheck();
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message);
      }
    });
  }

  openConfirmation(template: TemplateRef<any>, cityId: string) {
    this.toggledCity = cityId;
    this.confirmationRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true });
  }

  decline() {
    this.toggledCity = null;
    this.confirmationRef?.hide();
  }

  confirm() {
    this.LocationService.deleteCity(this.toggledCity).subscribe({
      next: (res: any) => {
        this.decline();
        this.fetchResults();
        this.HotToastService.success(res.message);
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message);
      }
    });
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.fetchResults();
  }

  open(template: TemplateRef<any>, city?: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
    if (city) {
      this.form.patchValue({ name: city });
    }
  }

  close() {
    this.modalRef?.hide();
    this.form.patchValue({ name: '' });
  }

  saveChanges() {
    if (!this.form.valid) {
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    this.LocationService.createCity({
      countryId: this.countryId,
      stateId: this.stateId,
      ...this.form.value,
      language: this.platformString
    }).subscribe({
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
}
