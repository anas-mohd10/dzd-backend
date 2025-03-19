import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { customerEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  customerEndpoints = customerEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addCustomer(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.addCustomer);
    return this.http.post(`${url}`, data)
  }

  getCustomers() {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer);
    return this.http.get(`${url}`)
  }

  getActiveCustomers() {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_active_customers);
    return this.http.get(`${url}`)
  }

  getCustomerByMail(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_by_mail);
    return this.http.post(`${url}`, data)
  }

  getCustomerBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`)
  }

  getCustomerDetails(customer: string) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.getCustomerDetails + `/${customer}`);
    return this.http.get(`${url}`)
  }

  getReferralHistory(customer: string, page: number, limit: number, keyword: string) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.referralHistory + `/${customer}` + `?page=` + page + `&limit=` + limit + `&keyword=` + keyword);
    return this.http.get(`${url}`)
  }

  getCustomerByNum(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_by_number);
    return this.http.post(`${url}`, data)
  }

  getCustomersCoumt() {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_count);
    return this.http.get(`${url}`)
  }

  searchCustomers(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.search_customers);
    return this.http.post(`${url}`, data)
  }

  updateCustomer(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.update_customer + "?customerId=" + slug);
    return this.http.put(`${url}`, data)
  }

  addAddress(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.add_address);
    return this.http.post(`${url}`, data)
  }

  getAddress(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_address);
    return this.http.post(`${url}`, data)
  }

  deleteAddress(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.delete_address + `/${data}`);
    return this.http.get(`${url}`)
  }

  deleteCustomer(userid: string) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.deleteCustomer + `/${userid}`);
    return this.http.delete(`${url}`)
  }

  getAddressDetails(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_address_details + `/${data}`);
    return this.http.get(`${url}`)
  }

  getDefaultAddress(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_default_address);
    return this.http.post(`${url}`, data)
  }

  updateDefaultAddress(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.update_default_address + `/${data}`);
    return this.http.get(`${url}`)
  }

  bulkFileUpload(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.usersBulkImport);
    return this.http.post(`${url}`, data);
  }


  bulkSubscribersFileUpload(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.subscribersBulkImport);
    return this.http.post(`${url}`, data);
  }

  updateCustomerAddress(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.update_customer_address);
    return this.http.put(`${url}`, data)
  }

  getWishlist(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.wishlist);
    return this.http.post(`${url}`, data)
  }

  getWishlistDetails(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.wishlist_details + `/${data}`);
    return this.http.get(`${url}`)
  }

  getTopWishlisted() {
    const url = this.commonService.getFullUrl(this.customerEndpoints.topWishlisted);
    return this.http.get(`${url}`)
  }

  searchSubscribers(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.search_subscribers);
    return this.http.post(`${url}`, data)
  }

  deleteSubscriber(subscriber: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.delete_subscriber + `/${subscriber}`);
    return this.http.get(`${url}`)
  }

  downloadSubscribers() {
    const url = this.commonService.getFullUrl(this.customerEndpoints.download_subscribers);
    return this.http.get(`${url}`)
  }

  createTransaction(data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.addToWallet);
    return this.http.post(`${url}`, data)
  }

  getTransactions(query: { customerId: string, type: string, pageIndex: number, pageSize: number, keyword: string }) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.getWalletTransactions);
    return this.http.post(`${url}`, query)
  }

  getLoyaltyTransactions(customer: string, type: string) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.getLoyaltyTransactions + `/${customer}` + `?type=` + type);
    return this.http.get(`${url}`)
  }

  getNewsletterSubscribers(page: number, limit: number, keyword: string) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.getNewsletterSubscribers + `?page=${page}&limit=${limit}&keyword=${keyword}`);
    return this.http.get(`${url}`)
  }

  customerDetails(query: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.customerDetails);
    return this.http.post(`${url}`, query)
  }
}
