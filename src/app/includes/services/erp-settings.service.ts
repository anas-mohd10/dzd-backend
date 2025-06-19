import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { erpSettingsEndpoints } from '../../config/endpoints'; // Assuming you'll add this to your endpoints config

@Injectable({
  providedIn: 'root'
})
export class ErpSettingsService {
  erpSettingsEndpoints = erpSettingsEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  /**
   * Gets all ERP settings from the backend.
   * The response is expected to be an object containing all ERP configurations.
   * e.g., { odooEnabled: true, odooUrl: '...', netsuiteEnabled: false, ... }
   */
  getErpSettings() {
    const url = this.commonService.getFullUrl(this.erpSettingsEndpoints.get_erp_settings);
    return this.http.get(`${url}`);
  }

  /**
   * Updates all ERP settings.
   * @param data An object containing all ERP settings to be updated.
   * e.g., { odooEnabled: true, odooUrl: '...', netsuiteEnabled: false, ... }
   */
  updateErpSettings(data: any) {
    const url = this.commonService.getFullUrl(this.erpSettingsEndpoints.update_erp_settings);
    return this.http.put(`${url}`, data);
  }

  // Add other methods as needed, e.g., for enabling/disabling an ERP integration
}