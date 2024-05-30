import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import SwiperCore, { SwiperOptions } from 'swiper';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { routes } from 'src/app/app-routing.module';
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  orderForm: FormGroup;
  appRoute = appRoutes;
  orders: any = [];
  base: any
  isDateValid: boolean = false;
  totalcount: Number = 0
  totalOrders: Number = 0
  totalRevenues: string = 'INR 0';
  averageSales: string = 'INR 0';
  currentTab: number = 0;
  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 50,
    navigation: { nextEl: "#next", prevEl: '#prev' },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: true,
    breakpoints: {
      320: {
        slidesPerView: 'auto',
        spaceBetween: 35
      }, 480: {
        slidesPerView: 'auto',
        spaceBetween: 35
      }, 640: {
        slidesPerView: 'auto',
        spaceBetween: 35
      }
    }
  }
  page: number = 1
  limit: number = 20
  keyword: FormControl = new FormControl('')
  activeValue: String = ''
  activeStatus: String = 'All Orders'
  orderStatus: Array<any> = [{
    status: 'All Orders',
    value: '',
    totalOrders: 0
  }, {
    status: 'Placed',
    value: 'PLACED',
    totalOrders: 0
  }, {
    status: 'Accepted',
    value: 'ACCEPTED',
    totalOrders: 0
  }, {
    status: 'Packed',
    value: 'PACKED',
    totalOrders: 0
  }, {
    status: 'Shipped',
    value: 'SHIPPED',
    totalOrders: 0
  }, {
    status: 'Out for Delivery',
    value: 'OUT FOR DELIVERY',
    totalOrders: 0
  }, {
    status: 'Delivered',
    value: 'DELIVERED',
    totalOrders: 0
  }, {
    status: 'Collected',
    value: 'COLLECTED',
    totalOrders: 0
  }, {
    status: 'Pending',
    value: 'PENDING',
    totalOrders: 0
  }, {
    status: 'Partial Processed',
    value: 'PARTIAL PROCESSED',
    totalOrders: 0
  }, {
    status: 'Failed',
    value: 'FAILED',
    totalOrders: 0
  }, {
    status: 'Cancelled',
    value: 'CANCELLED',
    totalOrders: 0
  }]
  lastPage: Boolean = false
  type: any = null

  tagRef?: BsModalRef
  tagOrder: string = ''
  tag: FormControl = new FormControl('', [Validators.required, Validators.maxLength(10)])
  isTagSubmitted: boolean = false
  totalResults: number = 0
  totalPages: number = 1
  toggledOrders: Array<any> = [];
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  weekDays: Array<string> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  checkStatusList: Array<any> = ['PENDING', 'PLACED', 'FAILED', 'CANCELLED']

  successOrders: Array<string> = ['PLACED', 'SHIPPED', 'PARTIAL PROCESSED', 'OUT FOR DELIVERY', 'DELIVERED', 'PACKED']
  acceptedOrders: Array<string> = ['ACCEPTED']
  cancelledOrders: Array<string> = ['CANCELLED', 'PENDING', 'FAILED']

  constructor(
    private OrdersService: OrdersService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private Toast: HotToastService,
    private BsModalService: BsModalService
  ) {
    this.OrdersService.getOrderCounts({ status: this.orderStatus }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.orderStatus = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  openTag(template: TemplateRef<any>, order: string) {
    this.tagRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.tagOrder = order
  }

  closeTag() {
    this.tagRef?.hide()
    this.tagOrder = ''
  }

  formatOrderStatus(orderStatus: string){
    return `${orderStatus.charAt(0).toUpperCase()}${orderStatus.slice(1).toLowerCase()}`
  }

  convertTimeFormat(timeString: any) {
    const [start, end] = timeString.split(' - ');
    const startTime = this.convertTo12HourFormat(start);
    const endTime = this.convertTo12HourFormat(end);
    return `${startTime} - ${endTime}`;
  }

  convertTo12HourFormat(time: any) {
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hour = parseInt(hours, 10);

    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) { hour -= 12 }
    }

    return `${hour}:${minutes} ${period}`;
  }

  convertDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${this.weekDays[date.getDay()]} ${day} ${month} ${year}`;
  }

  removeTag(order: string, tag: number) {
    this.OrdersService.manageTags({ order: order, tag: tag }, 'delete').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrders()
          this.Toast.success(res.message)
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  addTag() {
    if (!this.tag.valid) {
      this.isTagSubmitted = true
      return
    }

    this.OrdersService.manageTags({ order: this.tagOrder, tag: this.tag.value }, 'add').subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrders()
          this.tagRef?.hide()
          this.Toast.success(res.message)
          this.tagOrder = ''
          this.isTagSubmitted = false
          this.tag.reset()
        } else {
          this.Toast.error(res.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.message)
      }
    })
  }

  ngOnInit(): void {
    this.type = this.ActivatedRoute.snapshot.queryParams.type || ''
    switch (this.type) {
      case 'pending':
        this.activeStatus = 'Pending'
        this.activeValue = 'PENDING'
        break
      case 'delivered':
        this.activeStatus = 'Delivered'
        this.activeValue = 'DELIVERED'
        break
    }
    this.initForm()
    this.getOrders()
  }

  toggleOrders(order?: { order: string, status: string }) {
    if (order) {
      if (this.checkStatusList.includes(order?.status)) {
        this.Toast.error('This order is not accepted yet or has been cancelled. Please accept the order to confirm your selection.')
      } else {
        this.toggledOrders.includes(order.order.split('#')[1]) ?
          this.toggledOrders = this.toggledOrders.filter(o => o != order.order.split('#')[1]) :
          this.toggledOrders.push(order.order.split('#')[1])
      }
    } else {
      this.toggledOrders.length == this.orders.length ?
        this.toggledOrders = [] :
        this.toggledOrders = this.orders.map((order: any) => this.checkStatusList.includes(order.orderStatus) ? this.Toast.error('Please accept orders to confirm your selection') : order.orderNo.split('#')[1])
    }
  }

  bulkPrintInvoice() {
    let queryString = this.toggledOrders.map(order => `${order.split('#')}`).join('&')
    this.Router.navigate([`/bulk-invoices`], { queryParams: { 'order': queryString } })
  }

  bulkPrintPackingSlips() {
    let queryString = this.toggledOrders.map(order => `${order.split('#')}`).join('&')
    this.Router.navigate([`/bulk-packing-slips`], { queryParams: { 'order': queryString } })
  }

  exportOrders() {
    this.OrdersService.exportOrderTabs({
      status: this.activeValue,
      page: this.page,
      limit: this.limit,
      ...this.orderForm.value,
      keyword: this.keyword.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message)
        } else {
          this.Toast.error(res?.message)
        }
      }, error: (err: any) => {
        this.Toast.error(err.error.message)
      }
    })
  }

  getLimit() {
    this.getOrders()
  }

  getStatus(status: any) {
    this.activeStatus = status?.status
    this.activeValue = status?.value
    this.getOrders()
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.page = event.pageIndex
    this.limit = event.pageSize
    this.getOrders()
  }

  getOrders() {
    let payload = {
      status: this.activeValue,
      page: this.page,
      limit: this.limit,
      ...this.orderForm.value,
      keyword: this.keyword.value,
    }
    this.OrdersService.getOrders(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.orders
        for (let order of this.orders) order.orderDate = new Date(order.orderDate).toLocaleDateString()
        this.totalOrders = res?.result?.total_orders
        this.averageSales = res?.result?.average_sales
        this.totalRevenues = res?.result?.total_revenue
        this.lastPage = res?.result?.lastPage
        this.totalResults = res?.result?.totalResults
        this.totalPages = res?.result?.totalPages
        this.page = res?.result?.page
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  convertOrderStatus(status: string) {
    return status.split('_').join(' ').toUpperCase()
  }

  initForm() {
    this.orderForm = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      paymentMethod: new FormControl(''),
      paymentStatus: new FormControl(''),
      source: new FormControl(''),
    });
  }

  checkToDate() {
    let fromDate = this.orderForm.get("fdate")?.value
    let toDate = this.orderForm.get("tdate")?.value
    if (toDate) {
      if (toDate < fromDate) {
        this.isDateValid = false
        this.ToastrService.error("Kindly enter a valid To date")
      } else {
        this.isDateValid = true
      }
    }
  }

  onReload() {
    this.keyword.setValue('')
    this.limit = 20
    this.initForm()
    this.activeStatus = 'All Orders'
    this.activeValue = ''
    this.Router.navigate([appRoutes.orders.ORDERS_LIST])
    this.getOrders()
  }

  searchOrder() {
    this.OrdersService.searchOrder(this.orderForm.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.data
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toDateString()
        }
        this.ChangeDetectorRef.markForCheck();
      }
    })
  }
}
