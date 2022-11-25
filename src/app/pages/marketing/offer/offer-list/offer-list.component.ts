import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OfferService } from '../../../../includes/services/offer.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
})
export class OfferListComponent implements OnInit {
  appRoute = appRoutes;
  offers: any;
  offerform: FormGroup;
  base: any

  //Page and limit for query
  page: any = 1;
  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  limit: any = 15;
  selectedpage: any = 1
  max: any = 3

  //Total no. of data from backend
  totalcount: any;
  totaldata: any;
  count: any = 0

  //Conditions
  isData: boolean = true;
  showBtn: boolean = true;
  showLessBtn: boolean = false;
  isNext: boolean = true

  //Filters array
  filters: any = [];
  show: any;
  shifted: any

  pageLimit = new FormControl(this.limit)

  constructor(
    private offerService: OfferService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })

    this.offerService.searchOffer(this.offerform.value, this.page, this.limit).subscribe((res: any) => {
      this.offers = res?.result?.data
      for (let data of this.offers) {
        const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
        if (data.lastDate > today) {
          data.isEditable = true
        } else {
          data.isEditable = false
        }
        data.fromDate = new Date(data.fromDate).toDateString()
        data.lastDate = new Date(data.lastDate).toDateString()
      }
      this.count = this.offers.length
      this.totalcount = res?.result?.total_item
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.setPages()
      this.cdr.markForCheck();
      this.isData = true
    });
  }

  initForm() {
    this.offerform = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
      fromDate: [''],
      lastDate: [''],
    });
  }

  onReload() {
    this.offerform.get('name')?.setValue('')
    this.offerform.get('isActive')?.setValue('')
    this.offerform.get('isFeatured')?.setValue('')
    this.offerform.get('fromDate')?.setValue('')
    this.offerform.get('lastDate')?.setValue('')
    this.searchOffer()
  }

  changeLimit(_val: any) {
    this.limit = _val.value
    this.searchOffer()
  }

  searchOffer() {
    this.currpage = 1
    this.offerService.searchOffer(this.offerform.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.offers = res?.result?.data
        for (let data of this.offers) {
          const today = new Date().toISOString()
          if (data.lastDate > today) {
            data.isEditable = true
          } else {
            data.isEditable = false
          }
          data.fromDate = new Date(data.fromDate).toDateString()
          data.lastDate = new Date(data.lastDate).toDateString()
        }
        this.count = this.offers.length
        this.totalcount = res?.result?.total_item
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
      }
    })
  }

  fetchOffer(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.offerform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.offerform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.offerform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.offerform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.offerform.value, this.currpage, this.limit)
      } else {
        this.getData(this.offerform.value, this.currpage, this.limit)
      }
    }
  }

  setPages() {
    this.currpage = 1
    this.selectedpage = 1
    this.pages.length = 0
    if (this.totaldata > 3) {
      for (let i = 1; i <= this.max; i++) {
        this.pages.push(i)
      }
    } else {
      for (let i = 1; i <= this.totaldata; i++) {
        this.pages.push(i)
      }
    }
  }

  getData(data: any, page: any, limit: any) {
    this.offerService.searchOffer(data, page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.offers = res?.result?.data
        for (let data of this.offers) {
          const today = new Date().toISOString()
          if (data.lastDate > today) {
            data.isEditable = true
          } else {
            data.isEditable = false
          }
          data.fromDate = new Date(data.fromDate).toDateString()
          data.lastDate = new Date(data.lastDate).toDateString()
        }
        this.count = this.offers.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
