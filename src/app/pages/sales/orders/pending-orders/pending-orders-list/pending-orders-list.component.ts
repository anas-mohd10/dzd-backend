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
  }

  checkToDate() {
    let fromDate = this.orderForm.get("fromDate")?.value
    let toDate = this.orderForm.get("toDate")?.value
    if (toDate < fromDate) {
      this.isDateValid = false
      this.toastr.error("Kindly enter a valid To date", '', {
        progressBar: true,
      })
    } else {
      this.isDateValid = true
    }
  }

  reloadPage() {
    window.location.reload()
  }

  onSubmit() { }

}
