import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { storeTimerEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class StoretimerService {
  storeTimerEndpoints = storeTimerEndpoints

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  manageStoreTimer(data: any) {
    const url = this.CommonService.getFullUrl(this.storeTimerEndpoints.manageStoreTimer);
    return this.HttpClient.post(`${url}`, data);
  }

  storeTimers() {
    const url = this.CommonService.getFullUrl(this.storeTimerEndpoints.storeTimers);
    return this.HttpClient.get(`${url}`);
  }

  storeTimer(query: string) {
    const url = this.CommonService.getFullUrl(this.storeTimerEndpoints.storeTimer + `?day=${query}`);
    return this.HttpClient.get(`${url}`);
  }
}
