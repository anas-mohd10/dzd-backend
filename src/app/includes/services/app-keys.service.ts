import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appKeysEndpoints } from 'src/app/config/endpoints/index';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AppKeysService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  manageKeys(data: any) {
    const url = this.CommonService.getFullUrl(appKeysEndpoints.manageKeys);
    return this.HttpClient.post(`${url}`, data);
  }

  keyDetails() {
    const url = this.CommonService.getFullUrl(appKeysEndpoints.keyDetails);
    return this.HttpClient.get(`${url}`);
  }
}
