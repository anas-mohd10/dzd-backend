import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { invoiceSettingsEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class InvoiceSettingsService {
  invoiceSettingsEndpoints = invoiceSettingsEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addInvoiceSettings(data: any) {
    const url = this.commonService.getFullUrl(this.invoiceSettingsEndpoints.add_invoice);
    return this.http.post(`${url}`, data);
  }

  getInvoiceSettings() {
    const url = this.commonService.getFullUrl(this.invoiceSettingsEndpoints.get_invoice);
    return this.http.get(`${url}`);
  }

  updateInvoiceSettings(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.invoiceSettingsEndpoints.update_invoice + "?slug=" + slug);
    return this.http.put(`${url}`, data);
  }
}
