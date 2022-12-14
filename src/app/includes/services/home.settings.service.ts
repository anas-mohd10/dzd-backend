import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { homeSettingsEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HomeSettingsService {
  homeSettingsEndpoints = homeSettingsEndpoints
  APP_DASHBOARD_URL = environment.appBaserl + "dashboard"

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addHomeSettings(data: any) {
    const url = this.commonService.getFullUrl(this.homeSettingsEndpoints.add_home_settings);
    return this.http.post(`${url}`, data);
  }

  getHomeSettings() {
    const url = this.commonService.getFullUrl(this.homeSettingsEndpoints.get_home_settings);
    return this.http.get(`${url}`);
  }

  getHomeSettingsCount() {
    const url = this.commonService.getFullUrl(this.homeSettingsEndpoints.get_home_settings_count);
    return this.http.get(`${url}`);
  }

  getHomeSetting(id: any) {
    const url = this.commonService.getFullUrl(this.homeSettingsEndpoints.get_home_setting + "?id=" + id);
    return this.http.get(`${url}`);
  }

  updateHomeSettings(data: any) {
    const url = this.commonService.getFullUrl(this.homeSettingsEndpoints.update_home_settings);
    return this.http.put(`${url}`, data);
  }

  appDashboard(data: any) {
    return this.http.post(this.APP_DASHBOARD_URL, data)
  }
}
