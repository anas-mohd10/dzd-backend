import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/includes/services/orders.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pending-orders-list',
  templateUrl: './pending-orders-list.component.html',
  styleUrls: ['./pending-orders-list.component.scss']
})
export class PendingOrdersListComponent implements OnInit {
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
    this.initForm()
    this.getPendingOrders()
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
      paymentMethod: [''],
      orderStatus: [''],
    });
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

  getPendingOrders() {
    this.ordersService.getPendingOrders().subscribe((res: any) => {
      this.ordersData = res?.result
    })
  }

  onSubmit() { }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
