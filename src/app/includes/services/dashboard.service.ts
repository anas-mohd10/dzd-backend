import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { dashboardEndpoints } from 'src/app/config/endpoints/dashboard.endpoints';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  dashboardEndpoints = dashboardEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getDashboard(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.dashboard);
    return this.http.post(`${url}`, data)
  }
}
