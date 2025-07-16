import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shipmentEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  endpoints = shipmentEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createShipment(doc: { orderId: string, gateway: string | null }) {
    const url = this.CommonService.getFullUrl(this.endpoints.create);
    return this.HttpClient.post(`${url}`, doc)
  }
}
