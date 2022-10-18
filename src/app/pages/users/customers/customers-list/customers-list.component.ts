import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from "../../../../config/routes/app.routes"
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CustomersService } from 'src/app/includes/services/customers.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes;
  customersData: any;
  isTable: boolean = false;
  customersCount: any;

  constructor(
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };

    this.customersService.getCustomersCoumt().subscribe((res: any) => {
      this.customersCount = res?.result
      this.cdr.markForCheck()
    })

    this.customersService.getCustomers().subscribe((res: any) => {
      this.customersData = res?.result
      this.isTable = true
      this.dtTrigger.next();
      this.cdr.markForCheck()
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
