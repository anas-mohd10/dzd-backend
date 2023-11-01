import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { appsEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AppsService {
  endpoints = appsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageApps(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.manageApps);
    return this.http.post(`${url}`, data);
  }

  getApps() {
    const url = this.commonService.getFullUrl(this.endpoints.apps);
    return this.http.get(`${url}`);
  }

  appIcons(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.appIcons);
    return this.http.post(`${url}`, data);
  }

  splashIcons(data: any) {
    const url = this.commonService.getFullUrl(this.endpoints.splashIcons);
    return this.http.post(`${url}`, data);
  }
}
