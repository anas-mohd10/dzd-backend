import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  appRoute = appRoutes
  exportUrl: string = environment.apiUrl

  constructor(
    private ReportsService: ReportsService,
    private ToastrService: ToastrService,
    private Router: Router
  ) { }

  ngOnInit(): void {
  }

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
