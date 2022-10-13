import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';
import { VouchersService } from 'src/app/includes/services/vouchers.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss']
})
export class VouchersListComponent implements OnInit {
  appRoute = appRoutes
  base: string;
  voucherform: FormGroup;
  vouchers: any;

  //Page and limit for query
  page: any = 1;
  pages: any = []
  nextpages: any = []
  currpage: any = 1;
  limit: any = 8;
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

  constructor(
    private vouchersService: VouchersService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    setTimeout(() => {
      this.setPages()
    })

    this.vouchersService.getVoucherByPage(this.page, this.limit).subscribe((res: any) => {
      this.vouchers = res?.result
      for (let data of this.vouchers) {
        data.fromDate = new Date(data.fromDate).toDateString()
        data.lastDate = new Date(data.lastDate).toDateString()
      }
      this.count = this.vouchers.length
      this.cdr.markForCheck();
    });

    this.vouchersService.getVoucherCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.cdr.markForCheck();
      this.setPages()
    })
  }

  initForm() {
    this.voucherform = this.formBuilder.group({
      title: [''],
      fromDate: [''],
      lastDate: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onReload() {
    window.location.reload()
  }

  searchVoucher() {
    this.currpage = 1
    this.vouchersService.searchVoucher(this.voucherform.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.vouchers = res?.result?.data
        for (let data of this.vouchers) {
          data.fromDate = new Date(data.fromDate).toDateString()
          data.lastDate = new Date(data.lastDate).toDateString()
        }
        this.count = this.vouchers.length
        this.totalcount = res?.result?.total
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
      }
    })
  }

  fetchVoucher(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.voucherform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.voucherform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.voucherform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.voucherform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.voucherform.value, this.currpage, this.limit)
      } else {
        this.getData(this.voucherform.value, this.currpage, this.limit)
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
    this.vouchersService.searchVoucher(data, page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.vouchers = res?.result?.data
        for (let data of this.vouchers) {
          data.fromDate = new Date(data.fromDate).toDateString()
          data.lastDate = new Date(data.lastDate).toDateString()
        }
        this.count = this.vouchers.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
