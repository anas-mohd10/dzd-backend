import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shippingEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  endpoints = shippingEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  manageShipping(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.manageShipping);
    return this.HttpClient.post(`${url}`, data)
  }

  shippingDetails() {
    const url = this.CommonService.getFullUrl(this.endpoints.shippingDetails);
    return this.HttpClient.get(`${url}`)
  }

  createShippingCharge(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.createShippingCharge);
    return this.HttpClient.post(`${url}`, data)
  }

  updateShippingCharge(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.updateShippingCharge);
    return this.HttpClient.put(`${url}`, data)
  }

  deleteShippingCharge(chargeId: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.deleteShippingCharge + `/${chargeId}`);
    return this.HttpClient.delete(`${url}`)
  }

  getShippingCharges(blacklisted?: string) {
    const url = this.CommonService.getFullUrl(this.endpoints.getShippingCharges + `?blacklisted=${blacklisted}`);
    return this.HttpClient.get(`${url}`)
  }

  getShippingChargeDetails(chargeId: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.getShippingChargeDetails + `/${chargeId}`);
    return this.HttpClient.get(`${url}`)
  }
}
