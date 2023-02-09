import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { externalShippingEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ExternalShippingService {
  externalShippingEndpoints = externalShippingEndpoints

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addShipping(data: any) {
    const url = this.commonService.getFullUrl(this.externalShippingEndpoints.create);
    return this.http.post(`${url}`, data)
  }

  getAllShippings(data: any) {
    const url = this.commonService.getFullUrl(this.externalShippingEndpoints.get_data);
    return this.http.post(`${url}`, data)
  }

  getShipping(data: any) {
    const url = this.commonService.getFullUrl(this.externalShippingEndpoints.get_single_data);
    return this.http.post(`${url}`, data)
  }

  updateShipping(data: any) {
    const url = this.commonService.getFullUrl(this.externalShippingEndpoints.update);
    return this.http.put(`${url}`, data)
  }
}
