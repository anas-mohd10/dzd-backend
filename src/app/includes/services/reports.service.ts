import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productReportEndpoints, reportsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  reportsEndpoints = reportsEndpoints
  productReportEndpoints = productReportEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  downloadSubscribers() {
    return this.commonService.getFullUrl(this.reportsEndpoints.downloadSubscribers);
  }

  customerOrderReport() {
    const url = this.commonService.getFullUrl(reportsEndpoints.customerOrderReport);
    return this.http.get(`${url}`);
  }

  salesReport(dateRange: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.salesReport + `?dateRange=${dateRange}`);
    return this.http.get(`${url}`);
  }

  productReport() {
    const url = this.commonService.getFullUrl(reportsEndpoints.productReport);
    return this.http.get(`${url}`);
  }

  orderReport() {
    const url = this.commonService.getFullUrl(reportsEndpoints.orderReport);
    return this.http.get(`${url}`);
  }

  unfullfilledStockReport() {
    const url = this.commonService.getFullUrl(reportsEndpoints.unfullfilledStockReport);
    return this.http.get(`${url}`);
  }

  lowStockReport() {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.lowstockReport);
    return this.http.get(`${url}`);
  }

  abandonedOrderReport() {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.abandonedReport);
    return this.http.get(`${url}`);
  }

  enquiryReport() {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.enquiryReport);
    return this.http.get(`${url}`);
  }

  orderMovementReport() {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.orderMovementReport);
    return this.http.get(`${url}`);
  }

  productWiseDetailedOrderReport(query: any) {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.productWiseDetailedOrderReport);
    return this.http.post(`${url}`, query);
  }

  customerReport() {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.customerReport);
    return this.http.get(`${url}`);
  }
}
