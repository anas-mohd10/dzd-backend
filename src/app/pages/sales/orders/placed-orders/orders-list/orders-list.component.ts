import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';

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
  invoiceUrl: string = ''
  packingSlipUrl: string = ''
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
  isLoading: boolean = false
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
  checkStatusList: Array<any> = ['PENDING', 'FAILED', 'CANCELLED']

  successOrders: Array<string> = ['PLACED', 'SHIPPED', 'PARTIAL PROCESSED', 'OUT FOR DELIVERY', 'DELIVERED', 'PACKED']
  acceptedOrders: Array<string> = ['ACCEPTED']
  cancelledOrders: Array<string> = ['CANCELLED', 'PENDING', 'FAILED']

  domainUrl: string = ''
  settings: any;

  constructor(
    private OrdersService: OrdersService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private HotToastService: HotToastService,
    private AppSettingsService: AppSettingsService,
    private BsModalService: BsModalService
  ) {

    this.keyword.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.updateQueryParams({ keyword: value, page: 1 })
      })
  }

  //format case
  formatCase(orderData: string) {
    if (orderData) {
      return orderData
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return ''
  }

  openTag(template: TemplateRef<any>, order: string) {
    this.tagRef = this.BsModalService.show(template, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true })
    this.tagOrder = order
  }

  closeTag() {
    this.tagRef?.hide()
    this.tagOrder = ''
  }

  getLocaleDateFormat(data: any) {
    return new Date(data).toLocaleDateString()
  }

  getLocaleTimeFormat(data: any) {
    return new Date(data).toLocaleTimeString()
  }

  formatOrderStatus(orderStatus: string) {
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
          this.HotToastService.success(res.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
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
          this.HotToastService.success(res.message)
          this.tagOrder = ''
          this.isTagSubmitted = false
          this.tag.reset()
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }


  private initializeSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.settings = res?.result;
          this.invoiceUrl = res?.result?.domainUrl + '/api/v1/w/admin/auth/generate-invoices/';
          this.packingSlipUrl = res?.result?.domainUrl + '/api/v1/w/admin/auth/generate-packingslips/';
          this.domainUrl = res?.result?.domainUrl + '/api/v1/w/admin/auth/generate-invoice/';
          this.ChangeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => { }
    });
  }

  private updateQueryParams(params: any) {
    // Get current form values
    const formValues = this.orderForm.value;

    // Merge with existing query params
    const queryParams = {
      status: this.activeValue,
      page: this.page,
      limit: this.limit,
      keyword: this.keyword.value,
      ...formValues,
      ...params // Override with new params
    };

    // Remove empty values
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key] && queryParams[key] !== 0) {
        delete queryParams[key];
      }
    });

    // Update URL without reloading
    this.Router.navigate([], {
      relativeTo: this.ActivatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).then(() => {
      // Call getOrders after URL is updated
      this.getOrders();
    });
  }



  ngOnInit(): void {
    // Initialize settings
    this.initializeSettings();

    // Initialize form
    this.initForm();

    // Get initial order counts
    this.OrdersService.getOrderCounts({ status: this.orderStatus }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.orderStatus = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
          this.HotToastService.error(res.message);
        }
      },
      error: (err: any) => {
        this.HotToastService.error(err.message);
      }
    });

    // Subscribe to query params
    this.ActivatedRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length === 0) {
        // If no params, just get orders with default values
        this.getOrders();
        return;
      }

      // Update status from query params
      this.activeValue = params['status'] || '';
      this.activeStatus = this.orderStatus.find(s => s.value === this.activeValue)?.status || 'All Orders';

      // Update page and limit
      this.page = Number(params['page']) || 1;
      this.limit = Number(params['limit']) || 20;

      // Update form values from query params without triggering valueChanges
      this.orderForm.patchValue({
        fromDate: params['fromDate'] || '',
        toDate: params['toDate'] || '',
        paymentMethod: params['paymentMethod'] || '',
        paymentStatus: params['paymentStatus'] || '',
        source: params['source'] || ''
      }, { emitEvent: false });

      // Update keyword without triggering valueChanges
      this.keyword.setValue(params['keyword'] || '', { emitEvent: false });

      // Get orders with current params
      this.getOrders();
    });
  }

  toggleOrders(order?: { order: string, status: string }) {
    if (order) {
      if (this.checkStatusList.includes(order?.status)) {
        this.HotToastService.error('This order is not accepted yet or has been cancelled. Please accept the order to confirm your selection.')
      } else {
        this.toggledOrders.includes(order.order.split('#')[1]) ?
          this.toggledOrders = this.toggledOrders.filter(o => o != order.order.split('#')[1]) :
          this.toggledOrders.push(order.order.split('#')[1])
      }
    } else {
      let isPlacedOrders = 0
      this.toggledOrders.length == this.orders.length ?
        this.toggledOrders = [] :
        this.toggledOrders = this.orders.map((order: any) => this.checkStatusList.includes(order.orderStatus) ? isPlacedOrders++ : order.orderNo.split('#')[1])

      if (isPlacedOrders > 0) {
        this.HotToastService.error('Please accept orders to confirm your selection')
      }
    }
  }

  bulkAcceptOrders() {
    let ordersMap: any = {}
    let acceptedOrders: number = 0
    this.orders.forEach((orderItem: any) => ordersMap[orderItem.orderNo.split('#')[1]] = orderItem);
    let orders = this.toggledOrders.map((order: any) => {
      if (ordersMap[order]['orderStatus'] == 'PLACED') {
        return ordersMap[order]
      } else {
        acceptedOrders++
      }
    });

    if (acceptedOrders > 0) {
      this.HotToastService.error("Orders in the list are already accepted")
    } else {
      let orderIds = orders.map((orderItem: any) => orderItem.orderNo.split('#')[1])
      this.OrdersService.bulkAcceptOrders({ orderIds: orderIds }).subscribe({
        next: (res: any) => {
          if (res.errorCode == 0) {
            this.getOrders()
            this.toggledOrders = []
            this.HotToastService.success(res.message)
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.HotToastService.error(res.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err.message)
        }
      })
    }
  }

  bulkPrintInvoice() {
    let queryString = this.toggledOrders.map(order => `${order.split('#')}`).join('&')
    window.open(`${this.invoiceUrl}${queryString}`, '_blank')
  }

  bulkPrintPackingSlips() {
    let queryString = this.toggledOrders.map(order => `${order.split('#')}`).join('&')
    window.open(`${this.packingSlipUrl}${queryString}`, '_blank')
  }

  formatTime(time: string) {
    return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

//   formatDate(date: string) {
//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     timeZone: 'UTC', // Force UTC timezone
//   }).format(new Date(date));
// }

// formatTime(time: string) {
//   return new Intl.DateTimeFormat('en-US', {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true,
//     timeZone: 'UTC', // Force UTC timezone
//   }).format(new Date(time));
// }

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
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }

  getLimit() {
    this.getOrders()
  }

  getStatus(status: any) {
    this.activeStatus = status?.status;
    this.activeValue = status?.value;
    this.updateQueryParams({ status: status?.value, page: 1 }); // Reset page when changing status
  }

  onPageTriggered(event: { pageIndex: number, pageSize: number }) {
    this.updateQueryParams({
      page: event.pageIndex,
      limit: event.pageSize
    });
  }

  getOrders() {
    this.isLoading = false;
    const payload = {
      status: this.activeValue,
      page: this.page,
      limit: this.limit,
      ...this.orderForm.value,
      keyword: this.keyword.value,
    };

    this.OrdersService.listOrders(payload).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.orders = res?.result?.orders;
        this.totalOrders = res?.result?.total_orders;
        this.averageSales = res?.result?.average_sales;
        this.totalRevenues = res?.result?.total_revenue;
        this.lastPage = res?.result?.lastPage;
        this.totalResults = res?.result?.totalResults;
        this.totalPages = res?.result?.totalPages;
        this.page = res?.result?.page;
        this.isLoading = true;
        this.ChangeDetectorRef.markForCheck();
      }
    });
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

    // Subscribe to form value changes
    this.orderForm.valueChanges.subscribe(values => {
      // Update query params and trigger API call
      this.updateQueryParams({ ...values, page: 1 });
    });
  }

  checkToDate() {
    let fromDate = this.orderForm.get("fdate")?.value
    let toDate = this.orderForm.get("tdate")?.value
    if (toDate) {
      if (toDate < fromDate) {
        this.isDateValid = false
        this.HotToastService.error("Kindly enter a valid To date")
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
    this.Router.navigate([appRoutes.orders.ORDERS_LIST], {
      queryParams: {}
    });
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

  getInvoiceSignedUrl(orderId: string) {
    orderId = orderId.split('#')[1]
    this.OrdersService.getInvoiceSignedUrl(orderId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          window.open(res?.result?.url, "_blank")
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }

  getInvoicesSignedUrl() {
    let queryString = this.toggledOrders.map(order => `${order.split('#')}`).join('&')
    this.OrdersService.getInvoicesSignedUrl(queryString).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          window.open(res?.result?.url, "_blank")
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }

  getPackingSlipsSignedUrl() {
    let queryString = this.toggledOrders.map(order => `${order.split('#')}`).join('&')
    this.OrdersService.getPackingSlipsSignedUrl(queryString).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          window.open(res?.result?.url, "_blank")
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.message)
      }
    })
  }
}
