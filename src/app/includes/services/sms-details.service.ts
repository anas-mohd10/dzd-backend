import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { smsDetailsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class SmsDetailsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manage(data: any) {
    const url = this.commonService.getFullUrl(smsDetailsEndpoints.manage);
    return this.http.post(`${url}`, data);
  }

  getSmsDetails(smsId: string) {
    const url = this.commonService.getFullUrl(smsDetailsEndpoints.get + `/${smsId}`);
    return this.http.get(`${url}`);
  }

  getSmsGateways() {
    const url = this.commonService.getFullUrl(smsDetailsEndpoints.fetch);
    return this.http.get(`${url}`);
  }
}
