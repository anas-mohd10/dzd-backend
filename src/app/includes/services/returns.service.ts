import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { returnsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

interface Query {
  page: number;
  limit: number;
  keyword: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  getReturns(query: Query) {
    const url = this.commonService.getFullUrl(returnsEndpoints.returns);
    return this.http.post(`${url}`, query);
  }

  getReturnDetails(returnId: string) {
    const url = this.commonService.getFullUrl(returnsEndpoints.returns + `/${returnId}`);
    return this.http.get(`${url}`);
  }

  updateReturn(query: any) {
    const url = this.commonService.getFullUrl(returnsEndpoints.updateReturn);
    return this.http.put(`${url}`, query);
  }
}
