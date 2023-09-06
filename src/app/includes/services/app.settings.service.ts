import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generalSettingsEndpoints } from 'src/app/config/endpoints/general.settings.endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  generalSettingsEndpoints = generalSettingsEndpoints

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  addGeneralSettings(data: any) {
    const url = this.commonService.getFullUrl(this.generalSettingsEndpoints.add_general_settings);
    return this.http.post(`${url}`, data);
  }

  getGeneralSettings() {
    const url = this.commonService.getFullUrl(this.generalSettingsEndpoints.get_general_settings);
    return this.http.get(`${url}`);
  }

  getGeneralSettingsbyId(id: any) {
    const url = this.commonService.getFullUrl(this.generalSettingsEndpoints.get_general_settings_by_id + "?id=" + id);
    return this.http.get(`${url}`);
  }

  updateGeneralSettings(data: any) {
    const url = this.commonService.getFullUrl(this.generalSettingsEndpoints.update_general_settings);
    return this.http.put(`${url}`, data);
  }

  updateSettings(data: any) {
    const url = this.commonService.getFullUrl(this.generalSettingsEndpoints.update_settings);
    return this.http.put(`${url}`, data);
  }
}
