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
}
