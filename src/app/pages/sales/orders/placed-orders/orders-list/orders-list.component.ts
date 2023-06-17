import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import SwiperCore, { SwiperOptions } from 'swiper';

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
  isTable: Boolean = false
  isDateValid: boolean = false;
  totalcount: Number = 0
  totalRevenue: Number = 0
  count: Number = 0
  totalrevenues: any;
  averagesales: any;
  currentTab: number = 0;
  swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: "#next",
      prevEl: '#prev'

    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: true,
    breakpoints: {
      320: {
        slidesPerView: 12,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 20
      }
    }
  }

  page: String = '1'
  limit: FormControl = new FormControl('10')
  activeValue: String = ''
  activeStatus: String = 'All Orders'
  orderStatus: Array<any> = [{
    status: 'All Orders',
    value: ''
  }, {
    status: 'Placed',
    value: 'PLACED'
  }, {
    status: 'Accepted',
    value: 'ACCEPTED'
  }, {
    status: 'Shipped',
    value: 'SHIPPED'
  }, {
    status: 'Refunded',
    value: 'REFUNDED'
  }, {
    status: 'Delivered',
    value: 'DELIVERED'
  }, {
    status: 'Failed',
    value: 'FAILED'
  }, {
    status: 'Cancelled',
    value: 'CANCELLED'
  }, {
    status: 'Packed',
    value: 'PACKED'
  }, {
    status: 'Partial Refunded',
    value: 'PARTIAL REFUNDED'
  }]

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
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

  getOrders() {
    let payload = {
      status: this.activeValue,
      page: this.page,
      limit: this.limit.value,
      paymentMethod: this.orderform.get('paymentMethod')?.value,
      from: this.orderform.get('fromDate')?.value,
      to: this.orderform.get('toDate')?.value
    }
    this.ordersService.getOrders(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.orders
        for (let order of this.orders) order.orderDate = new Date(order.orderDate).toDateString()
        this.count = res?.result?.total_orders
        this.averagesales = res?.result?.average_sales
        this.totalrevenues = res?.result?.total_revenue
        this.cdr.markForCheck()
      }
    })
  }

  initForm() {
    this.orderform = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      paymentMethod: new FormControl(''),
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
    this.initForm()
    this.getOrders()
  }

  searchOrder() {
    this.ordersService.searchOrder(this.orderform.value).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.dtTrigger.unsubscribe()
        this.orders = res?.result?.data
        for (let order of this.orders) {
          order.orderDate = new Date(order.orderDate).toDateString()
        }
        this.cdr.markForCheck();
        this.dtTrigger.next()
      }
    })
  }
}
