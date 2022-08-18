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

  getOrder(slug: any) {
  }

  getOrdersByStatus(status: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_status + "?status=" + status);
    return this.http.get(`${url}`)
  }

  getOrdersByNumber(number: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_orderno + "?number=" + number);
    console.log(url);

    return this.http.get(`${url}`)
  }

  updateOrder(number: any, data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.update_order + "?number=" + number);
    return this.http.put(`${url}`, data)
  }
}
