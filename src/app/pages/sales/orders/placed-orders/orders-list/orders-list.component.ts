import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables'
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  appRoute = appRoutes
  displayTable: boolean = false;
  ordersData: any;
  orderCount: Number = 0
  totalRevenue: Number = 0
  orderForm: FormGroup;
  isDateValid: Boolean = true;
  status: any;
  filteredData: any;

  //Local variables for temporary storing
  localData: any = []
  localStatus: any
  localMethod: any

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getOrders()
    this.initForm()
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
      paymentMethod: [''],
      orderStatus: [''],
    });
  }

  getOrders() {
    this.ordersService.getOrders().subscribe((res: any) => {
      this.ordersData = res?.result
      this.filteredData = res?.result
      this.orderCount += this.ordersData.length
      for (let order of this.ordersData) {
        order.orderDate = new Date(order.orderDate).toDateString()
        this.totalRevenue += order.total
      }
      this.dtTrigger.next();
    })
  }

  checkToDate() {
    let fromDate = this.orderForm.get("fromDate")?.value
    let toDate = this.orderForm.get("toDate")?.value
    if (toDate < fromDate) {
      this.isDateValid = false
      this.toastr.error("Kindly enter a valid To date")
    } else {
      this.isDateValid = true
    }
  }

  reloadPage() {
    window.location.reload()
  }

  onSubmit() {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
