import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';

interface MediaChangeEvent {
  path: string;
}

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {
  device: string = 'desktop';
  isDraft: boolean = false;
  screenLoad: number = 0;
  form: FormGroup;
  plpBannerDesktop: string;
  plpBannerMobile: string;
  sortValues: Array<{ name: string, value: string }> = [
    { name: 'Popularity', value: 'popularity' },
    { name: 'Price - Low to High', value: 'price-asc' },
    { name: 'Price - High to Low', value: 'price-desc' },
    { name: 'Relevance', value: 'relevance' },
    { name: 'Recently Added', value: 'recently-added' },
    { name: 'A to Z', value: 'name-asc' },
    { name: 'Z to A', value: 'name-desc' }
  ]

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private HttpClient: HttpClient,
    private HotToastService: HotToastService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      plpBannerDesktop: new FormControl(''),
      plpBannerMobile: new FormControl(''),
      plpSort: new FormControl('popularity')
    });

    this.fetchResults()
  }

fetchResults() {
  this.HttpClient.get(`${environment.apiUrl}/publishProductConfig`).subscribe({
    next: (res: any) => {

    }
  })
}

fetchDraftResults(){

}

saveToDraft() {
  this.HttpClient.post(`${environment.apiUrl}/draftProductConfig`, this.form.value).subscribe({
    next: (res: any) => {
      if (res?.errorCode == 0) {
        this.HotToastService.success(res?.message)
        this.ChangeDetectorRef.markForCheck()
      } else {
        this.HotToastService.error(res?.message)
      }
    }, error: (err: any) => {
      this.HotToastService.error(err?.error?.message)
    }
  })
}

saveToPublish() {
  this.HttpClient.get(`${environment.apiUrl}/publishProductConfig`).subscribe({
    next: (res: any) => {
      if (res?.errorCode == 0) {
        this.HotToastService.success(res?.message)
        this.fetchResults()
        this.ChangeDetectorRef.markForCheck()
      } else {
        this.HotToastService.error(res?.message)
      }
    }, error: (err: any) => {
      this.HotToastService.error(err?.error?.message)
    }
  })
}

deviceToggled(event: string) {
  this.device = event;
  this.ChangeDetectorRef.markForCheck();
}

onMediaChange(event: any, mediaType: string) {
  this.form.get(mediaType)?.setValue(event.path)
  if (mediaType == 'plpBannerDesktop') {
    this.plpBannerDesktop = mediaType
  } else if (mediaType == 'plpBannerMobile') {
    this.plpBannerMobile = mediaType
  }
  this.isDraft = true // enables the save as draft button in the topbar
}

onChange() {
  this.isDraft = true
}
}
