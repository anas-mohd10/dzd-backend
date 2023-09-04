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

  addSeoDetails(data: any) {
    const url = this.commonService.getFullUrl(this.seoEndpoints.create);
    return this.http.post(`${url}`, data)
  }

  getSeoDetails() {
    const url = this.commonService.getFullUrl(this.seoEndpoints.findAll);
    return this.http.get(`${url}`)
  }

  getSeoDetailsById(data: any) {
    const url = this.commonService.getFullUrl(this.seoEndpoints.find + `/${data}`);
    return this.http.get(`${url}`)
  }

  updateSeoDetails(data: any) {
    const url = this.commonService.getFullUrl(this.seoEndpoints.update);
    return this.http.put(`${url}`, data)
  }
}
