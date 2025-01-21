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
    const url = this.commonService.getFullUrl(this.reportsEndpoints.downloadSubscribers);
    return this.http.get(`${url}`);
  }
  lowStockReport() {
    const url = this.commonService.getFullUrl(productReportEndpoints.lowstockReport);
    return this.http.get(`${url}`);
  }

  customerOrderReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.customerOrderReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  salesReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.salesReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  productReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.productReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  orderReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.orderReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  orderOverTimeReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.orderOverTimeReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  detailedOrderReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.detailedOrderReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  unfullfilledStockReport() {
    const url = this.commonService.getFullUrl(reportsEndpoints.unfullfilledStockReport);
    return this.http.get(`${url}`);
  }


  abandonedOrderReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.abandonedReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  productWiseSalesReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.productwiseSalesReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }

  enquiryReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.enquiryReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
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

  customerReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.customerReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }


  detailedOrdersOverTimeReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(this.productReportEndpoints.ordersOverTimeReport + `?dateRange=${dateRange}`);
    return this.http.get(`${url}`);
  }

  basicProductReport() {
    console.log("rescched here--------------")
    const url = this.commonService.getFullUrl(reportsEndpoints.basicProductReport);
    return this.http.get(`${url}`);
  }




  productOrderReport(dateRange: string, startDate?: string, endDate?: string) {
    const url = this.commonService.getFullUrl(reportsEndpoints.productOrderReport + `?dateRange=${dateRange}&startDate=${startDate}&endDate=${endDate}`);
    return this.http.get(`${url}`);
  }
}
