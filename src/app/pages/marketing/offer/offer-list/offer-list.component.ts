import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from '../../../../includes/services/offer.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { HotToastService } from '@ngneat/hot-toast';

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
  limit: number = 20
  lastPage: Boolean = false;
  totalResults: number = 0
  totalPages: number = 0

  constructor(
    private OfferService: OfferService,
    private FormBuilder: FormBuilder,
    private ChangeDetectorRef: ChangeDetectorRef,
    private AppSettingsService: AppSettingsService,
    private HotToastService: HotToastService
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


  switchToggled(event: { switchId: string, toggleState: boolean }) {
    this.OfferService.updateOffer({ slug: event.switchId, isActive: event.toggleState }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOffers()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  deleteOffer(offerId: string) {
    this.OfferService.updateOffer({ slug: offerId, isDelete: true }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOffers()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.error?.message)
      }
    })
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getOffers()
  }

  getOffers() {
    this.OfferService.searchOffers({ ...this.form.value, page: this.page, limit: this.limit }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.offers = res?.result?.data
        this.page = res?.result?.page
        this.lastPage = res?.result?.lastPage
        this.totalPages = res?.result?.totalPages
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
