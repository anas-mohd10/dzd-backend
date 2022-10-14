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

  getOrders(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`)
  }

  getPendingOrders() {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_pending_orders);
    return this.http.get(`${url}`)
  }

  getPendingOrdersByNumber(number: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_pending_orders_by_orderNo + "?number=" + number);
    return this.http.get(`${url}`)
  }

  getOrdersByNumber(number: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_orderno + "?number=" + number);
    return this.http.get(`${url}`)
  }

  getOrderCount() {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_count);
    return this.http.get(`${url}`)
  }

  updateOrder(number: any, data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.update_order + "?number=" + number);
    return this.http.put(`${url}`, data)
  }

  //report
  getOrderReport() {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_report);
    return this.http.get(`${url}`)
  }

  searchOrder(query: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.search_order + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, query)
  }
}
