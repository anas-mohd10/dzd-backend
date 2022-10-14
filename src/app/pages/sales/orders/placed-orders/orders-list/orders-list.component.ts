import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  orderform: FormGroup;
  appRoute = appRoutes;
  orders: any;
  base: any

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
  totalRevenue: any = 0;
  isDateValid: boolean;

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    setTimeout(() => {
      this.setPages()
    })

    this.ordersService.getOrders(this.page, this.limit).subscribe((res: any) => {
      this.orders = res?.result
      this.count = this.orders.length
      for (let order of this.orders) {
        order.orderDate = new Date(order.orderDate).toDateString()
      }
      this.cdr.markForCheck()
    })

    this.ordersService.getOrderCount().subscribe((res: any) => {
      this.totalcount = res?.result
      this.totaldata = Math.ceil(this.totalcount / this.limit)
      this.cdr.markForCheck();
      this.setPages()
    })
  }

  initForm() {
    this.orderform = this.formBuilder.group({
      fdate: [''],
      tdate: [''],
      paymentMethod: [''],
      orderStatus: [''],
    });
  }

  checkToDate() {
    let fromDate = this.orderform.get("fdate")?.value
    let toDate = this.orderform.get("tdate")?.value
    if (toDate) {
      if (toDate < fromDate) {
        this.isDateValid = false
        this.toastr.error("Kindly enter a valid To date")
      } else {
        this.isDateValid = true
      }
    }
  }

  onReload() {
    window.location.reload()
  }

  searchOrder() {
    this.currpage = 1
    this.ordersService.searchOrder(this.orderform.value, this.page, this.limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.data
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toDateString()
        }
        this.count = this.orders.length
        this.totalcount = res?.result?.total
        this.totaldata = Math.ceil(this.totalcount / this.limit)
        this.setPages()
        this.cdr.markForCheck();
        this.isData = true
      }
    })
  }

  fetchOrder(page: any, limit: any) {
    this.selectedpage = page
    this.currpage = page
    this.getData(this.orderform.value, page, limit)
  }

  loadNext() {
    this.currpage += 1
    this.selectedpage += 1
    if (this.currpage <= 3) {
      if (this.currpage <= this.totaldata) {
        this.getData(this.orderform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    } else {
      this.shifted = this.pages.shift() //Captures the shifted number from pagination array
      this.pages.push(this.currpage)
      if (this.currpage <= this.totaldata) {
        this.getData(this.orderform.value, this.currpage, this.limit)
      } else {
        this.isNext = false
      }
    }
  }

  loadPrevious() {
    this.currpage -= 1
    this.selectedpage -= 1
    if (this.currpage > 3 && this.currpage <= this.totaldata && this.currpage > 0) {
      this.getData(this.orderform.value, this.currpage, this.limit)
    }
    else {
      if (this.pages[0] != 1) {
        this.pages.pop()
        this.pages.unshift(this.shifted)
        this.shifted -= 1
        this.getData(this.orderform.value, this.currpage, this.limit)
      } else {
        this.getData(this.orderform.value, this.currpage, this.limit)
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
    this.ordersService.searchOrder(data, page, limit).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.data
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toDateString()
        }
        this.count = this.orders.length
        this.cdr.markForCheck();
      }
    })
    this.isNext = true
  }
}
