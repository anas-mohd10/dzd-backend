import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { couponsEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {
  couponsEndpoints = couponsEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addCoupon(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.add_coupon);
    return this.http.post(`${url}`, data);
  }

  getCoupons() {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupon);
    return this.http.get(`${url}`);
  }

  getActiveCoupons() {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_active_coupons);
    return this.http.get(`${url}`);
  }

  getCouponsByProduct(data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupons_product);
    return this.http.post(`${url}`, data);
  }

  getCouponBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupon_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateCoupon(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.update_coupon + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }

  searchCoupon(query: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.search_coupon + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, query);
  }

  getCouponCount() {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupon_count);
    return this.http.get(`${url}`);
  }

  getCouponPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.couponsEndpoints.get_coupon_page + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

}
