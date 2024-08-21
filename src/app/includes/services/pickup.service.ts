import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pickupEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PickupService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  create(data: any) {
    const url = this.CommonService.getFullUrl(pickupEndpoints.createPickup);
    return this.HttpClient.post(`${url}`, data);
  }

  update(pickupId: string, data: any) {
    const url = this.CommonService.getFullUrl(pickupEndpoints.updatePickup + `/${pickupId}`);
    return this.HttpClient.put(`${url}`, data);
  }

  search(data: any) {
    const url = this.CommonService.getFullUrl(pickupEndpoints.searchPickups);
    return this.HttpClient.post(`${url}`, data);
  }

  delete(pickupId: string){
    const url = this.CommonService.getFullUrl(pickupEndpoints.deletePickup + `/${pickupId}`);
    return this.HttpClient.delete(`${url}`);
  }

  details(pickupId: string){
    const url = this.CommonService.getFullUrl(pickupEndpoints.pickupDetails + `/${pickupId}`);
    return this.HttpClient.get(`${url}`);
  }
}
