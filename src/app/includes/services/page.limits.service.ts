import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pageLimitsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PageLimitsService {
  pageLimitsEndpoints = pageLimitsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addPageLimit(data: any) {
    const url = this.commonService.getFullUrl(this.pageLimitsEndpoints.add_page_limits);
    return this.http.post(`${url}`, data);
  }

  getPageLimits() {
    const url = this.commonService.getFullUrl(this.pageLimitsEndpoints.get_page_limits);
    return this.http.get(`${url}`);
  }

  getPageLimit(id: any) {
    const url = this.commonService.getFullUrl(this.pageLimitsEndpoints.get_page_limit + "?id=" + id);
    return this.http.get(`${url}`);
  }

  getPageLimitsCount() {
    const url = this.commonService.getFullUrl(this.pageLimitsEndpoints.get_page_limits_count);
    return this.http.get(`${url}`);
  }

  updatePageLimit(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.pageLimitsEndpoints.update_page_limit + "?id=" + slug);
    return this.http.put(`${url}`, data);
  }

}
