import { Injectable } from '@angular/core';
import { helpcenterEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {
  endpoints = helpcenterEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manage(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.manage);
    return this.http.post(`${url}`, data)
  }

  getDetails() {
    const url = this.commonService.getFullUrl(this.endpoints.getDetails);
    return this.http.get(`${url}`)
  }

  shareVerification(){
    const url = this.commonService.getFullUrl(this.endpoints.shareVerification);
    return this.http.get(`${url}`)
  }

  verifyEmail(data: any){
    const url = this.commonService.getFullUrl(this.endpoints.verifyEmail);
    return this.http.post(`${url}`, data)
  }
}
