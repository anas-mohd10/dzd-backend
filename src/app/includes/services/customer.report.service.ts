import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { customerReportEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CustomerReportService {
  customerReportEndpoints = customerReportEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getCustomerReports() {
    const url = this.commonService.getFullUrl(this.customerReportEndpoints.get_customer_report);
    return this.http.get(`${url}`);
  }

  getCustomerReport(data: any) {
    const url = this.commonService.getFullUrl(this.customerReportEndpoints.customer_report);
    return this.http.post(`${url}`, data);
  }
}
