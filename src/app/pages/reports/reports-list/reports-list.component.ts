import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
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
  dateRange: string = '15'
  dateRanges: Array<any> = [
    { title: '15 Days', description: 'Get the sales report for last 15 days', dateRange: '15' },
    { title: '1 Months', description: 'Get the sales report for last 30 days', dateRange: '1' },
    { title: '3 Months', description: 'Get the sales report for last 3 months', dateRange: '3' },
    { title: '6 Months', description: 'Get the sales report for last 6 months', dateRange: '6' },
    { title: '12 Months', description: 'Get the sales report for last 12 months', dateRange: '12' },
  ]

  constructor(
    private ReportsService: ReportsService,
    private ToastrService: ToastrService,
    private Router: Router,
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
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
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.productReport
        break
      case 'order':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.orderReport
        break
      case 'order-detailed':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.detailedOrderReport
        break
      case 'customer':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.customerReport
        break
      case 'customer-order':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.customerOrderReport
        break
      case 'product-order':
        this.exportUrl = '/api/v1/w/admin/auth' + reportsEndpoints.productOrderReport
        break
    }
  }

  toggleSalesReport(dateRange: string) {
    this.dateRange = dateRange
  }

  salesReport() {
    this.ReportsService.salesReport(this.dateRange).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.closeSales()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err.error.message)
      }
    })
  }
}
