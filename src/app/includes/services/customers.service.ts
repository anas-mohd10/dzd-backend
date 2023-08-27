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
    const url = this.commonService.getFullUrl(this.customerEndpoints.add_customer);
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
    const url = this.commonService.getFullUrl(this.customerEndpoints.update_customer + "?slug=" + slug);
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
}
