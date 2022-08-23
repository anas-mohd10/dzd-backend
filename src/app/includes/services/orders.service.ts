import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { orderEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  orderEndpoints = orderEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addOrder(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.add_order);
    return this.http.post(`${url}`, data)
  }

  getOrders() {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order);
    return this.http.get(`${url}`)
  }

  getOrderByPayment(method: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_payment + "?payment=" + method);
    return this.http.get(`${url}`)
  }

  getOrderByStatus(status: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_status + "?status=" + status);
    return this.http.get(`${url}`)
  }

  getOrderByDate(status: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order + "?status=" + status);
    return this.http.get(`${url}`)
  }

  getOrderByPaymentAndStatus(method: any, status: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_payment_and_order + "?status=" + status + "&payment=" + method);
    return this.http.get(`${url}`)
  }

  getOrderByDateAndStatus(ldate: any, gdate: any, status: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_status_date + "?s=" + status + "&ld=" + ldate + "&ud=" + gdate);
    return this.http.get(`${url}`)
  }

  getOrdersByStatus(status: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_payment_and_order + "?status=" + status);
    return this.http.get(`${url}`)
  }

  getOrdersByNumber(number: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_orderno + "?number=" + number);
    return this.http.get(`${url}`)
  }

  updateOrder(number: any, data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.update_order + "?number=" + number);
    return this.http.put(`${url}`, data)
  }
}
