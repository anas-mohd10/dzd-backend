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

  getWebDashboard() {
    const url = this.commonService.getWebUrl(this.dashboardEndpoints.dashboard);
    return this.http.get(`${url}`)
  }

  publishDashboard(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.publish_dashboard);
    return this.http.post(`${url}`, data)
  }

  getDashboardConfig() {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.dashboard_config);
    return this.http.get(`${url}`)
  }

  previewDashboard(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.preview_dashboard);
    return this.http.post(`${url}`, data)
  }

  getMonthlyRevenue(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.monthly_revenue);
    return this.http.post(`${url}`, data)
  }

  getDaysRevenue(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.days_revenue);
    return this.http.post(`${url}`, data)
  }

  getTopSellingProducts(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.top_selling_products);
    return this.http.post(`${url}`, data)
  }

  getNewOrders(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.new_orders);
    return this.http.post(`${url}`, data)
  }

  currentRevenues(data: any) {
    const url = this.commonService.getFullUrl(this.dashboardEndpoints.currentRevenues);
    return this.http.post(`${url}`, data)
  }
}
