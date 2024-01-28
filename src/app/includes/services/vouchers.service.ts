import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { voucherEndpoints } from 'src/app/config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  endpoints = voucherEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  createVoucher(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.createVoucher);
    return this.http.post(`${url}`, data);
  }

  getVoucherDetails(voucher: string) {
    const url = this.commonService.getFullUrl(this.endpoints.getVoucherDetails + `/${voucher}`);
    return this.http.get(`${url}`);
  }

  updateVoucher(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.updateVoucher);
    return this.http.put(`${url}`, data);
  }

  deleteVoucher(voucher: string) {
    const url = this.commonService.getFullUrl(this.endpoints.deleteVoucher + `/${voucher}`);
    return this.http.delete(`${url}`);
  }

  searchVoucher(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.searchVouchers);
    return this.http.post(`${url}`, data);
  }

  
}
