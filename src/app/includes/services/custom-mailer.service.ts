import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { customMailerEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CustomMailerService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  manageCustomMailers(data: any) {
    const url = this.commonService.getFullUrl(customMailerEndpoints.manageCustomMailer);
    return this.http.post(`${url}`, data)
  }

  customMailers(customMailer: string) {
    const url = this.commonService.getFullUrl(customMailerEndpoints.customMailer + `?type=${customMailer}`);
    return this.http.get(`${url}`)
  }
}
