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

  getOrders(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order);
    return this.http.post(`${url}`, data)
  }

  getOrderDetails(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.order_details);
    return this.http.post(`${url}`, data)
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

  getOrdersByRefid(number: any, data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_by_refid + "?number=" + number);
    return this.http.post(`${url}`, data)
  }

  getOrderCount() {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order_count);
    return this.http.get(`${url}`)
  }

  updateOrder(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.update_order);
    return this.http.put(`${url}`, data)
  }

  exportOrderReport(type: string, data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.detailed_report + `/${type}`);
    return this.http.post(`${url}`, data)
  }

  searchOrder(query: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.search_order);
    return this.http.post(`${url}`, query)
  }

  searchPendingOrder(query: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.search_pending_orders);
    return this.http.post(`${url}`, query)
  }

  getStatusList(status: string, delivery: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.getStatusList + '?status=' + status + '&delivery=' + delivery);
    return this.http.get(`${url}`)
  }

  updateOrderStatus(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.updateOrderStatus);
    return this.http.put(`${url}`, data)
  }

  cancelOrderDetails(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.cancelOrderDetails);
    return this.http.put(`${url}`, data)
  }

  updateOrderProducts(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.updateOrderProducts);
    return this.http.put(`${url}`, data)
  }

  getOrderCounts(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.orderCounts);
    return this.http.post(`${url}`, data)
  }

  updateProductPayment(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.updateProductPayement);
    return this.http.put(`${url}`, data)
  }

  manageTags(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.manageTags);
    return this.http.post(`${url}`, data)
  }
}
