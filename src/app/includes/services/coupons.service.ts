import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { couponsEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {
  couponsEndpoints = couponsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addCoupon(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.add_coupon);
    return this.http.post(`${url}`, data);
  }

  getApplicableCoupons(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.getApplicableCoupons);
    return this.http.post(`${url}`, data);
  }

  getCoupons(params: any = {}) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupon);
    return this.http.get(`${url}`, { params });
  }

  getActiveCoupons() {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_active_coupons);
    return this.http.get(`${url}`);
  }

  getProductCoupons(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_product_cpupons);
    return this.http.post(`${url}`, data);
  }

  getCouponDetails(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupon_details);
    return this.http.post(`${url}`, data);
  }

  updateCoupon(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.update_coupon);
    return this.http.put(`${url}`, data);
  }

  searchCoupons(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.search_coupon);
    return this.http.post(`${url}`, data);
  }
}
