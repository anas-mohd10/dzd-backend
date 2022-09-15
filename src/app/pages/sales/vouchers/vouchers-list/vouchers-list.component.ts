import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { appRoutes } from 'src/app/config/routes';
import { VouchersService } from 'src/app/includes/services/vouchers.service';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss']
})
export class VouchersListComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: true })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  appRoute = appRoutes
  vouchersData: any;
  displayTable: boolean;

  constructor(
    private vouchersService: VouchersService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      lengthMenu: [5, 10, 15],
      pageLength: 10,
      processing: true,
    };
    this.getVouchers()
  }

  getVouchers() {
    this.vouchersService.getVouchers().subscribe((res: any) => {
      this.vouchersData = res?.result
      for (let i = 0; i < this.vouchersData.length; i++) {
        this.vouchersData[i].fromDate = new Date(this.vouchersData[i].fromDate).toDateString();
        this.vouchersData[i].lastDate = new Date(this.vouchersData[i].lastDate).toDateString();
      }
      this.dtTrigger.next();
      this.displayTable = true;
    })
  }
}
