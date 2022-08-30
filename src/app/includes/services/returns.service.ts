import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { returnsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {
  returnsEndpoints = returnsEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  createReturn(data: any) {
    const url = this.commonService.getFullUrl(this.returnsEndpoints.create_return);
    return this.http.post(`${url}`, data);
  }

  getReturnLists() {
    const url = this.commonService.getFullUrl(this.returnsEndpoints.get_returns);
    return this.http.get(`${url}`);
  }

  getReturnList(order: any) {
    const url = this.commonService.getFullUrl(this.returnsEndpoints.get_return + "?order=" + order);
    return this.http.get(`${url}`);
  }

  updateReturnList(order: any, data: any) {
    const url = this.commonService.getFullUrl(this.returnsEndpoints.update_return + "?order=" + order);
    return this.http.put(`${url}`, data);
  }
}
