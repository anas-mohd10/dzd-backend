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

  getCustomerByMail(email: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_by_mail + "?email=" + email);
    return this.http.get(`${url}`)
  }

  getCustomerBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`)
  }

  getCustomersCoumt() {
    const url = this.commonService.getFullUrl(this.customerEndpoints.get_customer_count);
    return this.http.get(`${url}`)
  }

  updateCustomer(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.customerEndpoints.update_customer + "?slug=" + slug);
    return this.http.put(`${url}`, data)
  }
}
