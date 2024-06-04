import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { paymentDetailsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manage(data: any) {
    const url = this.commonService.getFullUrl(paymentDetailsEndpoints.manage);
    return this.http.post(`${url}`, data);
  }

  getPaymentDetails(pgId: string) {
    const url = this.commonService.getFullUrl(paymentDetailsEndpoints.get + `/${pgId}`);
    return this.http.get(`${url}`);
  }
}
