import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { LocationService } from 'src/app/includes/services/location.service';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface State {
  _id: string;
  name: string;
  countryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Country {
  _id: string;
  name: string;
  code: string;
}

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {
  appRoute = appRoutes;
  countryId: string | null;
  states: State[] = [];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalResults: number = 0;
  modalRef?: BsModalRef;
  confirmationRef?: BsModalRef;
  toggledState: string | null;
  form: FormGroup = new FormGroup({})
  platformString: string = localStorage.getItem('language') || 'en';
  countryDetails: Country | null;

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private LocationService: LocationService,
    private HotToastService: HotToastService,
    private ActivatedRoute: ActivatedRoute,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.countryId = this.ActivatedRoute.snapshot.params['countryId'];

    if (!this.countryId) {
      this.HotToastService.error('Country ID is required')
      return
    }

    this.LocationService.getCountry(this.countryId).subscribe({
      next: (res: any) => {
        this.countryDetails = res.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    })

    this.fetchResults()
  }

  fetchResults() {
    this.LocationService.getStates({
      countryId: this.countryId,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe({
      next: (res: any) => {
        this.states = res.result.states
        this.totalPages = res.result.totalPages
        this.totalResults = res.result.totalResults
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  openConfirmation(template: TemplateRef<any>, countryId: string) {
    this.toggledState = countryId
    this.confirmationRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  decline() {
    this.toggledState = null
    this.confirmationRef?.hide()
  }

  confirm() {
    this.LocationService.deleteState(this.toggledState).subscribe({
      next: (res: any) => {
        this.decline()
        this.fetchResults()
        this.HotToastService.success(res.message)
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

  open(template: TemplateRef<any>, state?: string) {
    this.modalRef = this.BsModalService.show(template, { class: 'modal-dialog-centered', ignoreBackdropClick: true })
    if (state) {
      this.form.patchValue({ name: state })
    }
  }

  close() {
    this.modalRef?.hide()
    this.form.patchValue({ name: '' })
  }

  saveChanges() {
    if (!this.form.valid) {
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    this.LocationService.createState({
      countryId: this.countryId,
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
