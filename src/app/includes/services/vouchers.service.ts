import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { voucherEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  voucherEndpoints = voucherEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addVoucher(data: any) {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.add_voucher);
    return this.http.post(`${url}`, data);
  }

  getVouchers() {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.get_vouchers);
    return this.http.get(`${url}`);
  }

  getVoucher(slug: any) {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.get_voucher_by_slug + "?slug=" + slug);
    return this.http.get(`${url}`);
  }

  updateVoucher(data: any, slug: any) {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.update_voucher + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }

  getVoucherCount() {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.get_vouchers_count);
    return this.http.get(`${url}`);
  }

  getVoucherByPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.get_voucher_page + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  searchVoucher(data: any, page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.voucherEndpoints.search_voucher + "?page=" + page + "&limit=" + limit);
    return this.http.post(`${url}`, data);
  }
}
