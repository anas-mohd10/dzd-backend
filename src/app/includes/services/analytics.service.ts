import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { analyticsEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  analyticsEndpoints = analyticsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageAnalytics(data: any) {
    const url = this.commonService.getFullUrl(this.analyticsEndpoints.manage_analytics);
    return this.http.post(`${url}`, data)
  }

  getAnalyticsDetails() {
    const url = this.commonService.getFullUrl(this.analyticsEndpoints.analytics_details);
    return this.http.get(`${url}`)
  }
}
