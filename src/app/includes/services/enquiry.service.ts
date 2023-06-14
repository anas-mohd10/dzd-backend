import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { enquiryEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  enquiryEndpoints = enquiryEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addEnquiry(data: any) {
    const url = this.commonService.getFullUrl(this.enquiryEndpoints.add);
    return this.http.post(`${url}`, data)
  }

  searchEnquiry(data: any) {
    const url = this.commonService.getFullUrl(this.enquiryEndpoints.search);
    return this.http.post(`${url}`, data)
  }

  updateEnquiry(data: any) {
    const url = this.commonService.getFullUrl(this.enquiryEndpoints.update);
    return this.http.put(`${url}`, data)
  }
}
