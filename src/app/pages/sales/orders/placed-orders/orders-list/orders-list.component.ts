import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import SwiperCore, { SwiperOptions } from 'swiper';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
Router

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  orderform: FormGroup;
  appRoute = appRoutes;
  orders: any = [];
  base: any
  isDateValid: boolean = false;
  totalcount: Number = 0
  totalRevenue: Number = 0
  count: Number = 0
  totalrevenues: any;
  averagesales: any;
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
  limit: FormControl = new FormControl(20)
  keyword: FormControl = new FormControl('')
  activeValue: String = ''
  activeStatus: String = 'All Orders'
  orderStatus: Array<any> = [{
    status: 'All Orders',
    value: '',
    count: 0
  }, {
    status: 'Placed',
    value: 'PLACED',
    count: 0
  }, {
    status: 'Accepted',
    value: 'ACCEPTED',
    count: 0
  }, {
    status: 'Packed',
    value: 'PACKED',
    count: 0
  }, {
    status: 'Shipped',
    value: 'SHIPPED',
    count: 0
  }, {
    status: 'Out for Delivery',
    value: 'OUT FOR DELIVERY',
    count: 0
  }, {
    status: 'Delivered',
    value: 'DELIVERED',
    count: 0
  }, {
    status: 'Collected',
    value: 'COLLECTED',
    count: 0
  }, {
    status: 'Pending',
    value: 'PENDING',
    count: 0
  }, {
    status: 'Partial Processed',
    value: 'PARTIAL PROCESSED',
    count: 0
  }, {
    status: 'Failed',
    value: 'FAILED',
    count: 0
  }, {
    status: 'Cancelled',
    value: 'CANCELLED',
    count: 0
  },]
  lastPage: Boolean = false
  type: any = null

  tagRef?: BsModalRef
  tagOrder: string = ''
  tag: FormControl = new FormControl('', [Validators.required, Validators.maxLength(10)])
  isTagSubmitted: boolean = false

  constructor(
    private OrdersService: OrdersService,
    private ToastrService: ToastrService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private BsModalService: BsModalService
  ) {
    this.OrdersService.getOrderCounts({ status: this.orderStatus }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.orderStatus = res?.result
          this.ChangeDetectorRef.markForCheck()
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
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

  addTag() {
    if (!this.tag.valid) {
      this.isTagSubmitted = true
      return
    }

    this.OrdersService.manageTags({ order: this.tagOrder, tag: this.tag.value }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getOrders()
          this.tagRef?.hide()
          this.ToastrService.success(res.message)
          this.tagOrder = ''
          this.tag.setValue('')
        } else {
          this.ToastrService.error(res.message)
        }
      }, error: (err: any) => {
        this.ToastrService.error(err.message)
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

  getLimit() {
    this.getOrders()
  }

  getStatus(status: any) {
    this.activeStatus = status?.status
    this.activeValue = status?.value
    this.getOrders()
  }

  getPreviousPage() {
    this.page = this.page - 1
    this.getOrders()
  }

  getNextPage() {
    this.page = this.page + 1
    this.getOrders()
  }

  getOrders() {
    let payload = {
      status: this.activeValue,
      page: this.page,
      limit: this.limit.value,
      paymentMethod: this.orderform.get('paymentMethod')?.value,
      from: this.orderform.get('fromDate')?.value,
      to: this.orderform.get('toDate')?.value,
      keyword: this.keyword.value,
      source: this.orderform.get('source')?.value,
      paymentStatus: this.orderform.get('paymentStatus')?.value
    }
    this.OrdersService.getOrders(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.orders
        for (let order of this.orders) order.orderDate = new Date(order.orderDate).toLocaleDateString() + " " + order.orderTime
        this.count = res?.result?.total_orders
        this.averagesales = res?.result?.average_sales
        this.totalrevenues = res?.result?.total_revenue
        this.lastPage = res?.result?.lastPage
        this.page = res?.result?.page
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  initForm() {
    this.orderform = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      paymentMethod: new FormControl(''),
      paymentStatus: new FormControl(''),
      source: new FormControl(''),
    });
  }

  checkToDate() {
    let fromDate = this.orderform.get("fdate")?.value
    let toDate = this.orderform.get("tdate")?.value
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
    this.limit.setValue(20)
    this.initForm()
    this.activeStatus = 'All Orders'
    this.activeValue = ''
    this.Router.navigate([appRoutes.orders.ORDERS_LIST])
    this.getOrders()
  }

  searchOrder() {
    this.OrdersService.searchOrder(this.orderform.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.dtTrigger.unsubscribe()
        this.orders = res?.result?.data
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toDateString()
        }
        this.ChangeDetectorRef.markForCheck();
        this.dtTrigger.next()
      }
    })
  }
}
