import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from '../../../../includes/services/offer.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
})
export class OfferListComponent implements OnInit {
  appRoute = appRoutes;
  offers: Array<any> = [];
  form: FormGroup;
  base: any
  settings: any = {}
  page: number = 1
  limit: FormControl = new FormControl("18")
  lastPage: Boolean = false;
  totalResults: string = ''

  constructor(
    private OfferService: OfferService,
    private FormBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.base = environment.base
    this.getOffers()
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.settings = res?.result
      }
    })
  }

  initForm() {
    this.form = this.FormBuilder.group({
      name: [''],
      isActive: [''],
      fromDate: [''],
      lastDate: [''],
    });
  }

  clearFilters() {
    this.initForm()
    this.getOffers()
  }

  getNextPage() {
    this.page += 1
    this.getOffers()
  }

  getPreviousPage() {
    this.page -= 1
    this.getOffers()
  }

  getOffers() {
    this.OfferService.searchOffers({ ...this.form.value, page: this.page, limit: this.limit.value }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.offers = res?.result?.data
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.totalResults = res?.result?.totalResults
        for (let offer of this.offers) {
          offer.fromDate = new Date(offer?.fromDate).toDateString()
          offer.lastDate = new Date(offer?.lastDate).toDateString()
        }
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }
}
