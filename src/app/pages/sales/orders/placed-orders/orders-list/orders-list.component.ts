import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import SwiperCore, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnDestroy, OnInit {
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
  currentTab: number=0;
  swiperConfig:SwiperOptions={
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl:"#next",
      prevEl:'#prev'
      
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: true,
    breakpoints:{
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

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.ordersService.getOrders().subscribe((res: any) => {
      this.orders = res?.result?.orders
      for (let order of this.orders) {
        order.orderDate = new Date(order.orderDate).toDateString()
      }
      this.count = res?.result?.total_orders
      this.averagesales = res?.result?.average_sales
      this.totalrevenues = res?.result?.total_revenue
      this.cdr.markForCheck()
      this.dtTrigger.next()
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
    this.orderform.get('fdate')?.setValue('')
    this.orderform.get('tdate')?.setValue('')
    this.orderform.get('paymentMethod')?.setValue('')
    this.orderform.get('orderStatus')?.setValue('')

    this.ordersService.getOrders().subscribe((res: any) => {
      this.dtTrigger.unsubscribe()
      this.orders = res?.result?.orders
      for (let order of this.orders) {
        order.orderDate = new Date(order.orderDate).toDateString()
      }
      this.cdr.markForCheck()
      this.dtTrigger.next()
    })
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  navSwitch(tabNumber:number){
    this.currentTab=tabNumber
  }
}
