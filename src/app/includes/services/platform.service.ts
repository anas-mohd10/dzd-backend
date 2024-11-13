import { Injectable } from '@angular/core';
import { platformEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  getRedirectionResults(data: any) {
    const url = this.CommonService.getFullUrl(platformEndpoints.redirectionResults);
    return this.HttpClient.post(`${url}`, data);
  }
}
