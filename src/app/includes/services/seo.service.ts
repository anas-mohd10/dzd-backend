import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { seoEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class SeoService {
  seoEndpoints = seoEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageSeoDetails(data: any) {
    const url = this.commonService.getFullUrl(this.seoEndpoints.manage);
    return this.http.post(`${url}`, data)
  }

  getSeoDetails() {
    const url = this.commonService.getFullUrl(this.seoEndpoints.list);
    return this.http.get(`${url}`)
  }

  getSeoDetailsById(data: any) {
    const url = this.commonService.getFullUrl(this.seoEndpoints.details + `/${data}`);
    return this.http.get(`${url}`)
  }
}
