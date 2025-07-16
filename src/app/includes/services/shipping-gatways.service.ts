import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shippingGatewayEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingGatwaysService {
  endpoints = shippingGatewayEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  manageShippingGateway(data: any) {
    const url = this.CommonService.getFullUrl(this.endpoints.manage);
    return this.HttpClient.put(`${url}`, data)
  }

  shippingGateways(type?: string) {
    const url = this.CommonService.getFullUrl(this.endpoints.fetch + `?type=${type}`);
    return this.HttpClient.get(`${url}`)
  }

  shippingGateway(docId: string) {
    const url = this.CommonService.getFullUrl(this.endpoints.fetch + `/${docId}`);
    return this.HttpClient.get(`${url}`)
  }
}
