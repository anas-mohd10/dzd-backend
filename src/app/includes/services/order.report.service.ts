import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { orderReportEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class OrderReportService {
  orderReportEndpoints = orderReportEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getOrderReport() {
    const url = this.commonService.getFullUrl(this.orderReportEndpoints.get_order_reports);
    return this.http.get(`${url}`);
  }
}
