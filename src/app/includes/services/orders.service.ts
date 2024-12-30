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

  addOrderNote(orderNo: string, message: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.addOrderNote);
    return this.http.post(url, { orderNo, message });
  }
  
  addOrder(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.add_order);
    return this.http.post(`${url}`, data)
  }

  getInvoiceSignedUrl(orderId: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.getInvoiceSignedUrl + `/${orderId}`);
    return this.http.get(`${url}`)
  }

  getPackingSlipSignedUrl(orderId: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.getPackingSlipSignedUrl + `/${orderId}`);
    return this.http.get(`${url}`)
  }

  getInvoicesSignedUrl(orderIds: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.getInvoicesSignedUrl + `/${orderIds}`);
    return this.http.get(`${url}`)
  }

  getPackingSlipsSignedUrl(orderIds: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.getPackingSlipsSignedUrl + `/${orderIds}`);
    return this.http.get(`${url}`)
  }

  getOrders(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.get_order);
    return this.http.post(`${url}`, data)
  }
  listOrders(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.list_orders);
    return this.http.post(`${url}`, data)
  }

  bulkOrders(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.bulk_orders);
    return this.http.post(`${url}`, data)
  }

  getCustomerOrders(customerId: string, page: number) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.customerOrders + `/${customerId}?page${page}`);
    return this.http.get(`${url}`)
  }

  exportOrderTabs(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.exportOrderTabs);
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

  manageTags(data: any, type: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.manageTags + '?type=' + type);
    return this.http.post(`${url}`, data)
  }

  updateBulkProduct(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.updateBulkProduct);
    return this.http.put(`${url}`, data)
  }

  invoiceDetails(order: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.invoiceDetails + `/${order}`);
    return this.http.get(`${url}`)
  }

  orderPaymentAcceptance(order: string) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.orderPaymentAcceptance + `?order=${order}`);
    return this.http.get(`${url}`)
  }

  bulkAcceptOrders(orderIds: { orderIds: string[] }) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.bulkAcceptOrders);
    return this.http.post(`${url}`, orderIds)
  }

  bulkFileUpload(data: any) {
    const url = this.commonService.getFullUrl(this.orderEndpoints.bulkUpdateOrders);
    return this.http.post(`${url}`, data);
  }
}
