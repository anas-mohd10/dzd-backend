import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { reportsEndpoints } from 'src/app/config/endpoints';
import { appRoutes } from 'src/app/config/routes';
import { ReportsService } from 'src/app/includes/services/reports.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  appRoute = appRoutes;
  salesRef: BsModalRef
  exportUrl: string = environment.apiUrl

  constructor(
    private ReportsService: ReportsService,
    private ToastrService: ToastrService,
    private Router: Router,
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  //Open sales modal
  openSales(template: TemplateRef<any>) {
    this.salesRef = this.BsModalService.show(template)
  }

  closeSales() {
    this.salesRef?.hide()
  }
  //Open sales modal

  exportReport(type: string) {
    switch (type) {
      case 'product':
        this.exportUrl = environment.apiUrl + reportsEndpoints.productReport
        break
      case 'order':
        this.exportUrl = environment.apiUrl + reportsEndpoints.orderReport
        break
      case 'order-detailed':
        this.exportUrl = environment.apiUrl + reportsEndpoints.detailedOrderReport
        break
      case 'customer':
        this.exportUrl = environment.apiUrl + reportsEndpoints.customerReport
        break
      case 'customer-order':
        this.exportUrl = environment.apiUrl + reportsEndpoints.customerOrderReport
        break
      case 'product-order':
        this.exportUrl = environment.apiUrl + reportsEndpoints.productOrderReport
        break
    }
  }
}
